import postgres from 'npm:postgres@3.4.3';
const db=postgres(Deno.env.get('SUPABASE_DB_URL')!,{prepare:false,max:1,connect_timeout:10});
const allowed=new Set(['https://andredor19.github.io','https://aulas-03-11-2026.vercel.app']);
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLowerCase();
const sha=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)))).map(x=>x.toString(16).padStart(2,'0')).join('');
const error=(msg,status=400)=>{throw Object.assign(new Error(msg),{status})};
const cors=req=>({'Access-Control-Allow-Origin':allowed.has(req.headers.get('origin'))?req.headers.get('origin'):'https://andredor19.github.io','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store','Vary':'Origin'});
Deno.serve(async req=>{
 const headers=cors(req), origin=req.headers.get('origin');
 if(origin&&!allowed.has(origin))return Response.json({ok:false,mensagem:'Origem não permitida.'},{status:403,headers});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return Response.json({ok:false,mensagem:'Método inválido.'},{status:405,headers});
 try{
  if(Number(req.headers.get('content-length')||'0')>80000)error('Dados excessivos.',413);
  const raw=await req.text();if(raw.length>80000)error('Dados excessivos.',413);
  const b=JSON.parse(raw);if(!['iniciar','eventos','concluir'].includes(b.acao))error('Operação inválida.');
  const dia=new Date().toISOString().slice(0,10);
  const [quota]=await db`insert into educacional.limites_receptor(chave,quantidade) values(${'livre:'+dia},1) on conflict(chave) do update set quantidade=educacional.limites_receptor.quantidade+1 returning quantidade`;
  if(quota.quantidade>10000)error('Limite diário de recepção.',429);
  if(b.acao==='iniciar'){
    if(typeof b.artefato!=='string'||b.artefato.length>160||!uuid.test(b.sessao_id)||typeof b.token!=='string'||!/^[a-f0-9]{64}$/.test(b.token))error('Sessão inválida.');
    const nome=String(b.nome||'').trim(),turma=String(b.turma||'').trim(),professor=String(b.professor||'').trim();
    if(nome.length<3||nome.length>120||turma.length<1||turma.length>40||professor.length<3||professor.length>120)error('Preencha nome, turma e professor.');
    const [a]=await db`select a.id,a.escola_id,a.turma_id,t.codigo turma,p.nome professor from educacional.aulas a join educacional.turmas t on t.id=a.turma_id join educacional.escolas e on e.id=a.escola_id and e.ativa join educacional.professores p on p.id=a.professor_id join educacional.vinculos_professores vp on vp.escola_id=a.escola_id and vp.professor_id=a.professor_id and vp.ativo where a.artefato_id=${b.artefato} and a.coleta_ativa and a.artefato_id not like 'qa-%'`;
    if(!a||norm(a.turma)!==norm(turma)||norm(a.professor)!==norm(professor))error('Turma ou professor não correspondem à aula cadastrada.',403);
    const digest=await sha(b.token);
    const [saved]=await db`insert into educacional.coleta_livre_sessoes(id,aula_id,escola_id,turma_id,nome_declarado,turma_declarada,professor_declarado,acesso_sha256) values(${b.sessao_id},${a.id},${a.escola_id},${a.turma_id},${nome},${turma},${professor},${digest}) on conflict(id) do update set ultima_interacao_em=now() where educacional.coleta_livre_sessoes.acesso_sha256=excluded.acesso_sha256 and educacional.coleta_livre_sessoes.aula_id=excluded.aula_id returning id`;
    if(!saved)error('Sessão existente incompatível.',403);
    return Response.json({ok:true,estado:'identificado',sessao_id:saved.id},{headers});
  }
  if(!uuid.test(b.sessao_id)||typeof b.token!=='string'||!/^[a-f0-9]{64}$/.test(b.token))error('Sessão inválida.',403);
  const digest=await sha(b.token);
  const [s]=await db`select id,aula_id,estado from educacional.coleta_livre_sessoes where id=${b.sessao_id} and acesso_sha256=${digest}`;
  if(!s)error('Sessão não autorizada.',403);
  if(b.acao==='eventos'){
    if(s.estado!=='em_andamento')error('Aula já concluída.',409);
    if(!Array.isArray(b.eventos)||b.eventos.length<1||b.eventos.length>20)error('Lote inválido.');
    for(const ev of b.eventos){
      if(!uuid.test(ev.id)||!Number.isInteger(ev.sequencia)||ev.sequencia<0||!['inicio','tentativa','pista','consulta','audio','tempo','progresso','avaliacao','fim'].includes(ev.tipo)||typeof ev.dados!=='object'||ev.dados===null||Array.isArray(ev.dados)||JSON.stringify(ev.dados).length>4096)error('Evento inválido.');
      await db`insert into educacional.coleta_livre_eventos(id,sessao_id,sequencia,tipo,dados) values(${ev.id},${s.id},${ev.sequencia},${ev.tipo},${db.json(ev.dados)}) on conflict(id) do nothing`;
    }
    await db`update educacional.coleta_livre_sessoes set ultima_interacao_em=now() where id=${s.id}`;
    return Response.json({ok:true,estado:'recebido',quantidade:b.eventos.length},{headers});
  }
  const p=b.relatorio;
  if(!p||!Number.isInteger(p.percursos_total)||!Number.isInteger(p.percursos_concluidos)||!Number.isInteger(p.acertos_iniciais)||p.percursos_total<1||p.percursos_total>300||p.percursos_concluidos<0||p.percursos_concluidos>p.percursos_total||p.acertos_iniciais<0||p.acertos_iniciais>p.percursos_concluidos||JSON.stringify(p).length>60000)error('Relatório inválido.');
  const result=await db.begin(async tx=>{
   await tx`insert into educacional.coleta_livre_relatorios(sessao_id,percursos_total,percursos_concluidos,acertos_iniciais,relatorio) values(${s.id},${p.percursos_total},${p.percursos_concluidos},${p.acertos_iniciais},${tx.json(p)}) on conflict(sessao_id) do nothing`;
   await tx`update educacional.coleta_livre_sessoes set estado='concluida',concluida_em=coalesce(concluida_em,now()),ultima_interacao_em=now() where id=${s.id}`;
   return {ok:true,estado:'recebido'};
  });
  return Response.json(result,{headers});
 }catch(e){return Response.json({ok:false,mensagem:Number(e.status||500)===500?'Não foi possível confirmar o envio. Tente novamente.':e.message},{status:Number(e.status)||500,headers});}
});