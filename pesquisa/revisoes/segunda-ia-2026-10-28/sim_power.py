"""Simulação de poder: ensaio por turmas (cluster) com 2 ou 3 condições.
Parâmetros FICTÍCIOS/ASSUMIDOS (nenhum é empírico). Semente fixa.
Uso: python sim_power.py

Código fornecido pelo professor como devolutiva de outra IA em 28/10/2026.
Autoria original não confirmada. Normalizada somente a formatação da colagem.
"""
import numpy as np
from scipy import stats

SEED = 20261028
rng = np.random.default_rng(SEED)

def one_trial(k_per_arm, n_arms, m, icc, effects, attrition):
    # variância total 1: entre turmas = icc, dentro = 1-icc
    means = []
    for a in range(n_arms):
        cm = []
        for _ in range(k_per_arm):
            u = rng.normal(0, np.sqrt(icc))
            n = max(2, rng.binomial(m, 1 - attrition))
            y = effects[a] + u + rng.normal(0, np.sqrt(1 - icc), n)
            cm.append(y.mean())
        means.append(np.array(cm))
    # análise por médias de turma (teste t), comparações vs. controle (arm 0)
    ps = [stats.ttest_ind(means[a], means[0], equal_var=False).pvalue for a in range(1, n_arms)]
    return ps

def power(k, n_arms, m, icc, d, attrition, reps=2000):
    effects = [0.0] + [d] * (n_arms - 1)
    alpha = 0.05 / (n_arms - 1)  # Bonferroni para comparações vs. controle
    hits = 0
    for _ in range(reps):
        ps = one_trial(k, n_arms, m, icc, effects, attrition)
        hits += (ps[0] < alpha)  # poder para detectar a 1ª comparação
    return hits / reps

if __name__ == "__main__":
    m, icc, attr = 25, 0.10, 0.15
    print(f"semente={SEED} alunos/turma={m} ICC={icc} perdas={attr} reps=2000")
    print("poder (comparação principal) | k turmas por condição")
    ks = [4, 6, 8, 12, 16, 24]
    print("arms d  " + "  ".join(f"k={k:<3}" for k in ks))
    for n_arms in (2, 3):
        for d in (0.0, 0.2, 0.4):
            row = [power(k, n_arms, m, icc, d, attr) for k in ks]
            lab = "(erro tipo I)" if d == 0 else ""
            print(f"{n_arms}    {d:.1f} " + "  ".join(f"{p:.2f} " for p in row) + lab)
    print("\nSensibilidade ao ICC (2 condições, d=0.4):")
    for icc2 in (0.05, 0.10, 0.20):
        row = [power(k, 2, m, icc2, 0.4, attr, reps=1000) for k in ks]
        print(f"ICC={icc2:.2f} " + "  ".join(f"{p:.2f}" for p in row))
