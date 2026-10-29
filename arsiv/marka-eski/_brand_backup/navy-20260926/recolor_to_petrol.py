# Recolours the navy Albor mark to Deep Petrol, keeping the gold sun/glow.
import sys, colorsys
import numpy as np
from PIL import Image
T = 177 / 360.0
def hsvmap(rgb):
    H, S, V = colorsys.rgb_to_hsv(*(c / 255 for c in rgb))
    R, G, B = colorsys.hsv_to_rgb(T, S * 0.98, V * 0.97)
    return np.array([R * 255, G * 255, B * 255])
def recolor(src, dst):
    im = Image.open(src); fmt = im.format
    a = np.array(im.convert('RGBA')).astype(float)
    rgb = a[..., :3]; out = rgb.copy()
    N = np.array([29, 47, 76.]); G = np.array([247, 178, 79.]); P = hsvmap(N)
    d = G - N; t = np.clip(((rgb - N) @ d) / (d @ d), 0, 1)
    resid = np.linalg.norm(rgb - (N + t[..., None] * d), axis=-1)
    mix = (resid < 38) & (t < 0.97)
    out[mix] = rgb[mix] + ((1 - t[mix])[:, None]) * (P - N)
    flat = rgb.reshape(-1, 3); o = out.reshape(-1, 3); m = mix.reshape(-1); al = a[..., 3].reshape(-1)
    for i in np.where((~m) & (al > 0))[0]:
        r, g, b = flat[i] / 255
        H, S, V = colorsys.rgb_to_hsv(r, g, b)
        if S >= 0.08 and 0.53 < H < 0.80:
            R, Gc, B = colorsys.hsv_to_rgb(T, S * 0.98, V * 0.97); o[i] = (R * 255, Gc * 255, B * 255)
    a[..., :3] = np.clip(out, 0, 255)
    res = Image.fromarray(a.astype('uint8'), 'RGBA')
    if dst.lower().endswith('.webp'): res.save(dst, 'WEBP', lossless=True)
    else: res.save(dst, optimize=True)
if __name__ == '__main__':
    for f in sys.argv[1:]: recolor(f, f); print('recoloured', f)
