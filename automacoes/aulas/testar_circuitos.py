#!/usr/bin/env python3
import copy
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from circuitos import build_circuit, validate_circuit

unit = {
    'contexto': 'Observe uma situação e compare suas evidências.',
    'pergunta': 'Qual relação é sustentada pelo caso apresentado?',
    'explicacao': 'A relação depende da evidência indicada.',
    'transferencia': 'Aplique a mesma relação em outro caso.',
    'alternativas': [{'texto': f'Resposta {i}', 'feedback': f'Feedback explicativo {i}'} for i in range(4)],
    'correta': 0,
}
doc = {'conceito': 'Relações entre evidências', 'percursos': [copy.deepcopy(unit) for _ in range(32)]}
lesson = {'id': 'piloto-teste', 'serie': '8º ano', 'tema': 'investigação'}
circuit = build_circuit(doc, lesson)
validate_circuit(circuit, 32)
assert circuit['visualProfile']['skin'] == 'rpg-contemporaneo'
assert circuit['stations'][0]['cards']

bad = copy.deepcopy(circuit)
bad['questions'][0]['hints'][-1]['targetCardId'] = 'c-inexistente'
try:
    validate_circuit(bad, 32)
except ValueError as exc:
    assert 'última pista' in str(exc)
else:
    raise AssertionError('alvo inexistente aceito')
print('OK: contrato de circuitos, perfis etários e retorno validado')
