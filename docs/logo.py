# Rebuild the I&A Schoolwear lockups (brand guide 2022) as outlined SVG paths.
# Serif "I & A": Cormorant Garamond SemiBold. "SCHOOLWEAR": Lexend Thin as a stand-in for Agrandir Thin, tracked 0.15em.
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

F = "/home/claude/brand/fonts/"
serif = instantiateVariableFont(TTFont(F + "cormorant.ttf"), {"wght": 600})
bold = instantiateVariableFont(TTFont(F + "cormorant.ttf"), {"wght": 700})
thin = instantiateVariableFont(TTFont(F + "lexend.ttf"), {"wght": 150})

def run(font, text, size, x, y, tracking=0.0, word_gap=None):
    """Return (svg path d, advance width, bbox) for text at baseline (x,y)."""
    gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font["head"].unitsPerEm; s = size / upm
    pen = SVGPathPen(gs); bp = BoundsPen(gs); cx = x
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]; glyph = gs[g]
        tp = TransformPen(pen, (s, 0, 0, -s, cx, y)); glyph.draw(tp)
        tb = TransformPen(bp, (s, 0, 0, -s, cx, y)); glyph.draw(tb)
        adv = glyph.width * s
        if ch == " " and word_gap is not None: adv = word_gap
        cx += adv + (tracking * size if i < len(text) - 1 else 0)
    return pen.getCommands(), cx - x, bp.bounds

def svg(paths, w, h, fill, bg=None):
    rect = f'<rect width="{w:.1f}" height="{h:.1f}" fill="{bg}"/>' if bg else ""
    body = "".join(f'<path d="{d}"/>' for d in paths)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" role="img" aria-label="I&amp;A Schoolwear">{rect}<g fill="{fill}">{body}</g></svg>'

def horizontal(fill):
    # Cap heights matched to the guide: SCHOOLWEAR cap height ~ 0.55 of the serif cap height, sharing a baseline.
    pad = 4; base = 64
    d1, w1, b1 = run(serif, "I & A", 84, pad, base, tracking=0.02, word_gap=22)
    d2, w2, b2 = run(thin, "SCHOOLWEAR", 40, pad + w1 + 18, base, tracking=0.15)
    W = pad + w1 + 18 + w2 + pad; top = min(b1[1], b2[1]) - pad
    return svg([d1, d2], W, base - top + pad + 2, fill).replace(f'viewBox="0 0', f'viewBox="0 {top:.1f}', 1).replace(f' {base - top + pad + 2:.1f}"', f' {base - top + pad + 2:.1f}"')

def stacked(fill, bg=None):
    # Marque (I in a rectangle) above "I & A" above "SCHOOLWEAR"
    W = 340
    d1, w1, b1 = run(serif, "I & A", 92, 0, 0, tracking=0.02, word_gap=24)
    x1 = (W - w1) / 2; d1, w1, b1 = run(serif, "I & A", 92, x1, 300, tracking=0.02, word_gap=24)
    d2, w2, _ = run(thin, "SCHOOLWEAR", 34, 0, 0, tracking=0.15)
    d2, w2, _ = run(thin, "SCHOOLWEAR", 34, (W - w2) / 2, 372, tracking=0.15)
    # marque: rectangle 140x190 centred, letter I knocked out
    rx, ry, rw, rh = (W - 140) / 2, 20, 140, 190
    dI, wI, bI = run(bold, "I", 175, 0, 0)
    iw = bI[2] - bI[0]; ih = bI[3] - bI[1]
    dI, _, _ = run(bold, "I", 175, rx + (rw - iw) / 2 - bI[0], ry + (rh - ih) / 2 - bI[1])
    marque = f'<path fill-rule="evenodd" d="M{rx} {ry}h{rw}v{rh}h-{rw}Z {dI}"/>'
    rect = f'<rect width="{W}" height="400" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 400" role="img" aria-label="I&amp;A Schoolwear">{rect}<g fill="{fill}">{marque}<path d="{d1}"/><path d="{d2}"/></g></svg>'

def marque(fill, letter, border=False, size=512):
    rw, rh = 300, 410; W = size
    rx, ry = (W - rw) / 2, (W - rh) / 2
    dI, _, bI = run(bold, "I", 370, 0, 0); iw = bI[2] - bI[0]; ih = bI[3] - bI[1]
    dI, _, _ = run(bold, "I", 370, rx + (rw - iw) / 2 - bI[0], ry + (rh - ih) / 2 - bI[1])
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {W}"><rect x="{rx}" y="{ry}" width="{rw}" height="{rh}" fill="{fill}"/><path fill="{letter}" d="{dI}"/></svg>'

out = sys.argv[1]
OCHRE, BLUE, YELLOW, WHITE = "#45353a", "#4169e1", "#ffde59", "#ffffff"
open(out + "/iana-schoolwear-horizontal-ochre.svg", "w").write(horizontal(OCHRE))
open(out + "/iana-schoolwear-horizontal-white.svg", "w").write(horizontal(WHITE))
open(out + "/iana-schoolwear-stacked-white.svg", "w").write(stacked(WHITE))
open(out + "/iana-schoolwear-stacked-blue-bg.svg", "w").write(stacked(WHITE, BLUE))
open(out + "/iana-schoolwear-stacked-yellow-bg.svg", "w").write(stacked(OCHRE, YELLOW))
open(out + "/iana-marque-ochre.svg", "w").write(marque(OCHRE, WHITE))
open(out + "/iana-marque-blue.svg", "w").write(marque(BLUE, WHITE))
print("ok")
