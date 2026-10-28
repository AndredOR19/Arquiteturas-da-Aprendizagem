#!/usr/bin/env python3
"""Confere integridade documental; nao certifica pedagogia ou acessibilidade."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors = []

def check(condition, message):
    if not condition:
        errors.append(message)

def local_file(value, context):
    if not isinstance(value, str) or not value:
        errors.append(f"{context}: caminho ausente")
        return None
    path = (ROOT / value).resolve()
    if not path.is_relative_to(ROOT):
        errors.append(f"{context}: caminho fora do repositorio")
        return None
    check(path.is_file(), f"{context}: arquivo ausente: {value}")
    return path if path.is_file() else None

def semver(value):
    return isinstance(value, str) and re.fullmatch(r"\d+\.\d+\.\d+", value) is not None

def main():
    cat_path = ROOT / "biblioteca-arquiteturas/catalogo.json"
    try:
        cat = json.loads(cat_path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        return 1
    check(cat.get("schema_version") == 1, "schema_version precisa ser 1")
    check(semver(cat.get("versao")), "versao do catalogo invalida")
    check(cat.get("base_dos_caminhos") == "raiz_do_repositorio", "base de caminhos invalida")
    prompt_file = local_file("PROMPT_MESTRE_AULAS_DIGITAIS.md", "prompt")
    prompt = prompt_file.read_text(encoding="utf-8") if prompt_file else ""
    match = re.search(r"Versão vigente: \*\*([\d.]+)\*\*", prompt)
    version = match.group(1) if match else None
    check(cat.get("prompt_compativel") == version, "prompt e catalogo incompatíveis")
    sections = set(re.findall(r"^#{2,4}\s+(\d+(?:\.\d+)*)\.", prompt, re.MULTILINE))
    entries = cat.get("arquiteturas", [])
    check(isinstance(entries, list) and bool(entries), "arquiteturas ausentes")
    if not isinstance(entries, list):
        entries = []
    ids = [entry.get("id") for entry in entries]
    check(all(isinstance(i, str) and i for i in ids), "ID ausente")
    check(len(ids) == len(set(ids)), "IDs duplicados")
    known = set(ids)
    allowed = set(cat.get("estados_permitidos", []))
    graph = {}
    for entry in entries:
        identifier = entry.get("id", "<sem ID>")
        check(semver(entry.get("versao")), f"{identifier}: versao invalida")
        check(entry.get("status") in allowed, f"{identifier}: estado invalido")
        path = local_file(entry.get("caminho"), identifier)
        dependencies = entry.get("depende_de", [])
        check(isinstance(dependencies, list), f"{identifier}: dependencias invalidas")
        dependencies = dependencies if isinstance(dependencies, list) else []
        graph[identifier] = dependencies
        for dependency in dependencies:
            check(dependency in known, f"{identifier}: dependencia desconhecida {dependency}")
        if entry.get("status") == "diretriz_documentada" and path:
            body = path.read_text(encoding="utf-8")
            for heading in ("Âncora", "Mecânica", "Circuito", "Dialética"):
                check(re.search(r"^## .*" + heading, body, re.MULTILINE),
                      f"{identifier}: falta bloco {heading}")
        for source in entry.get("fontes", []):
            local_file(source.get("caminho"), f"fonte de {identifier}")
            if source.get("caminho") == "PROMPT_MESTRE_AULAS_DIGITAIS.md":
                check(source.get("versao") == version, f"{identifier}: fonte com versao divergente")
                for section in source.get("secoes", []):
                    check(section in sections, f"{identifier}: secao inexistente {section}")
    visiting, visited = set(), set()
    def visit(identifier):
        if identifier in visiting:
            errors.append(f"ciclo de dependencias em {identifier}")
            return
        if identifier in visited:
            return
        visiting.add(identifier)
        for dependency in graph.get(identifier, []):
            if dependency in known:
                visit(dependency)
        visiting.remove(identifier)
        visited.add(identifier)
    for identifier in ids:
        visit(identifier)
    for identifier in cat.get("nucleo_de_consulta", []):
        check(identifier in known, f"nucleo desconhecido: {identifier}")
        item = next((e for e in entries if e.get("id") == identifier), {})
        check(item.get("status") == "diretriz_documentada",
              f"nucleo nao pode ativar proposta/pendencia: {identifier}")
    for branch in cat.get("disciplinas", []):
        local_file(branch.get("caminho"), f"disciplina {branch.get('id')}")
        if branch.get("planta") is not None:
            check(branch["planta"] in known, f"planta disciplinar desconhecida: {branch['planta']}")
    for resource in cat.get("recursos", []):
        local_file(resource.get("caminho"), f"recurso {resource.get('id')}")
    # Confere os destinos de links Markdown locais na biblioteca.
    for file in sorted((ROOT / "biblioteca-arquiteturas").rglob("*.md")):
        for link in re.findall(r"\]\(([^)]+)\)", file.read_text(encoding="utf-8")):
            target = link.split("#", 1)[0]
            if not target or re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target):
                continue
            resolved = (file.parent / target).resolve()
            check(resolved.is_relative_to(ROOT) and resolved.is_file(),
                  f"{file.relative_to(ROOT)}: link local ausente {target}")
    if errors:
        print("\n".join("ERRO: " + message for message in errors), file=sys.stderr)
        return 1
    print(f"OK: {len(entries)} registros, {len(cat.get('disciplinas', []))} ramos; "
          f"dependencias sem ciclos, arquivos e compatibilidade com prompt {version} conferidos.")
    print("Limite: verificacao estrutural, sem certificar fontes externas, qualidade pedagogica ou funcionamento dos artefatos.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
