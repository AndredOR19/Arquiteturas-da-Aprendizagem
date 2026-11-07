(() => {
  "use strict";
  const C = window.DocenteConfig,
    $ = (id) => document.getElementById(id),
    K = "aa:admin:auth",
    R = "aa:admin:remember";
  let session = null,
    keep = false,
    D = null;
  try {
    keep = localStorage.getItem(R) === "yes";
    session = JSON.parse(
      (keep ? localStorage : sessionStorage).getItem(K) || "null",
    );
  } catch {}
  const store = () => {
    const t = keep ? localStorage : sessionStorage,
      o = keep ? sessionStorage : localStorage;
    o.setItem(K, JSON.stringify(session));
    o.removeItem(K);
    if (keep) localStorage.setItem(R, "yes");
  };
  const clear = () => {
    sessionStorage.removeItem(K);
    localStorage.removeItem(K);
    localStorage.removeItem(R);
    session = null;
  };
  async function auth(path, body, token) {
    const r = await fetch(C.url + "/auth/v1/" + path, {
      method: "POST",
      headers: {
        apikey: C.key,
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: JSON.stringify(body),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok)
      throw Error(
        d.msg || d.error_description || d.message || "Falha de autenticação.",
      );
    return d;
  }
  async function api(body) {
    const r = await fetch(C.adminEndpoint || C.endpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + session.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    if (!r.ok || !d.ok) throw Error(d.mensagem || "Operação não confirmada.");
    return d;
  }
  function view(id) {
    for (const x of ["login", "denied", "app"]) $(x).hidden = x !== id;
    $("logout").hidden = id !== "app";
  }
  function opt(text, value) {
    return new Option(text, value);
  }
  function esc(v) {
    return String(v ?? "—");
  }
  function render() {
    const t = D.totais || {},
      labels = [
        ["escolas", "escolas ativas"],
        ["professores", "professores"],
        ["turmas", "turmas"],
        ["alunos", "alunos"],
        ["aulas", "aulas"],
        ["sessoes", "sessões"],
        ["relatorios", "relatórios"],
      ];
    $("metrics").replaceChildren(
      ...labels.map(([k, l]) => {
        const a = document.createElement("article");
        a.innerHTML = `<strong>${esc(t[k])}</strong><span>${l}</span>`;
        return a;
      }),
    );
    const a = D.atividade || {};
    $("activity").replaceChildren(
      ...[
        [a.concluidas, "concluídas"],
        [a.em_andamento, "em andamento"],
        [a.minutos_medios + " min", "tempo médio recebido"],
      ].map(([n, l]) => {
        const x = document.createElement("div");
        x.innerHTML = `<b>${esc(n)}</b><span>${l}</span>`;
        return x;
      }),
    );
    $("request-count").textContent =
      (D.solicitacoes || []).length + " pendentes";
    $("invite-count").textContent =
      (D.convites || []).filter((x) => x.ativa).length + " ativos";
    const req = $("requests");
    req.replaceChildren(
      ...(D.solicitacoes || []).map((x) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${esc(x.professor)}<br><small>${esc(x.email)}</small></td><td>${esc(x.escola)} · ${esc(x.turma)}</td><td>${esc(x.ano_letivo)}</td><td>${esc(x.componente)}</td><td><button class="small-button" data-approve="${x.id}">Aprovar</button> <button class="small-button danger" data-reject="${x.id}">Recusar</button></td>`;
        return tr;
      }),
    );
    $("requests-empty").textContent = D.solicitacoes?.length
      ? ""
      : "Nenhuma solicitação pendente.";
    const inv = $("invites");
    inv.replaceChildren(
      ...(D.convites || []).map((x) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${esc(x.email)}<br><small>${esc(x.professor)}</small></td><td>${esc(x.escola)} · ${esc(x.turma)} · ${esc(x.componente)}</td><td>${x.ativa ? (x.ativacao_usada_em ? "Ativado" : "Ativo") : "Revogado"}</td><td>${x.ativa ? `<button class="small-button danger" data-revoke="${x.id}">Revogar</button>` : ""}</td>`;
        return tr;
      }),
    );
    const aud = $("audit");
    aud.replaceChildren(
      ...(D.auditoria || []).map((x) => {
        const p = document.createElement("p");
        p.textContent = `${new Date(x.criado_em).toLocaleString("pt-BR")} · ${x.acao} · ${x.alvo_tipo} · ${x.alvo_id || "—"}`;
        return p;
      }),
    );
    const sf = $("school-filter"),
      old = sf.value;
    sf.replaceChildren(
      opt("Todas as escolas", ""),
      ...(D.escolas || []).map((x) => opt(x.nome, x.id)),
    );
    sf.value = old;
    renderClasses();
    populateForms();
  }
  function renderClasses() {
    const school = $("school-filter").value;
    const rows = (D.turmas || []).filter(
      (x) => !school || x.escola_id === school,
    );
    $("classes").replaceChildren(
      ...rows.map((x) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${esc(x.escola)}</td><td>${esc(x.turma)}</td><td>${esc(x.ano_letivo)}</td><td>${esc(x.etapa)} · ${esc(x.serie)}</td><td>${esc(x.alunos)}</td>`;
        return tr;
      }),
    );
  }
  function populateForms() {
    const ps = $("invite-professor"),
      ss = $("invite-school"),
      cs = $("invite-class");
    ps.replaceChildren(
      opt("Selecione", ""),
      ...(D.professores || []).map((x) =>
        opt(`${x.nome} · ${x.vinculos} vínculo(s)`, x.id),
      ),
    );
    ss.replaceChildren(
      opt("Selecione", ""),
      ...(D.escolas || []).filter((x) => x.ativa).map((x) => opt(x.nome, x.id)),
    );
    cs.replaceChildren(
      opt("Selecione", ""),
      ...(D.turmas || []).map((x) =>
        opt(`${x.escola} · ${x.turma} · ${x.ano_letivo}`, x.id),
      ),
    );
  }
  async function load() {
    try {
      D = await api({ acao: "admin_painel" });
      view("app");
      $("account").textContent = D.admin;
      render();
    } catch (e) {
      if (/não autorizado/i.test(e.message)) {
        view("denied");
        $("denied-status").textContent = e.message;
      } else {
        view("login");
        $("login-status").textContent = e.message;
      }
    }
  }
  function oauthReturn() {
    const p = new URLSearchParams(location.hash.slice(1));
    if (!p.get("access_token")) return false;
    session = {
      access_token: p.get("access_token"),
      refresh_token: p.get("refresh_token"),
      expires_at:
        Math.floor(Date.now() / 1000) + Number(p.get("expires_in") || 3600),
    };
    history.replaceState(null, "", location.pathname + location.search);
    keep = true;
    store();
    return true;
  }
  async function act(body, where) {
    try {
      const d = await api(body);
      $(where).textContent = d.mensagem || "Operação concluída.";
      if (d.codigo) $(where).textContent += " Código: " + d.codigo;
      if (d.link) $(where).textContent += " Link: " + d.link;
      await load();
    } catch (e) {
      $(where).textContent = e.message;
    }
  }
  $("google-login").onclick = () => {
    const redirect = location.origin + location.pathname;
    location.href =
      C.url +
      "/auth/v1/authorize?provider=google&redirect_to=" +
      encodeURIComponent(redirect);
  };
  $("login-form").onsubmit = async (e) => {
    e.preventDefault();
    $("login-status").textContent = "Entrando…";
    try {
      session = await auth("token?grant_type=password", {
        email: $("email").value.trim(),
        password: $("password").value,
      });
      keep = $("remember").checked;
      store();
      await load();
    } catch (e) {
      $("login-status").textContent = e.message;
    }
  };
  $("logout").onclick = () => {
    clear();
    view("login");
    $("account").textContent = "";
  };
  $("reload").onclick = load;
  $("school-filter").onchange = renderClasses;
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-approve]"),
      r = e.target.closest("[data-reject]"),
      v = e.target.closest("[data-revoke]");
    if (a && confirm("Aprovar este vínculo?"))
      act(
        { acao: "admin_aprovar_solicitacao", id: a.dataset.approve },
        "action-status",
      );
    if (r && confirm("Recusar este vínculo?"))
      act(
        { acao: "admin_recusar_solicitacao", id: r.dataset.reject },
        "action-status",
      );
    if (v && confirm("Revogar este convite?"))
      act(
        { acao: "admin_revogar_convite", id: v.dataset.revoke },
        "action-status",
      );
  });
  $("show-invite").onclick = () => {
    $("invite-status").textContent = "";
    $("invite-dialog").showModal();
  };
  $("show-reset").onclick = () => {
    $("reset-status").textContent = "";
    $("reset-dialog").showModal();
  };
  document
    .querySelectorAll("[data-close]")
    .forEach((b) => (b.onclick = () => $(b.dataset.close).close()));
  $("invite-form").onsubmit = async (e) => {
    e.preventDefault();
    const t = D.turmas.find((x) => x.id === $("invite-class").value),
      d = {
        acao: "admin_convite",
        email: $("invite-email").value.trim(),
        professor_id: $("invite-professor").value,
        escola_id: $("invite-school").value,
        turma_id: $("invite-class").value,
        ano_letivo: t?.ano_letivo,
        componente: $("invite-subject").value.trim(),
      };
    await act(d, "invite-status");
  };
  $("reset-form").onsubmit = async (e) => {
    e.preventDefault();
    await act(
      { acao: "admin_reset_acesso", email: $("reset-email").value.trim() },
      "reset-status",
    );
  };
  if (session || oauthReturn()) load();
  else view("login");
})();
