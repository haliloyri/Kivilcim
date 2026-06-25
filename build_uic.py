# -*- coding: utf-8 -*-
import cairosvg

BG        = "#F7F3ED"
PANEL     = "#EFE9DF"
SURFACE   = "#FFFFFF"
TEXT      = "#181716"
TEXT2     = "#8F8A80"
GOLD      = "#C29B4C"
GOLD2     = "#E0B95B"
BORDER    = "#E4DED4"
GOLD_TINT = "#F4ECDA"

W, H = 390, 820
S, SER = "Inter", "Playfair Display"

el=[]
def add(x): el.append(x)
def rrect(x,y,w,h,r,fill,stroke=None,sw=1):
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" ry="{r}" fill="{fill}"'
    if stroke: s+=f' stroke="{stroke}" stroke-width="{sw}"'
    return s+'/>'
def text(x,y,t,size,fill,family=S,weight=400,anchor="start",ls=None):
    extra=f' letter-spacing="{ls}"' if ls is not None else ''
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{extra}>{t}</text>')

# icon drawers (centered at cx,cy)
def flame(cx,cy,col):
    return (f'<path d="M{cx},{cy-8} C{cx+4.5},{cy-2} {cx+5.5},{cy+1} {cx+1.8},{cy+5.5} '
            f'C{cx+4.5},{cy+3.5} {cx+4.5},{cy} {cx+2.7},{cy-1.8} '
            f'C{cx+3.6},{cy+2.7} {cx+0.9},{cy+6} {cx-2.7},{cy+4.5} '
            f'C{cx-6},{cy+1.8} {cx-2.7},{cy-2.7} {cx},{cy-8} Z" fill="{col}"/>')
def clock(cx,cy,col):
    return (f'<circle cx="{cx}" cy="{cy}" r="8" fill="none" stroke="{col}" stroke-width="1.8"/>'
            f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy-5}" stroke="{col}" stroke-width="1.8" stroke-linecap="round"/>'
            f'<line x1="{cx}" y1="{cy}" x2="{cx+4}" y2="{cy+1}" stroke="{col}" stroke-width="1.8" stroke-linecap="round"/>')
def chatq(cx,cy,col):
    return (f'<path d="M{cx-8},{cy-7} h16 a2,2 0 0 1 2,2 v8 a2,2 0 0 1 -2,2 h-9 l-4,4 v-4 h-3 a2,2 0 0 1 -2,-2 v-8 a2,2 0 0 1 2,-2 Z" '
            f'fill="none" stroke="{col}" stroke-width="1.8" stroke-linejoin="round"/>'
            f'<text x="{cx}" y="{cy+3.5}" font-family="{S}" font-size="10" font-weight="700" fill="{col}" text-anchor="middle">?</text>')
def key(cx,cy,col):
    return (f'<circle cx="{cx-3}" cy="{cy-3}" r="5" fill="none" stroke="{col}" stroke-width="1.8"/>'
            f'<line x1="{cx+0.5}" y1="{cy+0.5}" x2="{cx+7}" y2="{cy+7}" stroke="{col}" stroke-width="1.8" stroke-linecap="round"/>'
            f'<line x1="{cx+4.5}" y1="{cy+7}" x2="{cx+7}" y2="{cy+4.5}" stroke="{col}" stroke-width="1.8" stroke-linecap="round"/>')

add('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">'
    f'<stop offset="0" stop-color="{GOLD2}"/><stop offset="1" stop-color="{GOLD}"/></linearGradient>'
    '<filter id="soft" x="-20%" y="-20%" width="140%" height="170%">'
    '<feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="#B79B5E" flood-opacity="0.22"/></filter>'
    '<filter id="sf" x="-20%" y="-20%" width="140%" height="160%">'
    '<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000" flood-opacity="0.06"/></filter></defs>')

add(rrect(0,0,W,H,0,BG))

# status bar
add(rrect(150,16,90,26,13,"#111"))
add(text(26,33,"16:17",15,TEXT,S,600))
for i,h in enumerate([4,7,10,13]): add(rrect(300+i*5,30-h+8,3.2,h,1,TEXT))
add(f'<path d="M326,30 a9,9 0 0 1 14,0" fill="none" stroke="{TEXT}" stroke-width="2.2" stroke-linecap="round"/>')
add(f'<path d="M329.5,33.5 a5,5 0 0 1 7,0" fill="none" stroke="{TEXT}" stroke-width="2.2" stroke-linecap="round"/>')
add(f'<circle cx="333" cy="37" r="1.6" fill="{TEXT}"/>')
add(rrect(348,26,22,11,3,"none",TEXT,1.3)); add(rrect(350,28,16,7,1.5,TEXT)); add(rrect(371,29,1.6,5,1,TEXT))

# app bar
ABY=58
add(rrect(16,ABY,74,34,17,PANEL,BORDER,1))
add(f'<path d="M36,{ABY+11} L31,{ABY+17} L36,{ABY+23}" fill="none" stroke="{TEXT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>')
add(text(43,ABY+22,"Geri",13,TEXT,S,500))
add(text(W/2,ABY+22,"SOHBETTE KULLAN",14,TEXT,S,700,anchor="middle",ls=1.4))

# story header
SHY=112
add(text(20,SHY+6,"FINANS · 3 DK",11,TEXT2,S,600,ls=1.6))
add(text(20,SHY+38,"Servet Neden Genellikle",25,TEXT,SER,700))
add(text(20,SHY+68,"Görünmezdir?",25,TEXT,SER,700))

# ===== format grid 2x2 =====
add(text(20,200,"ANLATIM FORMATI",11,TEXT2,S,600,ls=1.6))
cards=[
    ("Vurucu Cümle","Tek çarpıcı cümle",flame,True),
    ("30 Saniye","Kısa özet",clock,False),
    ("Soru","Sohbet açar",chatq,False),
    ("Anahtar Zıtlık","Kilit karşıtlık",key,False),
]
gx0=[16,200]; gy0=[210,278]; cw=174; ch=58
for i,(name,desc,ic,sel) in enumerate(cards):
    x=gx0[i%2]; y=gy0[i//2]
    fill=GOLD_TINT if sel else SURFACE
    stroke=GOLD if sel else BORDER
    sw=1.6 if sel else 1
    add(rrect(x,y,cw,ch,16,fill,stroke,sw))
    icx,icy=x+30,y+ch/2
    if sel:
        add(f'<circle cx="{icx}" cy="{icy}" r="15" fill="{GOLD}"/>'); add(ic(icx,icy,"#FFFFFF"))
    else:
        add(f'<circle cx="{icx}" cy="{icy}" r="15" fill="{GOLD_TINT}"/>'); add(ic(icx,icy,GOLD))
    add(text(x+54,y+27,name,14,TEXT,S,600))
    add(text(x+54,y+43,desc,11.5,TEXT2,S,400))

# ===== preview card =====
PUNCH="Pahalı eşya harcanan parayı gösterir; servet ise çoğu zaman harcanmadan kalan görünmez seçenektir."
nchar=len(PUNCH)
CY=352; CH=196
add('<g filter="url(#sf)">'+rrect(16,CY,358,CH,18,SURFACE,BORDER,1)+'</g>')
add(text(34,CY+30,"VURUCU CÜMLE",11,GOLD,S,700,ls=1.4))
# AI pill
apx,apw=300,58
add(rrect(apx,CY+14,apw,30,15,GOLD_TINT))
sx,sy=apx+16,CY+29
add(f'<path d="M{sx},{sy-6} L{sx+1.3},{sy-1.3} L{sx+6},{sy} L{sx+1.3},{sy+1.3} L{sx},{sy+6} L{sx-1.3},{sy+1.3} L{sx-6},{sy} L{sx-1.3},{sy-1.3} Z" fill="{GOLD}"/>')
add(text(apx+26,CY+33,"AI",12.5,GOLD,S,600))
# quote
lines=["Pahalı eşya harcanan parayı","gösterir; servet ise çoğu zaman","harcanmadan kalan görünmez","seçenektir."]
qy0=CY+66; lh=28
add(rrect(34,qy0-19,3.5,lh*len(lines)-7,2,GOLD))
for i,ln in enumerate(lines):
    add(text(46,qy0+i*lh,ln,18,TEXT,SER,600))
# char count
add(text(34,CY+CH-16,f"{nchar} karakter · X (Twitter) için uygun",11,TEXT2,S,400))

# ===== bottom dock =====
DY=552+24
add(rrect(0,DY,W,H-DY,0,PANEL))
add(f'<line x1="0" y1="{DY}" x2="{W}" y2="{DY}" stroke="{BORDER}" stroke-width="1"/>')
add(text(20,DY+28,"PAYLAŞ",11,TEXT2,S,600,ls=1.6))

pr_y=DY+64; r=22; centers=[52,127,202,277,352]
def cbtn(cx): add(f'<circle cx="{cx}" cy="{pr_y}" r="{r}" fill="{SURFACE}" stroke="{BORDER}" stroke-width="1"/>')
# Instagram FIRST (featured w/ premium star)
cx=centers[0]; cbtn(cx)
add(f'<rect x="{cx-8}" y="{pr_y-8}" width="16" height="16" rx="5" fill="none" stroke="{TEXT}" stroke-width="2"/>')
add(f'<circle cx="{cx}" cy="{pr_y}" r="4" fill="none" stroke="{TEXT}" stroke-width="2"/>')
add(f'<circle cx="{cx+4.5}" cy="{pr_y-4.5}" r="1.3" fill="{TEXT}"/>')
bx,by=cx+15,pr_y-15
add(f'<circle cx="{bx}" cy="{by}" r="8" fill="{GOLD}"/>')
add(f'<path d="M{bx},{by-4} L{bx+1.2},{by-1.2} L{bx+4},{by-1} L{bx+1.6},{by+1} L{bx+2.4},{by+4} L{bx},{by+2} L{bx-2.4},{by+4} L{bx-1.6},{by+1} L{bx-4},{by-1} L{bx-1.2},{by-1.2} Z" fill="#FFFFFF"/>')
# X
cx=centers[1]; cbtn(cx)
add(f'<path d="M{cx-7},{pr_y-7} L{cx+7},{pr_y+7} M{cx+7},{pr_y-7} L{cx-7},{pr_y+7}" stroke="{TEXT}" stroke-width="2.4" stroke-linecap="round"/>')
# Threads
cx=centers[2]; cbtn(cx); add(text(cx,pr_y+7,"@",22,TEXT,S,500,anchor="middle"))
# LinkedIn
cx=centers[3]; cbtn(cx); add(text(cx,pr_y+6,"in",16,"#2F5F9C",S,700,anchor="middle"))
# WhatsApp
cx=centers[4]; cbtn(cx)
add(f'<circle cx="{cx}" cy="{pr_y}" r="11" fill="none" stroke="#1FA855" stroke-width="2.2"/>')
add(f'<path d="M{cx-12},{pr_y+11} L{cx-6},{pr_y+6}" stroke="#1FA855" stroke-width="2.2" stroke-linecap="round"/>')
add(f'<path d="M{cx-4},{pr_y-4} c0,3 1,6 4,8 c1,1 3,1 4,-1 l-2,-2 c-1,1 -2,0 -3,-1 c-1,-1 -2,-2 -1,-3 l-2,-2 c-2,1 -2,3 -1,4" fill="#1FA855"/>')

# PRIMARY: Kopyala (gold)
ky=DY+98; kh=54
add('<g filter="url(#soft)">'+rrect(16,ky,358,kh,16,"url(#g)")+'</g>')
kcx=W/2-50; kcy=ky+kh/2
add(rrect(kcx-6,kcy-3,11,13,2.5,"none","#FFFFFF",2))
add(rrect(kcx-2,kcy-7,11,13,2.5,"url(#g)","#FFFFFF",2))
add(text(W/2+8,ky+34,"Kopyala",17,"#FFFFFF",S,600,anchor="middle"))

# secondary row: Prova | Kullanıldı toggle
sy2=DY+168; bw=171; bh=46
add(rrect(16,sy2,bw,bh,14,SURFACE,BORDER,1))
mcx=16+38; mcy=sy2+bh/2
add(rrect(mcx-4,mcy-10,8,13,4,TEXT))
add(f'<path d="M{mcx-7},{mcy} a7,7 0 0 0 14,0" fill="none" stroke="{TEXT}" stroke-width="1.7"/>')
add(f'<line x1="{mcx}" y1="{mcy+6}" x2="{mcx}" y2="{mcy+10}" stroke="{TEXT}" stroke-width="1.7"/>')
add(f'<line x1="{mcx-4}" y1="{mcy+10}" x2="{mcx+4}" y2="{mcy+10}" stroke="{TEXT}" stroke-width="1.7"/>')
add(text(16+58,sy2+29,"Prova",14,TEXT,S,600))
# Kullanıldı toggle
tx=16+bw+8
add(rrect(tx,sy2,bw,bh,14,SURFACE,BORDER,1))
tcx=tx+38; tcy=sy2+bh/2
add(f'<circle cx="{tcx}" cy="{tcy}" r="9" fill="none" stroke="{TEXT2}" stroke-width="1.7"/>')
add(f'<path d="M{tcx-4},{tcy} L{tcx-1},{tcy+3.5} L{tcx+5},{tcy-3.5}" fill="none" stroke="{TEXT2}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>')
add(text(tx+56,sy2+29,"Kullanıldı",14,TEXT2,S,500))

# home indicator
add(rrect(W/2-67,H-15,134,5,2.5,"#11111133"))

svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'+''.join(el)+'</svg>'
cairosvg.svg2png(bytestring=svg.encode(),write_to="/sessions/serene-admiring-albattani/mnt/outputs/sohbette_kullan_redesign.png",output_width=W*3,output_height=H*3)
print("chars:",nchar,"done")
