import fs from 'node:fs/promises';
const base=new URL('./',import.meta.url);
const core=await fs.readFile(new URL('contrato.js',base),'utf8');
const headers=JSON.parse(await fs.readFile(new URL('headers.json',base),'utf8'));
const receiver=(await fs.readFile(new URL('receptor.gs',base),'utf8')).replace('__HEADERS_JSON__',JSON.stringify(headers));
await fs.mkdir(new URL('apps-script/',base),{recursive:true});
await fs.writeFile(new URL('apps-script/Code.gs',base),core+'\n'+receiver);
await fs.copyFile(new URL('appsscript.json',base),new URL('apps-script/appsscript.json',base));
console.log('Code.gs gerado a partir do contrato compartilhado.');
