import os, json, subprocess, re, html, base64
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
def mix(a,b,t):
    a=a.lstrip('#');b=b.lstrip('#')
    return '#%02X%02X%02X'%tuple(round(int(a[i:i+2],16)*(1-t)+int(b[i:i+2],16)*t) for i in (0,2,4))
# 8 aile: (açık, koyu). Kırmızı, amber, mercan, altın yok (altın ödül rengi, kategoride kullanılmaz).
FAM={'green':('#2F7D5B','#6FCB9F'),'indigo':('#5B5FB5','#A5A9F0'),'blue':('#1F7FA8','#7CC3E3'),
     'earth':('#A5623A','#E0A27C'),'rose':('#C0507A','#F29AB8'),'slate':('#4C5B7A','#A9B7D6'),
     'petrol':('#1F5F5B','#7CC0B6'),'plum':('#8650A8','#CFA0E8')}
CAT={'Finance':'green','Growth':'green','Psychology':'indigo','Philosophy':'indigo','Science':'plum','Communication':'blue',
     'History':'earth','Leadership':'earth','Health':'rose','Business':'slate','Productivity':'slate','All':'petrol'}
# Hepsi dolgu. {S} ana, {D} ikinci, {L} S üzerindeki iç detay.
G={
'Finance':'<path d="M30 36C8 56 6 92 48 92s40-36 18-56z" fill="{S}"/><path d="M30 30 24 6l16 10 8-12 8 12 16-10-6 24z" fill="{D}"/><rect x="28" y="28" width="40" height="10" rx="5" fill="{D}"/><circle cx="48" cy="64" r="15" fill="{L}"/><circle cx="48" cy="64" r="8" fill="{S}"/>',
'Psychology':'<path d="M24 92V72C10 64 6 52 6 41 6 21 24 6 46 6c22 0 38 13 40 30l7 13c1 3-1 5-4 5h-3v8c0 7-5 10-12 10H62v19z" fill="{S}"/><circle cx="46" cy="36" r="16" fill="{L}"/><rect x="38" y="48" width="16" height="13" rx="4" fill="{L}"/>',
'Philosophy':'<path d="M12 38c0-16 15-28 36-28s36 12 36 28v26c0 18-15 28-36 28S12 82 12 64z" fill="{S}"/><circle cx="32" cy="48" r="17" fill="{W}"/><circle cx="64" cy="48" r="17" fill="{W}"/><circle cx="32" cy="48" r="8.5" fill="{K}"/><circle cx="64" cy="48" r="8.5" fill="{K}"/><path d="M20 24l-6-18 20 10zM76 24l6-18-20 10z" fill="{D}"/>',
'History':'<rect x="28" y="6" width="40" height="12" rx="6" fill="{D}"/><rect x="37" y="14" width="22" height="20" fill="{S}"/><path d="M30 28h36c14 10 18 30 10 46-5 12-14 18-28 18S25 86 20 74c-8-16-4-36 10-46z" fill="{S}"/><rect x="20" y="52" width="56" height="9" fill="{D}"/><path d="M38 22C14 22 10 42 22 48M58 22c24 0 28 20 16 26" fill="none" stroke="{D}" stroke-width="7" stroke-linecap="round"/>',
'Leadership':'<path d="M4 92 34 44l14 20 12-16 32 44z" fill="{S}"/><rect x="34" y="4" width="7" height="46" rx="3.5" fill="{D}"/><path d="M41 6h34l-10 12 10 12H41z" fill="{D}"/>',
'Health':'<path d="M48 30C38 22 8 22 8 54c0 22 14 40 26 40 6 0 10-3 14-3s8 3 14 3c12 0 26-18 26-40 0-32-30-32-40-24z" fill="{S}"/><path d="M50 28C50 14 58 6 72 6c0 14-8 22-22 22z" fill="{D}"/><rect x="41" y="46" width="14" height="32" rx="4.5" fill="{L}"/><rect x="32" y="55" width="32" height="14" rx="4.5" fill="{L}"/>',
'Science':'<path d="M36 6h24v28l26 46c4 8-1 13-9 13H19c-8 0-13-5-9-13l26-46z" fill="{S}"/><path d="M24 62h48l14 25c2 4 0 6-5 6H15c-5 0-7-2-5-6z" fill="{M}"/><rect x="30" y="2" width="36" height="10" rx="5" fill="{D}"/><circle cx="46" cy="52" r="5" fill="{L}"/><circle cx="58" cy="40" r="3.5" fill="{L}"/>',
'Growth':'<rect x="43" y="40" width="10" height="48" rx="5" fill="{D}"/><path d="M46 62C24 62 10 48 10 26c22 0 36 12 36 36z" fill="{S}"/><path d="M50 50C50 26 64 12 88 12c0 24-16 38-38 38z" fill="{M}"/><rect x="22" y="82" width="52" height="9" rx="4.5" fill="{D}"/>',
'Productivity':'<path d="M22 14h52c0 24-16 30-16 34s16 10 16 34H22c0-24 16-30 16-34S22 38 22 14z" fill="{S}"/><rect x="14" y="4" width="68" height="12" rx="6" fill="{D}"/><rect x="14" y="80" width="68" height="12" rx="6" fill="{D}"/><path d="M32 22h32c-2 10-10 16-16 16S34 32 32 22z" fill="{L}"/><path d="M48 58c-8 0-14 8-16 20h32c-2-12-8-20-16-20z" fill="{L}"/>',
'Communication':'<path d="M14 8h40a10 10 0 0 1 10 10v24a10 10 0 0 1-10 10H34L18 66V52h-4A10 10 0 0 1 4 42V18A10 10 0 0 1 14 8z" fill="{S}"/><path d="M48 44h34a10 10 0 0 1 10 10v24a10 10 0 0 1-10 10h-4v12L60 88H48a10 10 0 0 1-10-10V54a10 10 0 0 1 10-10z" fill="{D}"/>',
'Business':'<rect x="6" y="30" width="84" height="60" rx="11" fill="{S}"/><path d="M30 32V20a10 10 0 0 1 10-10h16a10 10 0 0 1 10 10v12h-9V22a2 2 0 0 0-2-2H41a2 2 0 0 0-2 2v10z" fill="{D}"/><rect x="6" y="56" width="84" height="7" fill="{D}"/><rect x="40" y="50" width="16" height="20" rx="4" fill="{L}"/>',
'All':'<rect x="6" y="6" width="38" height="38" rx="11" fill="{S}"/><rect x="52" y="6" width="38" height="38" rx="11" fill="{D}"/><rect x="6" y="52" width="38" height="38" rx="11" fill="{D}"/><rect x="52" y="52" width="38" height="38" rx="11" fill="{S}"/>',
}
AREA=float(os.environ.get('AREA','3000')); MAXDIM=86   # eşit dolu alan, sınır kutusu üst limiti
out='v10'; os.makedirs(out,exist_ok=True)
items=[]
for n,fam in CAT.items():
    l,d=FAM[fam]
    pal={'':(l,mix(l,'#000000',.38),mix(l,'#FFFFFF',.86),mix(l,'#FFFFFF',.35),mix(l,'#FFFFFF',.92),mix(l,'#000000',.6)),'-dark':(d,mix(d,'#FFFFFF',.45),mix(d,'#141413',.78),mix(d,'#FFFFFF',.3),mix(d,'#FFFFFF',.92),mix(d,'#000000',.62))}
    items.append({'n':n,'m':G[n].format(S='#000',D='#000',L='#000',M='#000',W='#000',K='#000'),
                  'v':{suf:G[n].format(S=S,D=D,L=L,M=M,W=W,K=K) for suf,(S,D,L,M,W,K) in pal.items()}})
js='''
const items=%s, AREA=%s, MAXDIM=%s;
const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)});
const wrap=(b,sz,t)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 96 96">${t?`<g transform="${t}">`:''}${b}${t?'</g>':''}</svg>`;
(async()=>{const res={};
for(const it of items){
  const c=document.createElement('canvas');c.width=c.height=192;const x=c.getContext('2d');
  x.drawImage(await load(wrap(it.m,192)),0,0);const d=x.getImageData(0,0,192,192).data;
  let n=0,x0=999,y0=999,x1=0,y1=0;
  for(let i=0;i<192;i++)for(let j=0;j<192;j++)if(d[(i*192+j)*4+3]>127){n++;x0=Math.min(x0,j);x1=Math.max(x1,j);y0=Math.min(y0,i);y1=Math.max(y1,i)}
  const area=n/4,w=(x1-x0+1)/2,h=(y1-y0+1)/2,cx=(x0+x1+1)/4,cy=(y0+y1+1)/4;
  const s=Math.min(Math.sqrt(AREA/area),MAXDIM/Math.max(w,h));
  const t=`translate(${(48-cx*s).toFixed(2)} ${(48-cy*s).toFixed(2)}) scale(${s.toFixed(4)})`;
  res[it.n]={area,s,cover:area*s*s/9216,t,files:{}};
  for(const suf in it.v){
    const svg=wrap(it.v[suf],360,t);const cc=document.createElement('canvas');cc.width=cc.height=360;
    cc.getContext('2d').drawImage(await load(svg),0,0);
    res[it.n].files[suf]={svg,png:cc.toDataURL('image/png')};
  }}
document.getElementById('o').textContent=JSON.stringify(res);document.title='ready';})();
''' % (json.dumps(items),AREA,MAXDIM)
open(out+'/_m.html','w').write('<html><body><textarea id="o"></textarea><script>'+js+'</script></body></html>')
dom=subprocess.run([CHROME,'--headless','--disable-gpu','--virtual-time-budget=30000','--dump-dom','file://'+os.path.abspath(out+'/_m.html')],capture_output=True,text=True).stdout
res=json.loads(html.unescape(re.search(r'<textarea id="o">(.*?)</textarea>',dom,re.S).group(1)))
meta={}
for n,r in res.items():
    meta[n]={'fam':CAT[n],'cover':round(r['cover'],3),'scale':round(r['s'],3)}
    for suf,f in r['files'].items():
        open(f'{out}/{n}{suf}.svg','w').write(f['svg'])
        open(f'{out}/{n}{suf}.png','wb').write(base64.b64decode(f['png'].split(',')[1]))
os.remove(out+'/_m.html')
json.dump(meta,open(out+'/hues.json','w'),indent=1)
print({n:m['cover'] for n,m in meta.items()})
