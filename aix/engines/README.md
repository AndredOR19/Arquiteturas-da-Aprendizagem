# Motores de execução AIx

| Motor | Estado | Contrato | Papel |
|---|---|---|---|
| `accessible/` | **implementado (MVP)** | qualquer contrato | HTML semântico jogável, teclado + leitor de tela, registro local no padrão da coleta |
| `phaser-2d/` | **implementado e testado (v1.2)** | schema ≥1.1.0 com layout/objects/characters | jogo 2D: avatar por teclado/toque, colisões, interação contextual, inventário de evidências, diálogos, missões, feedback, progresso, salvamento |
| `three-3d/` | **protótipo funcional (v1.2)** | o MESMO contrato do 2D | cena 3D explorável, câmera orbital, missões completas, modo leve |
| percursos HTML | **produção** (automacoes/aulas) | template percursos-interativos | herdado da Fábrica AEE |

Todos os motores consomem o MESMO contrato (`aix/contracts/aix-experience.schema.json`).
Um contrato válido para um motor declara `experience.template`; a compatibilidade é
verificada antes da renderização. Publicado como material do catálogo, o artefato
recebe os apoios centrais (`_recursos`: painel de leitura, imagens e voz, sons) por
`publicacao/preparar.py`, e a suíte `ferramentas/conferir-*.cjs` continua sendo a
barreira de qualidade — nada do que existe foi substituído.
