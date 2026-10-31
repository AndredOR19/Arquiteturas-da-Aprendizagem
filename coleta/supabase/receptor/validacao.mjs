// Contrato público, sem credenciais. Os resultados continuam declarados pelo cliente.
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const normalizar=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLowerCase();
export const perguntas={leitura:['Fácil','Em parte fácil','Difícil','Não sei avaliar'],organizacao:['Sim','Em parte','Não','Não usei essas partes'],navegacao:['Sim','Em parte','Não','Não testei'],controles:['Sim','Em parte','Não','Não usei'],fonte:['Mais confortável','Sem diferença percebida','Menos confortável','Não troquei','Não sei avaliar'],espacamento:['Mais confortável','Sem diferença percebida','Menos confortável','Não ajustei','Não sei avaliar'],imagens:['Ajudaram','Em parte','Atrapalharam','Não percebi diferença','Não usei'],dificuldades:['Texto','Organização','Botões','Fontes ou ajustes','Imagens','Áudio','Tela','Outra','Não percebi dificuldade'],sugestao:['Quero comentar','Não tenho sugestão agora']};
export function exigir(ok,mensagem='Dados inválidos.'){if(!ok)throw Object.assign(new Error(mensagem),{status:400});}
export function envelope(b){
 exigir(b&&['iniciar','eventos','relatorio'].includes(b.acao));
 exigir(/^[a-f0-9]{64}$/.test(b.convite||''),'Informe seu acesso individual.');
 exigir(UUID.test(b.sessao_id||''));
 exigir(typeof b.artefato==='string'&&b.artefato.length<=200);
 if(b.acao==='iniciar')for(const k of ['escola','aluno','materia','turma'])exigir(typeof b.identificacao?.[k]==='string'&&b.identificacao[k].trim().length>0&&b.identificacao[k].length<=200,'Preencha escola, aluno, matéria e turma.');
 if(b.acao==='eventos'){
  exigir(Array.isArray(b.eventos)&&b.eventos.length>=1&&b.eventos.length<=20);
  for(const e of b.eventos){exigir(UUID.test(e.id||'')&&Number.isSafeInteger(e.sequencia)&&e.sequencia>=0&&['inicio','tentativa','pista','consulta','reformulacao','audio','visibilidade','tempo','conclusao_etapa','avaliacao','fim'].includes(e.tipo));exigir(typeof e.ocorrido_em==='string'&&Number.isFinite(Date.parse(e.ocorrido_em)));exigir(e.dados&&typeof e.dados==='object'&&!Array.isArray(e.dados)&&new TextEncoder().encode(JSON.stringify(e.dados)).length<=16000);}
  exigir(new Set(b.eventos.map(e=>e.id)).size===b.eventos.length);
 }
 return b;
}
export function relatorio(p,total){
 exigir(p&&UUID.test(p.id||''));
 exigir(Array.isArray(p.records)&&p.records.length===total,'Percursos incompletos.');
 for(const r of p.records){exigir(r.correct===true&&Array.isArray(r.attempts)&&r.attempts.length>0&&r.attempts.length<=500,'Percursos incompletos.');for(const a of r.attempts)exigir(typeof a.correct==='boolean'&&Number.isInteger(a.option)&&a.option>=0&&a.option<20);exigir(r.attempts.at(-1).correct===true);}
 exigir(p.experience?.confirmed===true,'Confirme a avaliação.');
 for(const [id,opcoes]of Object.entries(perguntas))exigir(opcoes.includes(p.experience?.answers?.[id]),'Responda a todas as perguntas da avaliação.');
 if(p.experience.answers.sugestao==='Quero comentar')exigir(typeof p.experience.comment==='string'&&p.experience.comment.trim().length>0);
 exigir(typeof p.texto==='string'&&p.texto.trim().length>0&&new TextEncoder().encode(p.texto).length<=250000);
 return {total,primeiros:p.records.filter(r=>r.attempts[0].correct).length};
}
