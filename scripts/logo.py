# Redessine le logo Mor & Cinnamon (מור וקינמון | קייטרינג והפקה) en tracés SVG,
# d'après assets/raw/mor-cinnamon_logo.jpg (repère de 1019 × 1019 px) :
# trois feuilles au trait (nervures, hachures, nervure seule), le nom en hébreu gras,
# un filet fin, puis « קייטרינג והפקה » en maigre. Aucune police n'est nécessaire à l'affichage.
#
#   pip install fonttools
#   python scripts/logo.py <dossier des polices>
#     Heebo[wght].ttf (Google Fonts, licence OFL), la plus proche du lettrage d'origine
#
# Écrit data/logo.json (tracés utilisés par components/Logo.tsx et l'ouverture),
# public/logo.svg (médaillon prune), public/logo-dark.svg, public/logo-light.svg,
# public/leaves.svg et app/icon.svg (favicon : les trois feuilles sur médaillon prune).
import json
import os
import sys

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FONTS = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLUM = "#6E5157"
CREAM = "#FAF6F0"

# ——— Feuilles ———
# Repère local : pointe en (0, 0), hauteur 176, demi-largeur 60, plus large aux deux tiers.
H, W = 176.0, 60.0
SEGMENTS = [  # moitié droite, de la pointe au bas
    ((0, 0), (18, 30), (W, 78), (W, 120)),
    ((W, 120), (W, 152), (33, H), (0, H)),
]
SLOPE = 0.47  # les nervures montent du milieu vers le bord


def bezier(p0, p1, p2, p3, t):
    u = 1 - t
    return (
        u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
        u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1],
    )


EDGE = [bezier(*seg, i / 200) for seg in SEGMENTS for i in range(201)]


def edge_hit(ym, side):
    """Point où la nervure partie de (0, ym) rencontre le bord (side = 1 à droite, -1 à gauche)."""
    best = None
    for (x1, y1), (x2, y2) in zip(EDGE, EDGE[1:]):
        # droite de la nervure : y = ym - SLOPE * x ; segment du bord paramétré par s
        f1 = y1 - (ym - SLOPE * x1)
        f2 = y2 - (ym - SLOPE * x2)
        if f1 == 0 or f1 * f2 < 0:
            s = f1 / (f1 - f2) if f1 != f2 else 0
            best = (x1 + s * (x2 - x1), y1 + s * (y2 - y1))
            break
    x, y = best
    return (side * x, y)


def fmt(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def outline(cx, top):
    d = f"M{fmt(cx)} {fmt(top)}"
    for seg in SEGMENTS:
        (_, c1, c2, p) = seg
        d += f"C{fmt(cx + c1[0])} {fmt(top + c1[1])} {fmt(cx + c2[0])} {fmt(top + c2[1])} {fmt(cx + p[0])} {fmt(top + p[1])}"
    for seg in reversed(SEGMENTS):
        (p0, c1, c2, _) = seg
        d += f"C{fmt(cx - c2[0])} {fmt(top + c2[1])} {fmt(cx - c1[0])} {fmt(top + c1[1])} {fmt(cx - p0[0])} {fmt(top + p0[1])}"
    return d + "Z"


def vein(cx, top, ym, side):
    x, y = edge_hit(ym, side)
    return f"M{fmt(cx)} {fmt(top + ym)}L{fmt(cx + x)} {fmt(top + y)}"


def leaf(cx, top, kind):
    veins = [f"M{fmt(cx)} {fmt(top + 3)}V{fmt(top + H)}"]  # nervure centrale
    if kind in ("hatched", "veined"):
        for ym in (28, 74, 119, 163):
            veins.append(vein(cx, top, ym, -1))
        if kind == "veined":
            for ym in (28, 74, 119, 163):
                veins.append(vein(cx, top, ym, 1))
        else:
            veins.append(vein(cx, top, 28, 1))
            ym = 64.0
            while ym <= 172:
                veins.append(vein(cx, top, ym, 1))
                ym += 9.2
    return {"outline": outline(cx, top), "veins": "".join(veins)}


LEAVES = [leaf(377, 209, "hatched"), leaf(513, 210, "veined"), leaf(652, 209, "plain")]
STROKE = 3.2

# ——— Lettrage ———


def load(name, wght):
    return instantiateVariableFont(TTFont(os.path.join(FONTS, name)), {"wght": wght})


def text_path(font, text, width, cx, baseline, tracking=0.0):
    """Texte hébreu (ordre visuel inversé) centré sur cx, mis à la largeur voulue."""
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    upm = font["head"].unitsPerEm
    chars = list(reversed(text))
    adv = [font["hmtx"][cmap[ord(c)]][0] for c in chars]
    raw = sum(adv) + tracking * upm * (len(chars) - 1)
    s = width / raw
    x = cx - width / 2
    pen = SVGPathPen(gs, ntos=fmt)
    for c, a in zip(chars, adv):
        if c != " ":
            gs[cmap[ord(c)]].draw(TransformPen(pen, (s, 0, 0, -s, x, baseline)))
        x += (a + tracking * upm) * s
    return pen.getCommands(), s * upm


bold = load("Heebo[wght].ttf", 700)
light = load("Heebo[wght].ttf", 300)
name, name_size = text_path(bold, "מור וקינמון", 770, 520, 545)
sub, sub_size = text_path(light, "קייטרינג והפקה", 742, 516.5, 714, tracking=0.035)
RULE = (188, 594, 850)

logo = {
    "viewBox": "112 188 816 572",
    "leavesBox": "306 200 418 194",
    "medallion": {"cx": 512, "cy": 474, "r": 470},
    "stroke": STROKE,
    "leaves": LEAVES,
    "name": name,
    "sub": sub,
    "rule": RULE,
    "sizes": {"name": round(name_size, 1), "sub": round(sub_size, 1)},
}
with open(os.path.join(ROOT, "data/logo.json"), "w", encoding="utf-8") as f:
    json.dump(logo, f, ensure_ascii=False, indent=1)


def leaves_svg(color):
    return "".join(
        f'<path d="{l["outline"]}{l["veins"]}" fill="none" stroke="{color}" stroke-width="{STROKE}" stroke-linecap="round" stroke-linejoin="round"/>'
        for l in LEAVES
    )


def content(color):
    x1, y, x2 = RULE
    return (
        leaves_svg(color)
        + f'<path d="{name}" fill="{color}"/>'
        + f'<path d="M{x1} {y}H{x2}" stroke="{color}" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>'
        + f'<path d="{sub}" fill="{color}"/>'
    )


def write(path, svg):
    with open(os.path.join(ROOT, path), "w", encoding="utf-8") as f:
        f.write(svg)


m = logo["medallion"]
TITLE = "<title>מור וקינמון | קייטרינג והפקה</title>"
write(
    "public/logo.svg",
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{m["cx"] - m["r"]} {m["cy"] - m["r"]} {2 * m["r"]} {2 * m["r"]}">{TITLE}'
    f'<circle cx="{m["cx"]}" cy="{m["cy"]}" r="{m["r"]}" fill="{PLUM}"/>{content(CREAM)}</svg>',
)
write("public/logo-dark.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{logo["viewBox"]}">{TITLE}{content(PLUM)}</svg>')
write("public/logo-light.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{logo["viewBox"]}">{TITLE}{content(CREAM)}</svg>')
write("public/leaves.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{logo["leavesBox"]}">{leaves_svg(PLUM)}</svg>')
# Favicon : trait épaissi pour rester lisible à 16 px
icon_leaves = leaves_svg(CREAM).replace(f'stroke-width="{STROKE}"', 'stroke-width="7"')
write(
    "app/icon.svg",
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="265 75 500 500"><circle cx="515" cy="325" r="250" fill="{PLUM}"/>'
    f'<g transform="translate(515 325) scale(1.08) translate(-515 -302)">{icon_leaves}</g></svg>',
)
print("logo :", logo["sizes"])
