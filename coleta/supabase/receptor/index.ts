// Credencial de conexão disponível somente no ambiente da Edge Function.
import postgres from 'npm:postgres@3.4.3';
import {envelope,relatorio,normalizar,exigir} from './validacao.mjs';
const sql=postgres(Deno.env.get('SUPABASE_DB_URL')!,{prepare:false,max:1,idle_timeout:10,connect_timeout:10});
const origin='https://andredor19.github.io';
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
function resposta(req:Request,body:unknown,status=200){return Response.json(body,{status,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'content-type','Cache-Control':'no-store','Vary':'Origin'}});}
Deno.serve(async(req:Request)=>{
 if(req.headers.get('origin')&&req.headers.get('origin')!==origin)return resposta(req,{ok:false,mensagem:'Origem não permitida.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'content-type','Access-Control-Max-Age':'600'}});
 if(req.method!=='POST')return resposta(req,{ok:false,mensagem:'Use POST.'},405);
 try{
  // Ler com limite mesmo sem Content-Length; nunca registrar o corpo em logs.
  const reader=req.body?.getReader();exigir(reader,'Corpo ausente.');let size=0,parts:Uint8Array[]=[];
  while(true){const {done,value}=await reader!.read();if(done)break;size+=value.length;if(size>512000){await reader!.cancel();return resposta(req,{ok:false,mensagem:'Envio muito grande.'},413);}parts.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.length;}
  const b=envelope(JSON.parse(new TextDecoder().decode(bytes)));
  // Cota persistente por minuto e por dia; não confundir CORS com autorização.
  const buckets=[{id:'global:'+new Date().toISOString().slice(0,10),limit:12000},{id:'minuto:'+new Date().toISOString().slice(0,16),limit:180}];
  const permitido=await sql.begin(async tx=>{for(const k of buckets){const [r]=await tx`insert into educacional.limites_receptor(chave,quantidade) values(${k.id},1) on conflict(chave) do update set quantidade=educacional.limites_receptor.quantidade+1 returning quantidade`;if(r.quantidade>k.limit)return false;}return true;});
  if(!permitido)return resposta(req,{ok:false,mensagem:'Limite temporário atingido. Preserve a atividade e tente depois.'},429);
  const segredo=await hash(b.convite);
  const out=await sql.begin(async tx=>{
   const [v]=await tx`select c.*,a.artefato_id,a.versao,a.componente,a.percursos_total,a.coleta_ativa,e.nome as escola,t.codigo as turma,al.nome as aluno from educacional.convites c join educacional.aulas a on a.id=c.aula_id join educacional.escolas e on e.id=c.escola_id join educacional.turmas t on t.id=c.turma_id join educacional.matriculas m on m.id=c.matricula_id join educacional.alunos al on al.id=m.aluno_id join educacional.vinculos_professores vp on vp.escola_id=c.escola_id and vp.professor_id=a.professor_id and vp.ativo where c.segredo_sha256=${segredo} and c.revogado_em is null and c.expira_em>now()`;
   if(!v||!v.coleta_ativa||v.artefato_id!==b.artefato)throw Object.assign(new Error('Acesso inválido, expirado ou aula indisponível. Peça ajuda ao professor.'),{status:403});
   if(b.acao==='iniciar'){
    for(const k of ['escola','aluno','materia','turma']){const esperado=k==='materia'?v.componente:v[k];exigir(normalizar(b.identificacao[k])===normalizar(esperado),'Dados não correspondem ao acesso. Confira com o professor.');}
    // Serialização por convite impede excesso de sessões simultâneas.
    await tx`select id from educacional.convites where id=${v.id} for update`;
    const [count]=await tx`select count(*)::int as n from educacional.sessoes where convite_id=${v.id}`;
    const [old]=await tx`select id,convite_id from educacional.sessoes where id=${b.sessao_id}`;
    exigir(!old||old.convite_id===v.id,'Sessão incompatível.');exigir(old||count.n<5,'Limite de sessões deste acesso. Peça revisão ao professor.');
    if(!old)await tx`insert into educacional.sessoes(id,escola_id,turma_id,ano_letivo,aula_id,matricula_id,ambiente,convite_id) values(${b.sessao_id},${v.escola_id},${v.turma_id},${v.ano_letivo},${v.aula_id},${v.matricula_id},${v.ambiente},${v.id})`;
    return {ok:true,estado:'identificado',sessao_id:b.sessao_id,ambiente:v.ambiente,identificacao:{escola:v.escola,aluno:v.aluno,materia:v.componente,turma:v.turma}};
   }
   const [s]=await tx`select * from educacional.sessoes where id=${b.sessao_id} and convite_id=${v.id} for update`;
   if(!s)throw Object.assign(new Error('Identifique-se antes de iniciar.'),{status:403});
   if(b.acao==='eventos'){
    const [count]=await tx`select count(*)::int as n from educacional.eventos where sessao_id=${s.id}`;exigir(count.n+b.eventos.length<=5000,'Limite de registros desta sessão. Preserve seu relatório.');
    for(const e of b.eventos){
     const [old]=await tx`select sessao_id,sequencia,tipo,ocorrido_em_cliente,dados from educacional.eventos where id=${e.id}`;
     if(old){const [same]=await tx`select id from educacional.eventos where id=${e.id} and sessao_id=${s.id} and sequencia=${e.sequencia} and tipo=${e.tipo} and ocorrido_em_cliente=${e.ocorrido_em}::timestamptz and dados=${tx.json(e.dados)}`;exigir(same,'ID de evento com conteúdo diferente.');}
     else await tx`insert into educacional.eventos(id,escola_id,sessao_id,sequencia,tipo,ocorrido_em_cliente,dados) values(${e.id},${s.escola_id},${s.id},${e.sequencia},${e.tipo},${e.ocorrido_em},${tx.json(e.dados)})`;
    }
    await tx`update educacional.sessoes set ultimo_recebimento_em=now() where id=${s.id}`;
    return {ok:true,estado:'recebido',sessao_id:s.id,ids:b.eventos.map((e:any)=>e.id)};
   }
   const p=b.relatorio,{total,primeiros}=relatorio(p,v.percursos_total),sha=await hash(JSON.stringify(p));
   const [old]=await tx`select * from educacional.relatorios where id=${p.id}`;
   if(old){exigir(old.sessao_id===s.id&&old.sha256===sha,'Relatório com ID ou conteúdo incompatível.');return {ok:true,estado:'recebido',id:old.id,sha256:sha,revisao:old.revisao};}
   const [n]=await tx`select count(*)::int as n,coalesce(max(revisao),0)+1 as revisao from educacional.relatorios where sessao_id=${s.id}`;exigir(n.n<20,'Limite de revisões. Peça revisão ao professor.');
   await tx`insert into educacional.relatorios(id,escola_id,sessao_id,revisao,sha256,percursos_total,percursos_concluidos,acertos_iniciais,experiencia_confirmada,experiencia_preenchida,conteudo,texto) values(${p.id},${s.escola_id},${s.id},${n.revisao},${sha},${total},${total},${primeiros},true,true,${tx.json(p)},${p.texto})`;
   await tx`update educacional.sessoes set estado='concluida',ultimo_recebimento_em=now() where id=${s.id}`;
   return {ok:true,estado:'recebido',id:p.id,sha256:sha,revisao:n.revisao};
  });
  return resposta(req,out);
 }catch(e){const status=Number(e.status)||(['23505','23503'].includes(e.code)?409:500);return resposta(req,{ok:false,mensagem:status===500?'Recebimento sem confirmação. Preserve os dados e tente novamente.':e.message},status);}
});
