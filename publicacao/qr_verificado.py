"""QR no final da aula somente a partir de recibo de URL já conferida."""
import html,hashlib,json,shutil
from pathlib import Path

def apply(root,dest,item,text):
 if not item.get('qrcode_final'):return text
 registry=json.loads((root/'automacoes/aulas/entregas.json').read_text())['aulas']
 row=next((r for r in registry if r['destino']==item['destino']),None)
 if not row:return text
 receipt_path=(root/row['recibo']).resolve()
 if not receipt_path.is_relative_to(root.resolve()):raise ValueError('Recibo QR fora da raiz')
 receipt=json.loads(receipt_path.read_text());cards=[]
 for target,label in [('pages','GitHub Pages'),('vercel','Vercel')]:
  e=receipt.get('publicacao',{}).get(target,{})
  if e.get('estado')!='verificado' or e.get('http')!=200:continue
  if e.get('pacote_sha256')!=receipt.get('pacote_sha256'):raise ValueError('QR de outra versão')
  source=(root/e['qr_arquivo']).resolve()
  if not source.is_relative_to(root.resolve())or not source.is_file():raise ValueError('QR verificado ausente')
  if hashlib.sha256(source.read_bytes()).hexdigest()!=e['qr_sha256']:raise ValueError('QR divergente')
  url=e.get('url','')
  if not url.startswith('https://'):raise ValueError('URL QR inválida')
  name='qrcode-'+target+'.png';shutil.copyfile(source,dest/name)
  cards.append('<figure style="margin:8px;width:180px"><img width="170" height="170" src="'+name+'" alt="QR code para abrir esta aula no '+label+'"><figcaption><a style="color:#075a78" href="'+html.escape(url,quote=True)+'">'+label+'</a></figcaption></figure>')
 if not cards:return text
 block='<footer data-qrcode-verificado style="padding:24px;background:#f1f6f3;color:#243d4d;font:17px/1.5 system-ui;text-align:center"><h2>Abrir esta aula em outro aparelho</h2><p>Endereços conferidos. A câmera do aparelho pode ler estes códigos.</p><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">'+''.join(cards)+'</div></footer>'
 end=text.lower().rfind('</body>');return text[:end]+block+text[end:] if end>=0 else text+block
