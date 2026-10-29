"""Simulação clássica ideal de circuitos de 1–8 qubits; sem hardware ou API."""
import math
import random

VERSAO = '0.1.0'


def inteiro(valor, minimo, maximo):
    if type(valor) is not int or not minimo <= valor <= maximo:
        raise ValueError('Inteiro fora dos limites.')


def simular(qubits, portas, disparos=4096, semente=20261029):
    inteiro(qubits, 1, 8)
    inteiro(disparos, 1, 100000)
    inteiro(semente, 0, 2**32-1)
    if not isinstance(portas, list) or len(portas) > 256:
        raise ValueError('Lista de portas inválida ou orçamento excedido.')
    estado = [0j] * (2**qubits)
    estado[0] = 1+0j
    matrizes = {
        'H': ((1/math.sqrt(2), 1/math.sqrt(2)), (1/math.sqrt(2), -1/math.sqrt(2))),
        'X': ((0, 1), (1, 0)), 'Z': ((1, 0), (0, -1)), 'S': ((1, 0), (0, 1j))}
    normas = [1.0]
    for porta in portas:
        if not isinstance(porta, dict):
            raise ValueError('Porta precisa ser objeto.')
        nome = porta.get('porta')
        if not isinstance(nome, str) or nome not in (*matrizes, 'CX'):
            raise ValueError('Porta não suportada.')
        esperado = {'porta', 'alvo', 'controle'} if nome == 'CX' else {'porta', 'alvo'}
        if set(porta) != esperado:
            raise ValueError('Campos inválidos na porta.')
        alvo = porta['alvo']; inteiro(alvo, 0, qubits-1)
        if nome == 'CX':
            controle = porta['controle']; inteiro(controle, 0, qubits-1)
            if controle == alvo:
                raise ValueError('Controle e alvo precisam diferir.')
            for i in range(len(estado)):
                if i & (1 << controle) and not i & (1 << alvo):
                    j = i | (1 << alvo)
                    estado[i], estado[j] = estado[j], estado[i]
        else:
            m = matrizes[nome]
            for i in range(len(estado)):
                if not i & (1 << alvo):
                    j = i | (1 << alvo); a, b = estado[i], estado[j]
                    estado[i] = m[0][0]*a + m[0][1]*b
                    estado[j] = m[1][0]*a + m[1][1]*b
        norma = sum(abs(a)**2 for a in estado)
        if not math.isclose(norma, 1, abs_tol=1e-12):
            raise ArithmeticError('Norma do estado não preservada.')
        normas.append(norma)
    rotulos = [format(i, f'0{qubits}b') for i in range(len(estado))]
    probs = [abs(a)**2 for a in estado]
    rng = random.Random(semente)
    contagens = dict.fromkeys(rotulos, 0)
    # Cada disparo prepara novamente o mesmo circuito e mede todos os qubits ao final.
    for rotulo in rng.choices(rotulos, weights=probs, k=disparos):
        contagens[rotulo] += 1
    return dict(versao=VERSAO, qubits=qubits, portas=portas, disparos=disparos,
                semente=semente, ordem_bits='q(n-1)...q0; q0 é o bit à direita',
                probabilidades=dict(zip(rotulos, probs)), contagens=contagens,
                amplitudes={k: [v.real, v.imag] for k, v in zip(rotulos, estado)},
                normas_por_etapa=normas, hardware_quantico=False, ruido=False)


def demonstracoes(semente=20261029):
    h = {'porta': 'H', 'alvo': 0}
    casos = [('superposicao', 1, [h]), ('interferencia-retorno', 1, [h, h]),
             ('interferencia-fase', 1, [h, {'porta': 'Z', 'alvo': 0}, h]),
             ('fase-complexa', 1, [h, {'porta': 'S', 'alvo': 0}]),
             ('bell', 2, [h, {'porta': 'CX', 'controle': 0, 'alvo': 1}])]
    return {nome: simular(n, portas, semente=semente) for nome, n, portas in casos}
