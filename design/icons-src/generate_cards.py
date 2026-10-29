# Kart görselleri (assets/categories/*.png): 1024x1024, düz aile tonu zemin + ortada glif. generate.py'den sonra çalıştır.
import os, re, json, subprocess, html, base64
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
exec(open('generate.py').read().split("AREA=")[0])   # FAM, CAT, G, mix
GLYPH=780   # 1024 içinde glif kutusu
out='cards'; os.makedirs(out,exist_ok=True)
items=[]
for n,fam in CAT.items():
    l,d=FAM[fam]
    for suf,col,bg in (('',l,mix(l,'#FFFFFF',.88)),('-dark',d,mix(d,'#1A1918',.84))):
        inner=re.search(r'<g transform=.*</g>',open(f'{n}{suf}.svg').read(),re.S).group(0)
        k=GLYPH/96; o=(1024-GLYPH)/2
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="{bg}"/><g transform="translate({o} {o}) scale({k:.4f})">{inner}</g></svg>'
        items.append((n+suf,svg))
js='const items=%s;const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s)});(async()=>{const o={};for(const [n,s] of items){const c=document.createElement("canvas");c.width=c.height=1024;c.getContext("2d").drawImage(await load(s),0,0);o[n]=c.toDataURL("image/png")}document.getElementById("o").textContent=JSON.stringify(o)})();'%json.dumps(items)
open(out+'/_m.html','w').write('<html><body><textarea id="o"></textarea><script>'+js+'</script></body></html>')
dom=subprocess.run([CHROME,'--headless','--disable-gpu','--virtual-time-budget=60000','--dump-dom','file://'+os.path.abspath(out+'/_m.html')],capture_output=True,text=True).stdout
res=json.loads(html.unescape(re.search(r'<textarea id="o">(.*?)</textarea>',dom,re.S).group(1)))
for n,u in res.items(): open(f'{out}/{n}.png','wb').write(base64.b64decode(u.split(',')[1]))
os.remove(out+'/_m.html'); print(len(res))
