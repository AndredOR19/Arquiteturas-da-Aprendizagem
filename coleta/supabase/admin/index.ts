import postgres from "npm:postgres@3.4.3";
const db = postgres(Deno.env.get("SUPABASE_DB_URL")!, {
  prepare: false,
  max: 1,
  idle_timeout: 10,
  connect_timeout: 10,
});
const origin = "https://andredor19.github.io",
  headers = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
const fail = (ok: unknown, msg = "Dados inválidos.", status = 400) => {
  if (!ok) throw Object.assign(new Error(msg), { status });
};
const uuid = (s: unknown) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s,
  );
const hash = async (s: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    ),
  )
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
Deno.serve(async (req) => {
  if (req.headers.get("origin") && req.headers.get("origin") !== origin)
    return Response.json(
      { ok: false, mensagem: "Origem não permitida." },
      { status: 403, headers },
    );
  if (req.method === "OPTIONS")
    return new Response(null, { status: 204, headers });
  try {
    const b = await req.json();
    fail(b && typeof b.acao === "string");
    const authz = req.headers.get("authorization") || "";
    fail(/^Bearer [^\s]+$/.test(authz), "Sessão administrativa ausente.", 401);
    const auth = await fetch(Deno.env.get("SUPABASE_URL") + "/auth/v1/user", {
      headers: {
        apikey: Deno.env.get("SUPABASE_ANON_KEY")!,
        Authorization: authz,
      },
    });
    fail(auth.ok, "Sessão expirada.", 401);
    const user = await auth.json();
    fail(
      user.id && user.email && user.email_confirmed_at,
      "Confirme a conta antes de acessar.",
      403,
    );
    const claims = JSON.parse(
      atob(authz.slice(7).split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    fail(uuid(claims.session_id), "Sessão inválida.", 401);
    const result = await db.begin(async (tx) => {
      const [sess] =
        await tx`select id from auth.sessions where id=${claims.session_id} and user_id=${user.id}`;
      fail(sess, "Sessão encerrada.", 401);
      const [admin] =
        await tx`select id,papel,email from educacional.administradores_plataforma where ativo and (auth_user_id=${user.id} or lower(email)=lower(${user.email})) limit 1`;
      fail(admin, "Acesso administrativo não autorizado.", 403);
      if (!admin.auth_user_id)
        await tx`update educacional.administradores_plataforma set auth_user_id=${user.id} where id=${admin.id}`;
      await tx`update educacional.administradores_plataforma set ultimo_acesso_em=now() where id=${admin.id}`;
      const audit = async (
        acao: string,
        tipo: string,
        id: string | null,
        ctx: Record<string, unknown> = {},
      ) =>
        tx`insert into educacional.auditoria_administrativa(auth_user_id,email,acao,alvo_tipo,alvo_id,contexto) values(${user.id},${user.email.toLowerCase()},${acao},${tipo},${id},${tx.json(ctx)})`;
      if (b.acao === "admin_painel") {
        const escolas =
          await tx`select id,nome,ativa from educacional.escolas order by nome limit 1000`;
        const professores =
          await tx`select p.id,p.nome,p.auth_user_id,count(v.escola_id)::int vinculos from educacional.professores p left join educacional.vinculos_professores v on v.professor_id=p.id and v.ativo group by p.id,p.nome,p.auth_user_id order by p.nome limit 1000`;
        const turmas =
          await tx`select t.id,t.escola_id,e.nome escola,t.codigo turma,t.ano_letivo,t.etapa,t.serie,count(m.id)::int alunos from educacional.turmas t join educacional.escolas e on e.id=t.escola_id left join educacional.matriculas m on m.turma_id=t.id and m.ano_letivo=t.ano_letivo group by t.id,e.nome order by t.ano_letivo desc,e.nome,t.codigo limit 2000`;
        const solicitacoes =
          await tx`select s.id,s.escola_id,e.nome escola,s.turma_id,t.codigo turma,s.ano_letivo,s.componente,s.estado,s.solicitada_em,p.nome professor,u.email from educacional.solicitacoes_vinculo_docente s join educacional.escolas e on e.id=s.escola_id join educacional.turmas t on t.id=s.turma_id join educacional.professores p on p.auth_user_id=s.auth_user_id left join auth.users u on u.id=s.auth_user_id where s.estado='pendente' order by s.solicitada_em limit 500`;
        const convites =
          await tx`select g.id,g.email,g.papel,g.escola_id,e.nome escola,g.ano_letivo,g.turma_id,t.codigo turma,g.componente,g.ativa,g.expira_em,g.ativacao_usada_em,p.nome professor from educacional.autorizacoes_email_docente g join educacional.escolas e on e.id=g.escola_id join educacional.professores p on p.id=g.professor_id left join educacional.turmas t on t.id=g.turma_id order by g.aprovada_em desc limit 1000`;
        const [totais] =
          await tx`select (select count(*)::int from educacional.escolas where ativa) escolas,(select count(*)::int from educacional.professores) professores,(select count(*)::int from educacional.turmas) turmas,(select count(*)::int from educacional.alunos) alunos,(select count(*)::int from educacional.aulas) aulas,(select count(*)::int from educacional.sessoes where ambiente='producao') sessoes,(select count(*)::int from educacional.relatorios) relatorios`;
        const [atividade] =
          await tx`select count(*) filter(where s.estado='concluida')::int concluidas,count(*) filter(where s.estado<>'concluida')::int em_andamento,coalesce(avg(extract(epoch from(s.ultimo_recebimento_em-s.iniciada_em))/60) filter(where s.ultimo_recebimento_em is not null),0)::numeric(10,1) minutos_medios from educacional.sessoes s where s.ambiente='producao'`;
        const auditoria =
          await tx`select id,email,acao,alvo_tipo,alvo_id,contexto,sucesso,criado_em from educacional.auditoria_administrativa order by criado_em desc limit 100`;
        return {
          ok: true,
          estado: "administrador",
          admin: admin.email,
          totais,
          atividade,
          escolas,
          professores,
          turmas,
          solicitacoes,
          convites,
          auditoria,
        };
      }
      if (
        b.acao === "admin_aprovar_solicitacao" ||
        b.acao === "admin_recusar_solicitacao"
      ) {
        fail(uuid(b.id), "Solicitação inválida.");
        const [s] =
          await tx`select s.*,p.id professor_id from educacional.solicitacoes_vinculo_docente s join educacional.professores p on p.auth_user_id=s.auth_user_id where s.id=${b.id} and s.estado='pendente' for update`;
        fail(s, "Solicitação pendente não encontrada.", 404);
        const [g] =
          await tx`select professor_id from educacional.vinculos_professores where escola_id=${s.escola_id} and papel='gestor' and ativo limit 1`;
        if (b.acao === "admin_aprovar_solicitacao") {
          fail(
            g,
            "Cadastre um gestor ativo para esta escola antes de aprovar.",
          );
          await tx`insert into educacional.atribuicoes_docentes(escola_id,professor_id,turma_id,ano_letivo,componente,confirmada_em,fonte_confirmacao,solicitacao_id) values(${s.escola_id},${s.professor_id},${s.turma_id},${s.ano_letivo},${s.componente},now(),'Aprovação administrativa sênior',${s.id}) on conflict do nothing`;
          await tx`update educacional.solicitacoes_vinculo_docente set estado='aprovada',revisada_em=now(),revisada_por=${g.professor_id} where id=${s.id}`;
          await audit("aprovar_vinculo", "solicitacao", s.id, {
            escola_id: s.escola_id,
            turma_id: s.turma_id,
          });
          return {
            ok: true,
            mensagem:
              "Vínculo aprovado. Emita um convite para ativar a conta, se necessário.",
          };
        }
        await tx`update educacional.solicitacoes_vinculo_docente set estado='recusada',revisada_em=now(),revisada_por=${g?.professor_id || s.professor_id} where id=${s.id}`;
        await audit("recusar_vinculo", "solicitacao", s.id);
        return { ok: true, mensagem: "Solicitação recusada." };
      }
      if (b.acao === "admin_convite") {
        fail(
          typeof b.email === "string" &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
            uuid(b.professor_id) &&
            uuid(b.escola_id) &&
            uuid(b.turma_id) &&
            Number.isInteger(b.ano_letivo) &&
            typeof b.componente === "string" &&
            b.componente.trim(),
          "Dados de convite inválidos.",
        );
        const [g] =
          await tx`select professor_id from educacional.vinculos_professores where escola_id=${b.escola_id} and papel='gestor' and ativo limit 1`;
        fail(
          g,
          "Cadastre um gestor ativo para esta escola antes de emitir convites.",
        );
        const raw = Array.from(
            crypto.getRandomValues(new Uint8Array(32)),
            (x) => x.toString(16).padStart(2, "0"),
          ).join(""),
          h = await hash(raw);
        await tx`insert into educacional.autorizacoes_email_docente(email,professor_id,escola_id,ano_letivo,turma_id,componente,papel,expira_em,aprovada_por,ativacao_sha256) values(${b.email.trim().toLowerCase()},${b.professor_id},${b.escola_id},${b.ano_letivo},${b.turma_id},${b.componente.trim()},'professor',now()+interval '14 days',${g.professor_id},${h}) on conflict(email,escola_id,ano_letivo,turma_id,componente,papel) do update set ativa=true,expira_em=excluded.expira_em,ativacao_sha256=excluded.ativacao_sha256,ativacao_usada_em=null`;
        await audit("emitir_convite", "email", b.email.toLowerCase(), {
          escola_id: b.escola_id,
          turma_id: b.turma_id,
          componente: b.componente,
        });
        return {
          ok: true,
          codigo: raw,
          mensagem:
            "Convite criado. Copie o código agora e envie-o por canal privado; ele não será exibido novamente.",
        };
      }
      if (b.acao === "admin_revogar_convite") {
        fail(uuid(b.id));
        await tx`update educacional.autorizacoes_email_docente set ativa=false where id=${b.id}`;
        await audit("revogar_convite", "autorizacao", b.id);
        return { ok: true, mensagem: "Convite revogado." };
      }
      if (b.acao === "admin_reset_acesso") {
        fail(typeof b.email === "string" && b.email.length <= 254);
        const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        fail(key, "Recurso administrativo indisponível.", 503);
        const r = await fetch(
            Deno.env.get("SUPABASE_URL") + "/auth/v1/admin/generate_link",
            {
              method: "POST",
              headers: {
                apikey: key,
                Authorization: "Bearer " + key,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "recovery",
                email: b.email.trim().toLowerCase(),
                redirect_to: origin + "/docentes/area/",
              }),
            },
          ),
          d = await r.json();
        fail(r.ok && d.action_link, "Não foi possível gerar o link.", 502);
        await audit("gerar_recuperacao", "usuario", b.email.toLowerCase());
        return {
          ok: true,
          link: d.action_link,
          mensagem: "Link gerado. Envie-o por canal privado e não o publique.",
        };
      }
      throw Object.assign(new Error("Ação administrativa desconhecida."), {
        status: 400,
      });
    });
    return Response.json(result, { headers });
  } catch (e) {
    const status = Number(e.status) || 500;
    return Response.json(
      {
        ok: false,
        mensagem:
          status === 500 ? "Não foi possível concluir a operação." : e.message,
      },
      { status, headers },
    );
  }
});
