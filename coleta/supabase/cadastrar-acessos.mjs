/** Cadastro administrativo local: nunca colocar a entrada/saída no Git público.
 * node coleta/supabase/cadastrar-acessos.mjs /caminho/restrito/turma.json /caminho/restrito/saida
 * JSON: {artefato:"piloto-coleta-historia-192",expira_em:"2026-12-19T03:00:00Z",alunos:[{nome:"...",codigo:"...",aluno_id:"UUID estável opcional"}]}
 * Executar cadastro.sql somente no SQL Editor administrativo; não no navegador discente.
 */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Informe entrada JSON privada e diretório privado de saída.');
const root=path.resolve(new URL('../../',import.meta.url).pathname);
const out=path.resolve(output);
if(out.startsWith(root+path.sep)&&!out.startsWith(path.join(root,'dados-privados')+path.sep))throw Error('Saída deve ficar fora do repositório ou em dados-privados, ignorado pelo Git.');
const data=JSON.parse(fs.readFileSync(input,'utf8'));
if(!/^[a-zA-Z0-9_-]{1,200}$/.test(data.artefato)||!Number.isFinite(Date.parse(data.expira_em))||Date.parse(data.expira_em)<=Date.now()||!Array.isArray(data.alunos)||!data.alunos.length)throw Error('Cadastro inválido.');
const q=s=>"'"+String(s).replaceAll("'","''")+"'";
let sql='-- CONTÉM DADOS PESSOAIS. Executar exclusivamente como administrador.\nBEGIN;\n',access=[];const codes=new Set();
for(const a of data.alunos){
 if(typeof a.nome!=='string'||a.nome.trim().length<2||a.nome.length>200||typeof a.codigo!=='string'||!a.codigo.trim()||a.codigo.length>80||codes.has(a.codigo))throw Error('Nome/código inválido ou duplicado.');codes.add(a.codigo);
 if(a.aluno_id&&!/^[0-9a-f-]{36}$/i.test(a.aluno_id))throw Error('aluno_id inválido.');
 const delim='$cadastro_'+crypto.randomBytes(16).toString('hex')+'$';
 const token=crypto.randomBytes(32).toString('hex'),hash=crypto.createHash('sha256').update(token).digest('hex'),novo=a.aluno_id||crypto.randomUUID();
 sql+=`DO ${delim} DECLARE aula educacional.aulas%rowtype; mat educacional.matriculas%rowtype; aluno uuid; BEGIN
 SELECT * INTO STRICT aula FROM educacional.aulas WHERE artefato_id=${q(data.artefato)} AND coleta_ativa;
 SELECT * INTO mat FROM educacional.matriculas WHERE escola_id=aula.escola_id AND turma_id=aula.turma_id AND ano_letivo=aula.ano_letivo AND codigo_interno=${q(a.codigo)};
 IF FOUND THEN
  aluno:=mat.aluno_id;
  IF (SELECT nome FROM educacional.alunos WHERE id=aluno)<>${q(a.nome.trim())} THEN RAISE EXCEPTION 'Código existente com outro nome; revisar cadastro privado'; END IF;
 ELSE
  aluno:=${q(novo)}::uuid;
  INSERT INTO educacional.alunos(id,nome) VALUES(aluno,${q(a.nome.trim())}) ON CONFLICT(id) DO NOTHING;
  IF (SELECT nome FROM educacional.alunos WHERE id=aluno)<>${q(a.nome.trim())} THEN RAISE EXCEPTION 'Identidade existente divergente'; END IF;
  INSERT INTO educacional.matriculas(aluno_id,escola_id,turma_id,ano_letivo,codigo_interno,confirmada_em,fonte_confirmacao) VALUES(aluno,aula.escola_id,aula.turma_id,aula.ano_letivo,${q(a.codigo)},now(),'Lista conferida pelo professor') RETURNING * INTO mat;
 END IF;
 INSERT INTO educacional.participantes_aula(escola_id,turma_id,ano_letivo,aula_id,matricula_id,confirmado_por) VALUES(aula.escola_id,aula.turma_id,aula.ano_letivo,aula.id,mat.id,aula.professor_id) ON CONFLICT(aula_id,matricula_id) DO NOTHING;
 INSERT INTO educacional.convites(escola_id,turma_id,ano_letivo,aula_id,matricula_id,segredo_sha256,expira_em,ambiente) VALUES(aula.escola_id,aula.turma_id,aula.ano_letivo,aula.id,mat.id,${q(hash)},${q(data.expira_em)},'producao');
 END ${delim};\n`;
 access.push({nome:a.nome.trim(),codigo:a.codigo,acesso:token});
}
sql+='COMMIT;\n';fs.mkdirSync(out,{recursive:true,mode:0o700});fs.writeFileSync(path.join(out,'cadastro.sql'),sql,{mode:0o600});fs.writeFileSync(path.join(out,'acessos-individuais.json'),JSON.stringify(access,null,2),{mode:0o600});console.log('Cadastro SQL e acessos individuais preparados em diretório privado. Não publicar esses arquivos; distribuir cada acesso apenas ao respectivo estudante.');
