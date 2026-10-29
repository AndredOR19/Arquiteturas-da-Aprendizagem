#!/usr/bin/env bash
# Python e Quarto são ferramentas de construção; não há servidor Python neste site.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

quarto_version='1.10.19'
quarto_sha256='8e38c2b2df6a6dbd369ea16e15acded6894545258d13a02f777f81ad18fd7973'
quarto_tmp=''
trap 'if [[ -n "$quarto_tmp" ]]; then rm -rf -- "$quarto_tmp"; fi' EXIT

if ! command -v quarto >/dev/null 2>&1 || [[ "$(quarto --version)" != "$quarto_version" ]]; then
  if [[ "$(uname -s)" != 'Linux' || "$(uname -m)" != 'x86_64' ]]; then
    echo 'Instale Quarto 1.10.19 para esta plataforma antes de construir.' >&2
    exit 1
  fi
  quarto_tmp="$(mktemp -d)"
  curl --fail --location --retry 3 --connect-timeout 20 --max-time 240 \
    "https://github.com/quarto-dev/quarto-cli/releases/download/v${quarto_version}/quarto-${quarto_version}-linux-amd64.tar.gz" \
    --output "$quarto_tmp/quarto.tar.gz"
  printf '%s  %s\n' "$quarto_sha256" "$quarto_tmp/quarto.tar.gz" | sha256sum --check --status
  mkdir "$quarto_tmp/runtime"
  tar -xzf "$quarto_tmp/quarto.tar.gz" --strip-components=1 -C "$quarto_tmp/runtime"
  export PATH="$quarto_tmp/runtime/bin:$PATH"
fi

quarto --version
python3 biblioteca-arquiteturas/validar_catalogo.py
python3 publicacao/preparar.py
# Falhar antes de publicar, se não houver uma página inicial real.
test -s _site/index.html
