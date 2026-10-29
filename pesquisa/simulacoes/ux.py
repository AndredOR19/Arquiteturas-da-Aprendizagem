"""Exploração exaustiva de políticas propostas. Não executa o DOM nem prevê alunos."""
from itertools import product

VERSAO = '0.1.0'
POLITICAS = {
    'proposta-inicial': dict(alternativa_gesto=False, alternativa_voz=False,
        reduz_movimento=False, dupla_opcional=False, conquista_revisao=False),
    'proposta-acessivel': dict(alternativa_gesto=True, alternativa_voz=True,
        reduz_movimento=True, dupla_opcional=True, conquista_revisao=True)}


def avaliar(politica, caso):
    """Requisitos de acesso explícitos, independentes da nota pedagógica."""
    falhas = []
    for necessidade, recurso, falha in [
        ('somente_teclado', 'alternativa_gesto', 'gesto_obrigatorio'),
        ('sem_voz', 'alternativa_voz', 'orientacao_so_em_audio'),
        ('movimento_reduzido', 'reduz_movimento', 'animacao_obrigatoria'),
        ('sem_colega', 'dupla_opcional', 'colega_obrigatorio'),
        ('revisou_apos_erro', 'conquista_revisao', 'recuperacao_sem_reconhecimento')]:
        if caso[necessidade] and not politica[recurso]:
            falhas.append(falha)
    # Regra de conclusão proposta: completar percursos E confirmar a devolutiva.
    final_liberado = caso['percursos'] == 26 and caso['devolutiva_confirmada']
    return dict(falhas=falhas, final_liberado=final_liberado,
                conclusao_esperada=final_liberado)


def executar():
    nomes = ['somente_teclado', 'sem_voz', 'movimento_reduzido',
             'sem_colega', 'revisou_apos_erro']
    saidas = {}
    for nome, politica in POLITICAS.items():
        casos = []
        for necessidades, progresso, devolutiva in product(
                product([False, True], repeat=5), [0, 25, 26], [False, True]):
            caso = dict(zip(nomes, necessidades), percursos=progresso,
                        devolutiva_confirmada=devolutiva)
            casos.append(dict(entrada=caso, **avaliar(politica, caso)))
        saidas[nome] = dict(politica=politica, total_casos=len(casos),
            casos_com_conflito=sum(bool(c['falhas']) for c in casos), casos=casos)
    return dict(versao=VERSAO, tipo='verificacao_de_regras_propostas', dados_reais=False,
        executa_interface=False, prediz_aprendizagem=False, variantes=saidas,
        limite='Contagens decorrem da grade e das regras escolhidas; não são taxas esperadas em alunos.')
