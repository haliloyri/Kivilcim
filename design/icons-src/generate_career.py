"""Albor Yolu görselleri: 4 yol hero'su (1080x720) + 12 unvan amblemi (360).
DESIGN.md dili: petrol marka, altın güneş imzası, yalnızca dolgulu şekil. Yol vurgusu = kategori ailesi (DESIGN.md 6.1).
Çalıştır: python3 generate_career.py -> career/hero-<yol>.png, career/nodes/<visualKey>.png
Sonra assets/career/ altına kopyala. Chrome headless ile SVG -> PNG."""
import os, json, subprocess, re, html, base64, math
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'


def mix(a, b, t):
    a = a.lstrip('#'); b = b.lstrip('#')
    return '#%02X%02X%02X' % tuple(round(int(a[i:i+2], 16) * (1 - t) + int(b[i:i+2], 16) * t) for i in (0, 2, 4))


def star(cx, cy, R, r, n=5, rot=-90):
    pts = []
    for i in range(n * 2):
        a = math.radians(rot + i * 180 / n)
        rad = R if i % 2 == 0 else r
        pts.append('%.1f,%.1f' % (cx + rad * math.cos(a), cy + rad * math.sin(a)))
    return ' '.join(pts)


GOLD, CREAM = '#E9A94B', '#F5F1E8'
# yol -> (aile açık, aile koyu). common = marka petrolü.
PATH = {'common': '#1F5F5B', 'exploration': '#1F7FA8', 'depth': '#5B5FB5', 'transfer': '#A5623A'}
HERO_BASE = {'common': '#1B4B48'}


def hero_base(p):
    if p == 'depth':  # çivit, marka petroline yaklaştırılır: mor-mavi "tech" hissi yok
        return mix(mix(PATH[p], '#1B4B48', .5), '#0F1E1D', .45)
    return HERO_BASE.get(p) or mix(PATH[p], '#10201F', .62)


def rays(cx, cy, r1, r2, n, w=7, op=.8, start=0):
    out = ''
    for i in range(n):
        a = math.radians(start + i * 360 / n)
        out += '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#F3C877" stroke-width="%d" stroke-linecap="round" opacity="%s"/>' % (
            cx + r1 * math.cos(a), cy + r1 * math.sin(a), cx + r2 * math.cos(a), cy + r2 * math.sin(a), w, op)
    return out


def sun(cx, cy, r):
    return ''.join('<circle cx="%d" cy="%d" r="%d" fill="%s" opacity="%s"/>' % (cx, cy, rr, GOLD, o) for rr, o in ((r * 2.1, .08), (r * 1.55, .14), (r, .95)))


def hero(p):
    base = hero_base(p); fam = PATH[p]
    L1, L2, L3 = mix(base, '#FFFFFF', .07), mix(base, '#FFFFFF', .13), mix(fam, '#FFFFFF', .22)
    s = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="720" viewBox="0 0 1080 720"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient></defs><rect width="1080" height="720" fill="url(#b)"/>' % (mix(base, '#FFFFFF', .04), mix(base, '#000000', .18))
    if p == 'common':  # gün doğumu: güneş + katmanlı tepeler
        s += sun(850, 190, 96) + rays(850, 190, 130, 160, 9, 7, .8, 200)
        s += '<path d="M0 560C180 500 330 520 480 560S800 600 1080 520V720H0z" fill="%s"/><path d="M0 610C220 560 420 600 620 630S920 650 1080 600V720H0z" fill="%s"/><path d="M0 670C260 640 520 680 760 676S1000 660 1080 650V720H0z" fill="%s"/>' % (L1, L2, mix(base, '#000000', .15))
        s += ''.join('<circle cx="%d" cy="%d" r="%d" fill="#F5F1E8" opacity=".5"/>' % c for c in ((120, 90, 4), (260, 150, 3), (420, 70, 4), (560, 130, 3), (660, 60, 3)))
    elif p == 'exploration':  # ufka giden patika
        s += sun(870, 200, 76) + rays(870, 200, 110, 138, 7, 6, .8, 190)
        s += '<path d="M0 470C140 400 300 430 460 460S700 440 1080 420V720H0z" fill="%s"/><path d="M0 540C200 480 380 520 560 510S860 470 1080 500V720H0z" fill="%s"/>' % (L1, L2)
        s += '<path d="M180 720C330 640 470 650 560 600S760 520 790 470L812 472C800 540 640 610 600 650S420 740 330 720z" fill="%s"/>' % L3
        s += ''.join('<circle cx="%d" cy="%d" r="%d" fill="#F5F1E8" opacity=".5"/>' % c for c in ((130, 100, 4), (300, 160, 3), (470, 80, 4), (640, 150, 3), (980, 90, 4), (920, 220, 3)))
    elif p == 'depth':  # katmanlar: içe doğru halkalar, merkezde ışık
        cx, cy = 840, 470
        for i, rr in enumerate(range(620, 60, -100)):
            s += '<circle cx="%d" cy="%d" r="%d" fill="%s" opacity=".7"/>' % (cx, cy, rr, mix(base, fam, .12 + i * .06))
        s += sun(cx, cy, 44)
        s += ''.join('<circle cx="%d" cy="%d" r="%d" fill="#F5F1E8" opacity=".45"/>' % c for c in ((110, 110, 4), (300, 70, 3), (520, 120, 4), (200, 240, 3)))
    else:  # aktarım: ışık merkezden yayılır, düğümler bağlanır
        cx, cy = 900, 190
        s += sun(cx, cy, 80) + rays(cx, cy, 120, 160, 14, 6, .75, 0)
        nodes = [(560, 520), (700, 590), (860, 540), (980, 600), (1010, 430), (480, 380)]
        lines = [(0, 1), (1, 2), (2, 3), (2, 4), (0, 5), (1, 3)]
        for a, b in lines:
            s += '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="6" stroke-linecap="round" opacity=".6"/>' % (nodes[a] + nodes[b] + (L3,))
        for i, (x, y) in enumerate(nodes):
            s += '<circle cx="%d" cy="%d" r="%d" fill="%s"/>' % (x, y, 22 if i % 2 == 0 else 16, L3 if i % 2 == 0 else CREAM)
        s += ''.join('<circle cx="%d" cy="%d" r="%d" fill="#F5F1E8" opacity=".45"/>' % c for c in ((110, 110, 4), (300, 70, 3), (420, 200, 3)))
    return s + '</svg>'


# {C} krem, {G} altın, {T} yol açık tonu, {K} yol koyu tonu
N = {
'first_light': ('common', '<polygon points="%s" fill="{G}"/><polygon points="%s" fill="{C}"/><polygon points="%s" fill="{T}"/>' % (star(46, 50, 28, 7, 4), star(72, 24, 10, 4, 4), star(24, 74, 8, 3.2, 4))),
'curious': ('common', '<g transform="rotate(-28 48 46)"><rect x="18" y="38" width="46" height="16" rx="4" fill="{C}"/><rect x="58" y="33" width="16" height="26" rx="4" fill="{G}"/><rect x="10" y="42" width="10" height="8" rx="2" fill="{T}"/></g><polygon points="44,52 34,80 41,80 50,60" fill="{C}"/><polygon points="52,52 62,80 55,80 48,60" fill="{C}"/>'),
'traveler': ('common', '<rect x="44" y="18" width="8" height="62" rx="3" fill="{C}"/><polygon points="52,24 76,24 84,33 76,42 52,42" fill="{G}"/><polygon points="44,46 20,46 12,55 20,64 44,64" fill="{T}"/><rect x="34" y="76" width="28" height="6" rx="3" fill="{C}"/>'),
'route_seeker': ('exploration', '<circle cx="48" cy="48" r="26" fill="{C}"/><circle cx="48" cy="48" r="19" fill="{K}"/><g transform="rotate(45 48 48)"><polygon points="48,26 57,48 39,48" fill="{G}"/><polygon points="48,70 57,48 39,48" fill="{C}"/></g><circle cx="48" cy="48" r="3.5" fill="{K}"/>'),
'horizon_traveler': ('exploration', '<path d="M22 58a26 26 0 0 1 52 0z" fill="{G}"/><path d="M48 20v-6M26 28l-4-4M70 28l4-4M16 44h-6M80 44h6" stroke="{G}" stroke-width="4" stroke-linecap="round" fill="none"/><rect x="12" y="60" width="72" height="6" rx="3" fill="{C}"/><rect x="26" y="70" width="44" height="5" rx="2.5" fill="{T}"/><rect x="36" y="79" width="24" height="4" rx="2" fill="{T}" opacity=".7"/>'),
'wisdom_cartographer': ('exploration', '<path d="M20 32l17-7v44l-17 7z" fill="{C}"/><path d="M37 25l22 7v44l-22-7z" fill="{T}"/><path d="M59 32l17-7v44l-17 7z" fill="{C}"/><circle cx="48" cy="42" r="9" fill="{G}"/><circle cx="48" cy="42" r="3.5" fill="{K}"/>'),
'thinker': ('depth', '<path d="M48 16a21 21 0 0 0-13 37c3 3 4 6 4 10h18c0-4 1-7 4-10a21 21 0 0 0-13-37z" fill="{C}"/><rect x="39" y="66" width="18" height="6" rx="3" fill="{G}"/><rect x="42" y="75" width="12" height="6" rx="3" fill="{G}"/><path d="M41 40l7 9 7-9" stroke="{G}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'),
'synthesizer': ('depth', '<circle cx="36" cy="48" r="22" fill="{C}"/><circle cx="60" cy="48" r="22" fill="{G}"/><path d="M48 29a22 22 0 0 1 0 38a22 22 0 0 1 0-38z" fill="{K}"/>'),
'insight_curator': ('depth', '<rect x="20" y="30" width="11" height="38" rx="3" fill="{C}"/><rect x="33" y="24" width="11" height="44" rx="3" fill="{T}"/><rect x="46" y="32" width="11" height="36" rx="3" fill="{C}"/><rect x="60" y="28" width="11" height="40" rx="3" fill="{G}" transform="rotate(12 65 48)"/><rect x="14" y="68" width="68" height="8" rx="4" fill="{G}"/>'),
'storyteller': ('transfer', '<rect x="38" y="16" width="20" height="36" rx="10" fill="{C}"/><rect x="42" y="26" width="12" height="3.5" rx="1.7" fill="{T}"/><rect x="42" y="34" width="12" height="3.5" rx="1.7" fill="{T}"/><path d="M28 46a20 20 0 0 0 40 0" fill="none" stroke="{G}" stroke-width="5.5" stroke-linecap="round"/><rect x="45" y="66" width="6" height="10" rx="3" fill="{G}"/><rect x="34" y="75" width="28" height="6" rx="3" fill="{C}"/>'),
'connector': ('transfer', '<circle cx="33" cy="34" r="10" fill="{C}"/><circle cx="63" cy="34" r="10" fill="{G}"/><path d="M15 72c0-14 8-22 18-22s18 8 18 22z" fill="{C}"/><path d="M45 72c0-14 8-22 18-22s18 8 18 22z" fill="{G}"/>'),
'light_carrier': ('transfer', '<path d="M48 12c4 9 14 14 14 27a14 14 0 0 1-28 0c0-7 3-11 7-14 0 6 3 8 5 8 0-8-3-14 2-21z" fill="{G}"/><path d="M48 38c4 4 6 6 6 10a6 6 0 0 1-12 0c0-4 2-6 6-10z" fill="{C}"/><polygon points="36,56 60,56 55,66 41,66" fill="{T}"/><rect x="44" y="64" width="8" height="18" rx="3" fill="{C}"/>'),
}


def node(p, body):
    base = PATH[p]
    disc = mix(base, '#000000', .28); top = mix(base, '#FFFFFF', .12)
    pal = dict(C=CREAM, G=GOLD, T=mix(base, '#FFFFFF', .62), K=mix(base, '#000000', .55))
    for k, v in pal.items():
        body = body.replace('{%s}' % k, v)
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 96 96">'
            '<defs><radialGradient id="g" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="{t}"/><stop offset="1" stop-color="{d}"/></radialGradient></defs>'
            '<circle cx="48" cy="48" r="48" fill="url(#g)"/><circle cx="48" cy="48" r="45" fill="none" stroke="{g}" stroke-width="1.6" opacity=".7"/>'
            '{b}</svg>').format(t=top, d=disc, g=GOLD, b=body)



# ── Ek görseller: koyu hero, zirve hero, başlangıç hero, kilitli amblem, paylaşım zemini ──
def with_gold(g, fn, *a):
    global GOLD
    old = GOLD; GOLD = g
    try: return fn(*a)
    finally: GOLD = old


def hero_dark(p):
    # Aynı sahne, daha koyu zemin ve koyu temanın altını (#F0C170).
    svg = with_gold('#F0C170', hero, p)
    return svg.replace('</svg>', '<rect width="1080" height="720" fill="#000" opacity=".28"/></svg>')


def sparkles(pts, col):
    return ''.join('<polygon points="%s" fill="%s" opacity="%s"/>' % (star(x, y, r, r * .36, 4), col, o) for x, y, r, o in pts)


def hero_summit(p):
    base = hero_base(p); fam = PATH[p]
    M1, M2, M3 = mix(base, '#FFFFFF', .10), mix(base, '#FFFFFF', .18), mix(fam, '#FFFFFF', .30)
    s = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="720" viewBox="0 0 1080 720"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient></defs><rect width="1080" height="720" fill="url(#b)"/>' % (mix(base, '#FFFFFF', .05), mix(base, '#000000', .2))
    s += '<g transform="translate(-70 0)">' + sun(900, 130, 70) + rays(900, 130, 98, 124, 12, 6, .8, 0)
    s += '<polygon points="380,720 600,470 700,540 880,340 1000,470 1100,420 1100,720" fill="%s"/>' % M1
    s += '<polygon points="480,720 640,560 760,640 880,330 1010,560 1100,520 1100,720" fill="%s"/>' % M2
    s += '<polygon points="640,720 780,640 880,330 980,700 1100,720" fill="%s" opacity=".6"/>' % M3
    s += '<polygon points="-20,720 -20,640 160,610 360,660 560,640 700,690 760,720" fill="%s" opacity=".5"/>' % mix(base, '#000000', .2)
    s += '<rect x="876" y="250" width="8" height="84" rx="4" fill="%s"/><polygon points="884,252 954,274 884,298" fill="%s"/>' % (CREAM, GOLD)
    s += '</g>'
    s += sparkles([(80, 90, 14, .9), (300, 60, 10, .7), (560, 110, 12, .8), (700, 220, 9, .6), (1020, 300, 12, .8)], '#F5F1E8')
    return s + '</svg>'


def hero_start():
    base = '#1B4B48'
    s = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="720" viewBox="0 0 1080 720"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%s"/><stop offset=".7" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient></defs><rect width="1080" height="720" fill="url(#b)"/>' % (mix(base, '#000000', .35), base, mix(base, GOLD, .25))
    # ufukta yeni doğan güneş (yarım)
    s += '<g><circle cx="820" cy="560" r="230" fill="%s" opacity=".08"/><circle cx="820" cy="560" r="160" fill="%s" opacity=".14"/><circle cx="820" cy="560" r="90" fill="%s" opacity=".95"/></g>' % (GOLD, GOLD, GOLD)
    s += '<path d="M0 560C200 540 420 580 640 560S960 540 1080 556V720H0z" fill="%s"/><path d="M0 620C260 600 520 650 780 630S1000 610 1080 620V720H0z" fill="%s"/>' % (mix(base, '#000000', .25), mix(base, '#000000', .4))
    s += ''.join('<circle cx="%d" cy="%d" r="%d" fill="#F5F1E8" opacity=".55"/>' % c for c in ((120, 90, 4), (270, 170, 3), (430, 70, 4), (560, 140, 3), (700, 80, 3), (950, 120, 4), (60, 240, 3)))
    return s + '</svg>'


def node_locked(body):
    # Nötr yüzey: DESIGN.md surfaceContainerHigh tonu, glif krem, sağ altta kilit.
    pal = dict(C='#F7F3EC', G='#EFE8DC', T='#E7DFD2', K='#B9B0A4')
    for k, v in pal.items():
        body = body.replace('{%s}' % k, v)
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 96 96">'
            '<defs><radialGradient id="g" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#D9D2C6"/><stop offset="1" stop-color="#BDB4A6"/></radialGradient></defs>'
            '<circle cx="48" cy="48" r="48" fill="url(#g)"/><circle cx="48" cy="48" r="45" fill="none" stroke="#8C837A" stroke-width="1.4" opacity=".45" stroke-dasharray="3 3"/>'
            '{b}<circle cx="74" cy="74" r="14" fill="#6B625A"/><rect x="67.5" y="73" width="13" height="10" rx="2.5" fill="#F7F3EC"/><path d="M70 73v-3.2a4 4 0 0 1 8 0V73" fill="none" stroke="#F7F3EC" stroke-width="2.4" stroke-linecap="round"/></svg>').format(b=body)


def share_bg(p):
    # 1080x1350 paylaşım kartı zemini: yol tonunda kâğıt, yumuşak güneş ve tepeler (metin üstüne gelir, düşük kontrast).
    fam = PATH[p]; tint = {'common': '#EEEBE0', 'exploration': '#E9F2F6', 'depth': '#EFEFF8', 'transfer': '#F6EFEB'}[p]
    s = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="%s"/>' % tint
    s += ''.join('<circle cx="900" cy="230" r="%d" fill="%s" opacity="%s"/>' % (r, '#E9A94B', o) for r, o in ((330, .10), (230, .16), (140, .85)))
    s += '<path d="M0 1010C220 940 420 990 640 1030S940 1000 1080 960V1350H0z" fill="%s" opacity=".16"/><path d="M0 1130C260 1070 520 1130 780 1140S1000 1110 1080 1100V1350H0z" fill="%s" opacity=".26"/><path d="M0 1240C240 1200 560 1250 820 1240S1000 1230 1080 1226V1350H0z" fill="%s" opacity=".4"/>' % (fam, fam, fam)
    return s + '</svg>'

items = {}
for p in PATH:
    items['hero-' + p] = (hero(p), 1080, 720)
for k, (p, b) in N.items():
    items['nodes/' + k] = (node(p, b), 360, 360)
for p in PATH:
    items['hero-%s-dark' % p] = (hero_dark(p), 1080, 720)
    items['hero-%s-summit' % p] = (hero_summit(p), 1080, 720)
    items['share-' + p] = (share_bg(p), 1080, 1350)
items['hero-start'] = (hero_start(), 1080, 720)
for k, (p, b) in N.items():
    items['nodes/%s-locked' % k] = (node_locked(b), 360, 360)

out = 'career'; os.makedirs(out + '/nodes', exist_ok=True)
js = '''const items=%s;const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)});
(async()=>{const res={};for(const n in items){const [s,w,h]=items[n];const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(await load(s),0,0);res[n]=c.toDataURL('image/png')}
document.getElementById('o').textContent=JSON.stringify(res);})();''' % json.dumps(items)
open(out + '/_m.html', 'w').write('<html><body><textarea id="o"></textarea><script>' + js + '</script></body></html>')
dom = subprocess.run([CHROME, '--headless', '--disable-gpu', '--virtual-time-budget=60000', '--dump-dom', 'file://' + os.path.abspath(out + '/_m.html')], capture_output=True, text=True).stdout
res = json.loads(html.unescape(re.search(r'<textarea id="o">(.*?)</textarea>', dom, re.S).group(1)))
for n, d in res.items():
    open('%s/%s.png' % (out, n), 'wb').write(base64.b64decode(d.split(',')[1]))
    open('%s/%s.svg' % (out, n), 'w').write(items[n][0])
os.remove(out + '/_m.html')
print(len(res), 'images')
