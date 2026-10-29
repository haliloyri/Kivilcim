"""Rozet görselleri (25 adet). DESIGN.md dili: yalnızca dolgulu şekil, aile tonunda disk, krem ana glif, altın ödül vurgusu.
Çalıştır: python3 generate_badges.py  ->  badges/<id>.png (360 px). Sonra assets/badges/ altına kopyala.
Chrome headless ile SVG -> PNG (generate.py ile aynı yöntem)."""
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


# Seri başına aile rengi (DESIGN.md 6.1). Altın yalnızca vurgu: rozet = ödül.
FAM = {'read': '#1F5F5B', 'variety': '#1F7FA8', 'master': '#A5623A', 'save': '#4C5B7A', 'share': '#2F7D5B', 'social': '#8650A8'}
GOLD, CREAM = '#E9A94B', '#F5F1E8'

# {C} krem, {G} altın, {T} aile açık tonu, {K} aile koyu tonu
B = {
'first_read': ('read', '<circle cx="48" cy="38" r="10" fill="{G}"/>'
    '<path d="M48 18v-6M33 24l-4-4M63 24l4-4M26 38h-6M70 38h6" stroke="{G}" stroke-width="4" stroke-linecap="round" fill="none"/>'
    '<path d="M20 52c10-5 20-4 28 2 8-6 18-7 28-2v20c-10-5-20-4-28 2-8-6-18-7-28-2z" fill="{C}"/><rect x="46.5" y="54" width="3" height="20" fill="{T}"/>'),
'explorer': ('read', '<circle cx="48" cy="48" r="26" fill="{C}"/><circle cx="48" cy="48" r="19" fill="{K}"/><g transform="rotate(45 48 48)"><polygon points="48,26 57,48 39,48" fill="{G}"/><polygon points="48,70 57,48 39,48" fill="{C}"/></g><circle cx="48" cy="48" r="3.5" fill="{K}"/>'),
'sage': ('read', '<rect x="28" y="24" width="40" height="48" rx="5" fill="{C}"/><rect x="22" y="18" width="52" height="12" rx="6" fill="{G}"/><rect x="22" y="66" width="52" height="12" rx="6" fill="{G}"/><rect x="35" y="38" width="26" height="4" rx="2" fill="{T}"/><rect x="35" y="47" width="26" height="4" rx="2" fill="{T}"/><rect x="35" y="56" width="16" height="4" rx="2" fill="{T}"/>'),
'bookworm': ('read', '<rect x="22" y="56" width="52" height="16" rx="4" fill="{C}"/><rect x="28" y="40" width="42" height="14" rx="4" fill="{T}"/><rect x="24" y="25" width="46" height="13" rx="4" fill="{G}"/><rect x="30" y="61" width="26" height="4" rx="2" fill="{K}"/><rect x="36" y="44" width="16" height="4" rx="2" fill="{K}"/>'),
'streak_7': ('read', '<path d="M48 16c4 12 18 19 18 37a18 18 0 0 1-36 0c0-8 3-13 8-17 0 7 4 11 7 11 0-10-3-18 3-31z" fill="{G}"/><path d="M48 46c7 6 9 10 9 16a9 9 0 0 1-18 0c0-5 3-9 9-16z" fill="{C}"/><text x="48" y="68" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="14" fill="{K}">7</text>'),
'philosopher': ('read', '<polygon points="48,18 76,34 20,34" fill="{G}"/><rect x="22" y="36" width="52" height="5" rx="2" fill="{C}"/><rect x="27" y="44" width="10" height="24" rx="2" fill="{C}"/><rect x="43" y="44" width="10" height="24" rx="2" fill="{C}"/><rect x="59" y="44" width="10" height="24" rx="2" fill="{C}"/><rect x="20" y="70" width="56" height="8" rx="3" fill="{T}"/>'),
'cat_variety_3': ('variety', '<path d="M20 32l17-7v44l-17 7z" fill="{C}"/><path d="M37 25l22 7v44l-22-7z" fill="{T}"/><path d="M59 32l17-7v44l-17 7z" fill="{C}"/><circle cx="48" cy="42" r="9" fill="{G}"/><circle cx="48" cy="42" r="3.5" fill="{K}"/>'),
'cat_variety_5': ('variety', '<circle cx="48" cy="48" r="25" fill="{C}"/><path d="M33 33c8-4 14 1 12 9-6 3-13 1-12-9zM52 47c8-3 15 2 12 11-7 5-14 1-12-11z" fill="{T}"/><ellipse cx="48" cy="48" rx="36" ry="11" fill="none" stroke="{G}" stroke-width="5" transform="rotate(-22 48 48)"/>'),
'cat_variety_10': ('variety', '<circle cx="48" cy="52" r="24" fill="{C}"/><ellipse cx="48" cy="52" rx="10" ry="24" fill="none" stroke="{T}" stroke-width="4"/><rect x="24" y="50" width="48" height="4" fill="{T}"/><polygon points="{S}" fill="{G}"/>'.replace('{S}', star(68, 26, 15, 6, 4, -90))),
'cat_master_5': ('master', '<circle cx="48" cy="48" r="28" fill="{C}"/><circle cx="48" cy="48" r="20" fill="{K}"/><circle cx="48" cy="48" r="12" fill="{C}"/><circle cx="48" cy="48" r="5.5" fill="{G}"/>'),
'cat_master_10': ('master', '<polygon points="30,14 44,14 52,44 40,44" fill="{T}"/><polygon points="66,14 52,14 44,44 56,44" fill="{C}"/><circle cx="48" cy="58" r="20" fill="{G}"/><circle cx="48" cy="58" r="14" fill="none" stroke="{K}" stroke-width="3" opacity=".45"/><polygon points="{S}" fill="{K}"/>'.replace('{S}', star(48, 58, 10, 4.2))),
'cat_master_25': ('master', '<path d="M22 66L19 32l16 14 13-20 13 20 16-14-3 34z" fill="{G}"/><rect x="22" y="68" width="52" height="9" rx="3.5" fill="{C}"/><circle cx="19" cy="31" r="4.5" fill="{C}"/><circle cx="48" cy="25" r="4.5" fill="{C}"/><circle cx="77" cy="31" r="4.5" fill="{C}"/>'),
'cat_master_50': ('master', '<polygon points="33,30 63,30 76,45 48,76 20,45" fill="{C}"/><polygon points="33,30 48,45 20,45" fill="{T}"/><polygon points="63,30 76,45 48,45" fill="{T}"/><polygon points="48,45 76,45 48,76" fill="{G}" opacity=".9"/><polygon points="{S}" fill="{G}"/>'.replace('{S}', star(70, 22, 10, 4, 4))),
'cat_master_100': ('master', '<polygon points="{S}" fill="{G}"/><rect x="14" y="62" width="30" height="7" rx="3.5" fill="{C}" transform="rotate(-38 14 62)"/><rect x="20" y="72" width="22" height="6" rx="3" fill="{T}" transform="rotate(-38 20 72)"/><rect x="30" y="52" width="20" height="6" rx="3" fill="{T}" transform="rotate(-38 30 52)"/>'.replace('{S}', star(58, 40, 24, 10))),
'save_5': ('save', '<path d="M32 20h32a3 3 0 0 1 3 3v52L48 62 29 75V23a3 3 0 0 1 3-3z" fill="{C}"/><polygon points="{S}" fill="{G}"/>'.replace('{S}', star(48, 40, 10, 4.2))),
'save_10': ('save', '<path d="M26 24h26a3 3 0 0 1 3 3v46L39 62 23 73V27a3 3 0 0 1 3-3z" fill="{T}"/><path d="M44 18h26a3 3 0 0 1 3 3v52L57 60 41 71V21a3 3 0 0 1 3-3z" fill="{C}"/><rect x="48" y="30" width="18" height="4" rx="2" fill="{G}"/><rect x="48" y="38" width="12" height="4" rx="2" fill="{G}"/>'),
'save_50': ('save', '<rect x="22" y="22" width="46" height="46" rx="8" fill="{T}"/><rect x="28" y="28" width="46" height="46" rx="8" fill="{C}"/><rect x="34" y="34" width="46" height="46" rx="8" fill="{G}"/><circle cx="50" cy="53" r="7" fill="{K}"/><rect x="42" y="64" width="30" height="5" rx="2.5" fill="{K}"/>'.replace('<circle cx="50" cy="53" r="7" fill="{K}"/>', '<circle cx="48" cy="50" r="6" fill="{C}"/>')),
'save_100': ('save', '<rect x="22" y="22" width="52" height="18" rx="5" fill="{G}"/><rect x="26" y="38" width="44" height="38" rx="6" fill="{C}"/><rect x="38" y="48" width="20" height="6" rx="3" fill="{K}"/><rect x="38" y="60" width="20" height="4" rx="2" fill="{T}"/>'),
'share_1': ('share', '<polygon points="20,46 76,22 46,54" fill="{G}"/><polygon points="46,54 76,22 56,74" fill="{C}"/><polygon points="46,54 50,70 56,74" fill="{T}"/>'),
'share_10': ('share', '<path d="M22 40h14l24-14v44L36 56H22a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4z" fill="{C}"/><rect x="28" y="54" width="10" height="18" rx="4" fill="{T}"/><path d="M68 38a14 14 0 0 1 0 20M75 30a24 24 0 0 1 0 36" fill="none" stroke="{G}" stroke-width="5" stroke-linecap="round"/>'),
'share_20': ('share', '<rect x="16" y="35" width="38" height="26" rx="13" fill="none" stroke="{C}" stroke-width="8" transform="rotate(-35 35 48)"/><rect x="42" y="35" width="38" height="26" rx="13" fill="none" stroke="{G}" stroke-width="8" transform="rotate(-35 61 48)"/>'.replace('transform="rotate(-35 35 48)"', 'transform="rotate(-35 35 53)"').replace('transform="rotate(-35 61 48)"', 'transform="rotate(-35 61 43)"')),
'share_30': ('share', '<polygon points="48,40 60,76 36,76" fill="{C}"/><circle cx="48" cy="34" r="7" fill="{G}"/><path d="M34 22a20 20 0 0 0 0 24M62 22a20 20 0 0 1 0 24M24 14a32 32 0 0 0 0 40M72 14a32 32 0 0 1 0 40" fill="none" stroke="{T}" stroke-width="4.5" stroke-linecap="round" transform="translate(0 4)"/>'),
'share_50': ('share', '<polygon points="{S}" fill="{G}"/><polygon points="{I}" fill="{C}"/><circle cx="22" cy="24" r="4" fill="{C}"/><circle cx="76" cy="26" r="3" fill="{T}"/><circle cx="74" cy="72" r="4" fill="{C}"/>'.replace('{S}', star(48, 50, 32, 14)).replace('{I}', star(48, 50, 14, 6))),
'icebreaker': ('social', '<path d="M18 24h34a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H34L22 70V60h-4a8 8 0 0 1-8-8V32a8 8 0 0 1 8-8z" fill="{C}" transform="translate(4 -2)"/><path d="M46 44h28a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-2v10L58 76H46a8 8 0 0 1-8-8V52a8 8 0 0 1 8-8z" fill="{G}" transform="translate(-2 -4)"/><circle cx="22" cy="40" r="3.2" fill="{K}"/><circle cx="32" cy="40" r="3.2" fill="{K}"/><circle cx="42" cy="40" r="3.2" fill="{K}"/>'),
'storyteller': ('social', '<rect x="38" y="16" width="20" height="36" rx="10" fill="{C}"/><rect x="42" y="26" width="12" height="3.5" rx="1.7" fill="{T}"/><rect x="42" y="34" width="12" height="3.5" rx="1.7" fill="{T}"/><path d="M28 46a20 20 0 0 0 40 0" fill="none" stroke="{G}" stroke-width="5.5" stroke-linecap="round"/><rect x="45" y="66" width="6" height="10" rx="3" fill="{G}"/><rect x="34" y="75" width="28" height="6" rx="3" fill="{C}"/>'),
}


def svg(fam, body):
    base = FAM[fam]
    disc = mix(base, '#000000', .28); top = mix(base, '#FFFFFF', .12)
    pal = dict(C=CREAM, G=GOLD, T=mix(base, '#FFFFFF', .62), K=mix(base, '#000000', .55))
    for k, v in pal.items():
        body = body.replace('{%s}' % k, v)
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 96 96">'
            '<defs><radialGradient id="g" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="{t}"/><stop offset="1" stop-color="{d}"/></radialGradient></defs>'
            '<circle cx="48" cy="48" r="48" fill="url(#g)"/><circle cx="48" cy="48" r="45" fill="none" stroke="{g}" stroke-width="1.6" opacity=".7"/>'
            '{b}</svg>').format(t=top, d=disc, g=GOLD, b=body)


out = 'badges'; os.makedirs(out, exist_ok=True)
items = {n: svg(f, b) for n, (f, b) in B.items()}
js = '''const items=%s;const load=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)});
(async()=>{const res={};for(const n in items){const c=document.createElement('canvas');c.width=c.height=360;c.getContext('2d').drawImage(await load(items[n]),0,0);res[n]=c.toDataURL('image/png')}
document.getElementById('o').textContent=JSON.stringify(res);})();''' % json.dumps(items)
open(out + '/_m.html', 'w').write('<html><body><textarea id="o"></textarea><script>' + js + '</script></body></html>')
dom = subprocess.run([CHROME, '--headless', '--disable-gpu', '--virtual-time-budget=30000', '--dump-dom', 'file://' + os.path.abspath(out + '/_m.html')], capture_output=True, text=True).stdout
res = json.loads(html.unescape(re.search(r'<textarea id="o">(.*?)</textarea>', dom, re.S).group(1)))
for n, d in res.items():
    open('%s/%s.png' % (out, n), 'wb').write(base64.b64decode(d.split(',')[1]))
    open('%s/%s.svg' % (out, n), 'w').write(items[n])
os.remove(out + '/_m.html')
print(len(res), 'badges')
