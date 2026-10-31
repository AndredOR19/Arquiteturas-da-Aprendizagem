import postgres from 'npm:postgres@3.4.3';
const db=postgres(Deno.env.get('SUPABASE_DB_URL')!,{prepare:false,max:1,idle_timeout:10,connect_timeout:10});
const origin='https://andredor19.github.io',headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'authorization, content-type','Cache-Control':'no-store','Vary':'Origin'};
const fail=(ok:unknown,msg='Dados inválidos.',status=400)=>{if(!ok)throw Object.assign(new Error(msg),{status});};
const norm=(s:unknown)=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLowerCase();
const uuid=(s:unknown)=>typeof s==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
Deno.serve(async(req:Request)=>{
 if(req.headers.get('origin')&&req.headers.get('origin')!==origin)return Response.json({ok:false,mensagem:'Origem não permitida.'},{status:403,headers});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return Response.json({ok:false,mensagem:'Use POST.'},{status:405,headers});
 try{
  const reader=req.body?.getReader();fail(reader);let size=0,parts=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;fail(size<=180000,'Arquivo muito grande.',413);parts.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const x of parts){bytes.set(x,offset);offset+=x.length;}const b=JSON.parse(new TextDecoder().decode(bytes));
  if(b.acao==='ativar'){
   fail(size<=5000&&typeof b.email==='string'&&b.email.length<=254&&typeof b.password==='string'&&b.password.length>=12&&b.password.length<=128&&/^[0-9a-f]{64}$/.test(b.codigo||''),'Confira e-mail, senha própria de pelo menos 12 caracteres e convite individual.');
   const day='ativacao:'+new Date().toISOString().slice(0,10);const [limit]=await db`insert into educacional.limites_receptor(chave,quantidade) values(${day},1) on conflict(chave) do update set quantidade=educacional.limites_receptor.quantidade+1 returning quantidade`;fail(limit.quantidade<=300,'Limite de ativações diário atingido.',429);
   const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(b.codigo)))).map(x=>x.toString(16).padStart(2,'0')).join('');
   const result=await db.begin(async tx=>{
    const [g]=await tx`select g.* from educacional.autorizacoes_email_docente g join educacional.escolas e on e.id=g.escola_id and e.ativa join educacional.vinculos_professores v on v.escola_id=g.escola_id and v.professor_id=g.professor_id and v.ativo where g.email=${b.email.trim().toLowerCase()} and g.ativacao_sha256=${hash} and g.ativacao_usada_em is null and g.ativa and g.expira_em>now() for update of g`;
    fail(g,'Convite inválido, já utilizado, expirado ou sem autorização.',403);
    // A identidade é confirmada administrativamente pelo convite aprovado; não por domínio ou nome livre.
    const admin=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');fail(admin,'Ativação indisponível. Contate o responsável.',503);
    const response=await fetch(Deno.env.get('SUPABASE_URL')+'/auth/v1/admin/users',{method:'POST',headers:{apikey:admin,Authorization:'Bearer '+admin,'Content-Type':'application/json'},body:JSON.stringify({email:g.email,password:b.password,email_confirm:true})});
    if(!response.ok)return {ok:false,mensagem:'A conta pode já existir ou a senha não atender aos requisitos. Tente entrar; se necessário, contate o responsável. Nenhuma senha existente foi alterada.'};
    const user=await response.json();fail(user.id,'Criação sem confirmação.',503);
    await tx`update educacional.autorizacoes_email_docente set ativacao_usada_em=now() where id=${g.id}`;
    return {ok:true,mensagem:'Conta ativada pelo convite autorizado. Entre com seu e-mail e a senha que acabou de criar.'};
   });return Response.json(result,{headers});
  }
  fail(['painel','contextos','solicitar','parecer','planejamento','prever_chamada','importar_chamada'].includes(b.acao));
  const authorization=req.headers.get('authorization')||'';fail(/^Bearer [^\s]+$/.test(authorization),'Entre com seu e-mail verificado.',401);
  const auth=await fetch(Deno.env.get('SUPABASE_URL')+'/auth/v1/user',{headers:{apikey:Deno.env.get('SUPABASE_ANON_KEY')!,Authorization:authorization}});
  fail(auth.ok,'Sua sessão expirou. Entre novamente.',401);const user=await auth.json();fail(user.id&&user.email&&user.email_confirmed_at,'Confirme seu e-mail antes de acessar.',403);
  const verifiedClaims=JSON.parse(atob(authorization.slice(7).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));fail(uuid(verifiedClaims.session_id),'Sessão de usuário ausente.',401);
  const result=await db.begin(async tx=>{
   const [activeSession]=await tx`select id from auth.sessions where id=${verifiedClaims.session_id} and user_id=${user.id}`;fail(activeSession,'Sessão encerrada. Entre novamente.',401);
   const [quota]=await tx`insert into educacional.limites_receptor(chave,quantidade) values(${`docente:${user.id}:${new Date().toISOString().slice(0,10)}`},1) on conflict(chave) do update set quantidade=educacional.limites_receptor.quantidade+1 returning quantidade`;fail(quota.quantidade<=2000,'Limite diário de operações. Tente mais tarde.',429);
   if(b.acao==='contextos')return {ok:true,contextos:await tx`select e.id escola_id,e.nome escola,t.id turma_id,t.codigo turma,t.ano_letivo from educacional.escolas e join educacional.turmas t on t.escola_id=e.id where e.ativa order by t.ano_letivo desc,e.nome,t.codigo limit 1000`};
   if(b.acao==='solicitar'){
    fail(uuid(b.escola_id)&&uuid(b.turma_id)&&Number.isInteger(b.ano_letivo)&&typeof b.componente==='string'&&b.componente.trim().length>0&&b.componente.length<=120);
    const [context]=await tx`select id from educacional.turmas where id=${b.turma_id} and escola_id=${b.escola_id} and ano_letivo=${b.ano_letivo}`;fail(context,'Contexto escolar incompatível.');
    await tx`insert into educacional.solicitacoes_vinculo_docente(auth_user_id,escola_id,turma_id,ano_letivo,componente) values(${user.id},${b.escola_id},${b.turma_id},${b.ano_letivo},${b.componente.trim()}) on conflict do nothing`;
    return {ok:true,estado:'aguardando_autorizacao',mensagem:'Solicitação recebida. O responsável precisa autorizar o vínculo.'};
   }
   const grants=await tx`select g.*,p.auth_user_id,p.nome as professor,e.nome as escola from educacional.autorizacoes_email_docente g join educacional.professores p on p.id=g.professor_id join educacional.escolas e on e.id=g.escola_id and e.ativa join educacional.vinculos_professores v on v.escola_id=g.escola_id and v.professor_id=g.professor_id and v.ativo where g.email=${user.email.toLowerCase()} and g.ativa and g.expira_em>now() and (p.auth_user_id is null or p.auth_user_id=${user.id}) and (g.papel='gestor' or exists(select 1 from educacional.atribuicoes_docentes ad where ad.escola_id=g.escola_id and ad.professor_id=g.professor_id and ad.turma_id=g.turma_id and ad.ano_letivo=g.ano_letivo and ad.componente=g.componente and ad.ativa))`;
   if(!grants.length)return {ok:true,estado:'aguardando_autorizacao',email:user.email,mensagem:'Seu acesso está autenticado. Aguarde a autorização da escola, ano, turma e matéria.'};
   for(const p of grants){await tx`update educacional.professores set auth_user_id=${user.id} where id=${p.professor_id} and auth_user_id is null`;const [bound]=await tx`select id from educacional.professores where id=${p.professor_id} and auth_user_id=${user.id}`;fail(bound,'Conta incompatível com o vínculo. Contate o responsável.',403);}
   const scopes=tx.json(grants.map(g=>({escola_id:g.escola_id,ano_letivo:g.ano_letivo,turma_id:g.turma_id,componente:g.componente,papel:g.papel,professor_id:g.professor_id})));
   const aulas=await tx`with escopos as (select * from jsonb_to_recordset(${scopes}) as c(escola_id uuid,ano_letivo integer,turma_id uuid,componente text,papel text,professor_id uuid)) select distinct a.*,e.nome escola,t.codigo turma,t.serie from educacional.aulas a join educacional.escolas e on e.id=a.escola_id join educacional.turmas t on t.id=a.turma_id join escopos c on c.escola_id=a.escola_id and c.ano_letivo=a.ano_letivo and (c.papel='gestor' or (c.turma_id=a.turma_id and c.componente=a.componente)) order by a.data_planejada desc limit 2000`;
   const ids=aulas.map(a=>a.id);
   if(b.acao==='painel'){
    const registros=ids.length?await tx`with roster as (select pa.* from educacional.participantes_aula pa where pa.aula_id=any(${ids}::uuid[])), ultimos as (select distinct on(s.aula_id,s.matricula_id) r.*,s.aula_id,s.matricula_id from educacional.relatorios r join educacional.sessoes s on s.id=r.sessao_id where s.aula_id=any(${ids}::uuid[]) and s.ambiente='producao' order by s.aula_id,s.matricula_id,r.recebido_em desc), atividade as (select s.aula_id,s.matricula_id,count(distinct s.id)::int sessoes,count(e.id) filter(where e.tipo='tentativa')::int tentativas,count(e.id) filter(where e.tipo='pista')::int pistas from educacional.sessoes s left join educacional.eventos e on e.sessao_id=s.id where s.aula_id=any(${ids}::uuid[]) and s.ambiente='producao' group by s.aula_id,s.matricula_id) select pa.aula_id,pa.matricula_id,pa.situacao,al.id aluno_id,al.nome,m.codigo_interno,coalesce(at.sessoes,0) sessoes,coalesce(at.tentativas,0) tentativas,coalesce(at.pistas,0) pistas,r.id relatorio_id,r.nota_indicador,r.percursos_total,r.acertos_iniciais,r.conteudo->'preferencias' preferencias,r.conteudo->'experience' experiencia from roster pa join educacional.matriculas m on m.id=pa.matricula_id join educacional.alunos al on al.id=m.aluno_id left join atividade at on at.aula_id=pa.aula_id and at.matricula_id=pa.matricula_id left join ultimos r on r.aula_id=pa.aula_id and r.matricula_id=pa.matricula_id order by al.nome limit 10000`:[];
    const pareceres=ids.length?await tx`select distinct on(p.professor_id,p.aula_id,p.matricula_id) p.* from educacional.pareceres_docentes p where p.aula_id=any(${ids}::uuid[]) order by p.professor_id,p.aula_id,p.matricula_id,p.revisao desc limit 10000`:[];
    const planos=await tx`with c as (select * from jsonb_to_recordset(${scopes}) as c(escola_id uuid,ano_letivo integer,turma_id uuid,componente text,papel text,professor_id uuid)) select distinct p.* from educacional.planejamentos_docentes p join c on c.escola_id=p.escola_id and c.ano_letivo=p.ano_letivo and (c.papel='gestor' or (c.professor_id=p.professor_id and c.turma_id=p.turma_id and c.componente=p.componente)) order by p.data_prevista limit 2000`;
    const calendarios=await tx`with c as (select distinct escola_id,ano_letivo from jsonb_to_recordset(${scopes}) as c(escola_id uuid,ano_letivo integer)) select ca.id,ca.escola_id,ca.ano_letivo,ca.titulo,ca.versao,d.data,d.tipo,d.descricao from educacional.calendarios_letivos ca join c on c.escola_id=ca.escola_id and c.ano_letivo=ca.ano_letivo left join educacional.dias_calendario d on d.calendario_id=ca.id order by d.data limit 5000`;
    return {ok:true,estado:'autorizado',email:user.email,escopos:grants.map(g=>({escola_id:g.escola_id,escola:g.escola,ano_letivo:g.ano_letivo,turma_id:g.turma_id,componente:g.componente,papel:g.papel,professor_id:g.professor_id,professor:g.professor})),aulas,registros,pareceres,planos,calendarios};
   }
   fail(uuid(b.aula_id));const aula=aulas.find(a=>a.id===b.aula_id);fail(aula,'Aula fora do seu escopo.',403);
   const [atribuicao]=await tx`select ad.* from educacional.atribuicoes_docentes ad join educacional.professores p on p.id=ad.professor_id join educacional.vinculos_professores vp on vp.professor_id=p.id and vp.escola_id=ad.escola_id and vp.ativo where p.auth_user_id=${user.id} and ad.ativa and ad.escola_id=${aula.escola_id} and ad.turma_id=${aula.turma_id} and ad.ano_letivo=${aula.ano_letivo} and ad.componente=${aula.componente}`;fail(atribuicao,'Monitoramento escolar não concede edição sem atribuição docente.',403);
   if(b.acao==='parecer'){
    fail(uuid(b.matricula_id)&&typeof b.texto==='string'&&b.texto.trim().length>=2&&b.texto.length<=20000);fail(b.nota_docente===null||(typeof b.nota_docente==='number'&&b.nota_docente>=0&&b.nota_docente<=10));fail(typeof b.revisado==='boolean');
    const [m]=await tx`select id from educacional.matriculas where id=${b.matricula_id} and escola_id=${aula.escola_id} and turma_id=${aula.turma_id} and ano_letivo=${aula.ano_letivo}`;fail(m,'Matrícula incompatível.',403);
    await tx`select id from educacional.matriculas where id=${m.id} for update`;
    const [r]=await tx`select coalesce(max(revisao),0)+1 as revisao from educacional.pareceres_docentes where professor_id=${atribuicao.professor_id} and aula_id=${aula.id} and matricula_id=${m.id}`;
    await tx`insert into educacional.pareceres_docentes(escola_id,professor_id,turma_id,ano_letivo,componente,atribuicao_id,aula_id,matricula_id,revisao,texto,nota_docente,revisado) values(${aula.escola_id},${atribuicao.professor_id},${aula.turma_id},${aula.ano_letivo},${aula.componente},${atribuicao.id},${aula.id},${m.id},${r.revisao},${b.texto.trim()},${b.nota_docente},${b.revisado})`;
    return {ok:true,revisao:r.revisao,mensagem:'Parecer e nota docente salvos em nova revisão.'};
   }
   if(b.acao==='planejamento'){
    for(const k of ['titulo','objetivos','metodologia','avaliacao'])fail(typeof b[k]==='string'&&b[k].trim().length>=2&&b[k].length<=10000);
    fail(/^\d{4}-\d{2}-\d{2}$/.test(b.data_prevista)&&Number(b.data_prevista.slice(0,4))===aula.ano_letivo);
    await tx`insert into educacional.planejamentos_docentes(atribuicao_id,escola_id,professor_id,turma_id,ano_letivo,componente,aula_id,titulo,data_prevista,objetivos,metodologia,avaliacao,estado) values(${atribuicao.id},${aula.escola_id},${atribuicao.professor_id},${aula.turma_id},${aula.ano_letivo},${aula.componente},${aula.id},${b.titulo},${b.data_prevista},${b.objetivos},${b.metodologia},${b.avaliacao},'planejada')`;
    return {ok:true,mensagem:'Plano diário salvo.'};
   }
   fail(Array.isArray(b.alunos)&&b.alunos.length>0&&b.alunos.length<=500);const seen=new Set(),preview=[];
   for(const row of b.alunos){fail(typeof row.nome==='string'&&row.nome.trim().length>=2&&row.nome.length<=200&&typeof row.codigo==='string'&&row.codigo.trim().length>0&&row.codigo.length<=80);fail(!seen.has(row.codigo),'Há códigos repetidos na lista.');seen.add(row.codigo);
    const [m]=await tx`select m.*,al.nome from educacional.matriculas m join educacional.alunos al on al.id=m.aluno_id where m.escola_id=${aula.escola_id} and m.turma_id=${aula.turma_id} and m.ano_letivo=${aula.ano_letivo} and m.codigo_interno=${row.codigo.trim()}`;
    if(m)fail(norm(m.nome)===norm(row.nome),'Código já cadastrado com outro nome. A importação inteira foi preservada para revisão.');
    let alunoId=m?.aluno_id,estado=m?'existente':'novo';
    if(!m&&row.aluno_id){fail(uuid(row.aluno_id));const [old]=await tx`select distinct al.id,al.nome from educacional.alunos al join educacional.matriculas ma on ma.aluno_id=al.id where al.id=${row.aluno_id} and ma.escola_id=${aula.escola_id}`;fail(old&&norm(old.nome)===norm(row.nome),'Identidade anterior precisa de conferência institucional.');alunoId=old.id;estado='nova_matricula_identidade_confirmada';}
    if(!m&&!alunoId){const [prior]=await tx`select id from educacional.matriculas where escola_id=${aula.escola_id} and codigo_interno=${row.codigo.trim()} limit 1`;if(prior)estado='revisar_identidade_anterior';}
    preview.push({nome:row.nome.trim(),codigo:row.codigo.trim(),estado,aluno_id:alunoId||null});
   }
   if(b.acao==='prever_chamada')return {ok:true,previa:preview,pode_confirmar:preview.every(x=>x.estado!=='revisar_identidade_anterior')};
   fail(b.confirmado===true&&preview.every(x=>x.estado!=='revisar_identidade_anterior'),'Revise a prévia e confirme todas as identidades.');
   for(const row of preview){let aid=row.aluno_id;if(!aid){const [al]=await tx`insert into educacional.alunos(nome) values(${row.nome}) returning id`;aid=al.id;}
    const [m]=await tx`insert into educacional.matriculas(aluno_id,escola_id,turma_id,ano_letivo,codigo_interno,confirmada_em,fonte_confirmacao) values(${aid},${aula.escola_id},${aula.turma_id},${aula.ano_letivo},${row.codigo},now(),'Chamada importada e confirmada por docente autenticado') on conflict(escola_id,turma_id,ano_letivo,codigo_interno) do update set codigo_interno=excluded.codigo_interno returning id,aluno_id`;fail(m.aluno_id===aid,'Conflito de identidade.');
    await tx`insert into educacional.participantes_aula(escola_id,turma_id,ano_letivo,aula_id,matricula_id,confirmado_por) values(${aula.escola_id},${aula.turma_id},${aula.ano_letivo},${aula.id},${m.id},${atribuicao.professor_id}) on conflict do nothing`;
   }
   return {ok:true,mensagem:`${preview.length} participantes previstos cadastrados. Acessos individuais dos alunos são emitidos separadamente.`};
  });
  return Response.json(result,{headers});
 }catch(e){const status=Number(e.status)||500;return Response.json({ok:false,mensagem:status===500?'Não foi possível concluir. Nenhuma confirmação de gravação foi emitida.':e.message},{status,headers});}
});
