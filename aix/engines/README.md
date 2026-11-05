# Motores de execução AIx

| Motor | Estado | Contrato | Papel |
|---|---|---|---|
| `accessible/` | **implementado (MVP)** | qualquer contrato | HTML semântico jogável, teclado + leitor de tela, registro local no padrão da coleta |
| `phaser-2d/` | especificação (Fase 2) | templates museum/gincana/cidade | jogos e ambientes 2D |
| `three-3d/` | especificação (Fase 4) | ambientes tridimensionais | variante 3D com alternativa obrigatória |
| percursos HTML | **produção** (automacoes/aulas) | template percursos-interativos | herdado da Fábrica AEE |

Todos os motores consomem o MESMO contrato (`aix/contracts/aix-experience.schema.json`).
Um contrato válido para um motor declara `experience.template`; a compatibilidade é
verificada antes da renderização. Publicado como material do catálogo, o artefato
recebe os apoios centrais (`_recursos`: painel de leitura, imagens e voz, sons) por
`publicacao/preparar.py`, e a suíte `ferramentas/conferir-*.cjs` continua sendo a
barreira de qualidade — nada do que existe foi substituído.
