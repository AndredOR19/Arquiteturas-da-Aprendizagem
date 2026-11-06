import postgres from 'npm:postgres@3.4.3';
const db=postgres(Deno.env.get('SUPABASE_DB_URL')!,{prepare:false,max:1,idle_timeout:10,connect_timeout:10});
const origin='https://andredor19.github.io';
const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'authorization, content-type','Cache-Control':'no-store','Vary':'Origin'};
const fail=(ok:unknown,msg='Acesso recusado.',status=403)=>{if(!ok)throw Object.assign(new Error(msg),{status});};
Deno.serve(async(req:Request)=>{
  if(req.headers.get('origin')&&req.headers.get('origin')!==origin)return Response.json({ok:false,mensagem:'Origem não permitida.'},{status:403,headers});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(req.method!=='GET')return Response.json({ok:false,mensagem:'Use GET.'},{status:405,headers});
  try{
    const authorization=req.headers.get('authorization')||'';fail(/^Bearer [^\s]+$/.test(authorization),'Entre com sua conta administrativa.',401);
    const userResponse=await fetch(Deno.env.get('SUPABASE_URL')+'/auth/v1/user',{headers:{apikey:Deno.env.get('SUPABASE_ANON_KEY')!,Authorization:authorization}});
    fail(userResponse.ok,'Sessão expirada. Entre novamente.',401);const user=await userResponse.json();fail(user.id&&user.email_confirmed_at,'Confirme sua conta antes de acessar.',403);
    const claims=JSON.parse(atob(authorization.slice(7).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));fail(typeof claims.session_id==='string','Sessão inválida.',401);
    const [active]=await db`select id from auth.sessions where id=${claims.session_id} and user_id=${user.id}`;fail(active,'Sessão encerrada. Entre novamente.',401);
    const [admin]=await db`select auth_user_id,nome from educacional.administradores_plataforma where auth_user_id=${user.id} and ativo and revogado_em is null`;
    fail(admin,'Esta conta não é administradora da plataforma.',403);
    const [metricas]=await db`
      select
        (select count(*)::int from educacional.escolas where ativa) as escolas,
        (select count(*)::int from educacional.professores) as professores,
        (select count(*)::int from educacional.turmas) as turmas,
        (select count(*)::int from educacional.aulas) as aulas,
        (select count(*)::int from educacional.sessoes) as sessoes,
        (select count(*)::int from educacional.relatorios) as relatorios`;
    const escolas=await db`
      select e.nome,
        (select count(*)::int from educacional.turmas t where t.escola_id=e.id) as turmas,
        (select count(*)::int from educacional.aulas a where a.escola_id=e.id) as aulas,
        (select count(distinct v.professor_id)::int from educacional.vinculos_professores v where v.escola_id=e.id and v.ativo) as professores
      from educacional.escolas e where e.ativa order by e.nome limit 200`;
    const pendencias=await db`
      select e.nome as escola,t.codigo as turma,s.componente,s.estado
      from educacional.solicitacoes_vinculo_docente s
      join educacional.escolas e on e.id=s.escola_id
      join educacional.turmas t on t.id=s.turma_id
      where s.estado='pendente' order by s.solicitada_em desc limit 500`;
    return Response.json({ok:true,email:user.email,nome_admin:admin.nome,metricas:metricas||{escolas:0,professores:0,turmas:0,aulas:0,sessoes:0,relatorios:0},escolas,pendencias},{headers});
  }catch(e){const status=Number((e as {status?:number}).status)||500;return Response.json({ok:false,mensagem:status===500?'Falha interna ao carregar o painel.':e instanceof Error?e.message:'Acesso recusado.'},{status,headers});}
});
