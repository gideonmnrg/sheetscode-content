"""Hand-drawn style line-art helpers (SVG strings). Panel coords: 440 x 420."""
INK = '#2D2A26'
SD, S, SL = '#4F6B53', '#789A7C', '#BFD0BC'
CR, PAPER, ACC, ACCT = '#FCF1E3', '#FFFAF2', '#C9963F', '#9A722A'
GREY = '#E6D9C6'
NOTE = '#F3DFB2'
SW = 4.2

_uid = [0]

def svg(inner, w=440, h=420, seed=3):
    _uid[0] += 1
    fid = f'sk{_uid[0]}'
    return f'''<svg viewBox="0 0 {w} {h}" width="100%" style="display:block;overflow:visible">
<defs><filter id="{fid}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="{seed}"/><feDisplacementMap in="SourceGraphic" scale="3.4"/></filter></defs>
<g filter="url(#{fid})" stroke="{INK}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round" fill="none">{inner}</g></svg>'''

def txt(x, y, t, size=30, rot=0, color=INK, anchor='middle', font='Caveat', weight=700):
    return f'<text x="{x}" y="{y}" transform="rotate({rot} {x} {y})" font-family="{font}" font-weight="{weight}" font-size="{size}" fill="{color}" stroke="none" text-anchor="{anchor}">{t}</text>'

ARMS_DOWN = 'M-36 -140 Q-52 -110 -50 -78 M36 -140 Q52 -110 50 -78'

def person(x, y, s=1.0, mood='happy', shirt=SL, arms=ARMS_DOWN, flip=False, extra=''):
    fx = -1 if flip else 1
    mouth = {
        'happy': 'M-12 -177 Q0 -164 12 -177',
        'big': 'M-13 -178 Q0 -160 13 -178 Z',
        'sad': 'M-11 -168 Q0 -178 11 -168',
        'stress': 'M-12 -171 q4 -5 8 0 q4 5 8 0 q4 -5 8 0',
        'flat': 'M-10 -172 L10 -172',
        'oh': '',
    }[mood]
    face = f'<circle cx="-11" cy="-190" r="3.6" fill="{INK}" stroke="none"/><circle cx="11" cy="-190" r="3.6" fill="{INK}" stroke="none"/>'
    if mood == 'oh':
        face += '<ellipse cx="0" cy="-172" rx="6" ry="8"/>'
    else:
        mf = f'fill="{INK}"' if mood == 'big' else ''
        face += f'<path d="{mouth}" {mf}/>'
    if mood in ('stress', 'sad'):
        face += '<path d="M-19 -204 l11 4 M19 -204 l-11 4" stroke-width="3.4"/>'
        face += f'<path d="M40 -214 q-8 12 0 16 q8 -4 0 -16 Z" fill="#DCEAF0" stroke-width="3"/>'
    if mood in ('happy', 'big'):
        face += '<path d="M-19 -202 q6 -5 11 -1 M19 -202 q-6 -5 -11 -1" stroke-width="3.2"/>'
    return f'''<g transform="translate({x} {y}) scale({fx * s} {s})">
 <path d="M-16 -64 L-20 0 l-15 0 M16 -64 L20 0 l15 0"/>
 <path d="M-34 -150 Q-42 -150 -44 -130 L-47 -68 Q-47 -60 -40 -60 L40 -60 Q47 -60 47 -68 L44 -130 Q42 -150 34 -150 Z" fill="{shirt}"/>
 <path d="{arms}"/>
 <circle cx="0" cy="-189" r="33" fill="{PAPER}"/>
 <path d="M-31 -197 Q-28 -228 2 -225 Q29 -224 32 -198 Q16 -211 -2 -208 Q-20 -206 -31 -197 Z" fill="{INK}"/>
 {face}{extra}
</g>'''

def ground(x1=20, x2=420, y=402):
    return f'<path d="M{x1} {y} L{x2} {y}" stroke-width="3" opacity=".5"/>'

def bubble(x, y, w, h, t, size=30, think=True, tail=(-1, 1)):
    tx, ty = tail
    out = f'<rect x="{x - w/2}" y="{y - h/2}" width="{w}" height="{h}" rx="{h/2}" fill="{PAPER}"/>'
    if think:
        out += f'<circle cx="{x + tx * w * .28}" cy="{y + ty * (h/2 + 16)}" r="8" fill="{PAPER}"/><circle cx="{x + tx * w * .36}" cy="{y + ty * (h/2 + 34)}" r="5" fill="{PAPER}"/>'
    else:
        out += f'<path d="M{x + tx*w*.15} {y + h/2 - 2} L{x + tx*w*.32} {y + h/2 + 26} L{x + tx*w*.30} {y + h/2 - 2}" fill="{PAPER}"/>'
    return out + txt(x, y + size * .33, t, size)

def jar(x, y, w, h, label, coins=3, lsize=20):
    c = ''.join(f'<ellipse cx="{x - w/2 + 22 + (i % 3) * (w - 44) / 2}" cy="{y + h - 20 - (i // 3) * 18}" rx="15" ry="8" fill="{ACC}" stroke-width="3"/>' for i in range(coins))
    return (f'<path d="M{x - w/2 + 8} {y} L{x - w/2} {y + 14} L{x - w/2} {y + h - 8} Q{x - w/2} {y + h} {x - w/2 + 10} {y + h} L{x + w/2 - 10} {y + h} Q{x + w/2} {y + h} {x + w/2} {y + h - 8} L{x + w/2} {y + 14} L{x + w/2 - 8} {y} Z" fill="{PAPER}"/>'
            f'<rect x="{x - w/2 + 4}" y="{y - 18}" width="{w - 8}" height="18" rx="5" fill="{SD}"/>{c}'
            f'<rect x="{x - w/2 + 10}" y="{y + 30}" width="{w - 20}" height="34" rx="6" fill="{CR}" stroke-width="3"/>'
            + txt(x, y + 54, label, lsize, font='Raleway', weight=700))

def coin(x, y, r=13):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{ACC}" stroke-width="3"/>' + txt(x, y + 7, '$', 19, font='Poppins')

def arrow(d, head):
    return f'<path d="{d}" stroke-width="3.6"/><path d="{head}" stroke-width="3.6"/>'

def laptop(x, y, w=170, content=''):
    h = w * .62
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{PAPER}"/>'
            f'<path d="M{x - 18} {y + h + 22} L{x + w + 18} {y + h + 22} L{x + w} {y + h} L{x} {y + h} Z" fill="{GREY}"/>' + content)

def sheet_grid(x, y, w, h, rows=4, cols=3, fill=CR):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{fill}" stroke-width="3"/>'
    out += f'<rect x="{x}" y="{y}" width="{w}" height="{h / rows}" fill="{SL}" stroke-width="3"/>'
    for r in range(1, rows):
        out += f'<path d="M{x} {y + r * h / rows} L{x + w} {y + r * h / rows}" stroke-width="2.4"/>'
    for c in range(1, cols):
        out += f'<path d="M{x + c * w / cols} {y} L{x + c * w / cols} {y + h}" stroke-width="2.4"/>'
    return out

def check_badge(x, y, r=22):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SD}"/><path d="M{x - 9} {y} L{x - 2} {y + 8} L{x + 10} {y - 8}" stroke="{CR}" stroke-width="4.4"/>'

def x_badge(x, y, r=22):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{GREY}"/><path d="M{x - 8} {y - 8} L{x + 8} {y + 8} M{x + 8} {y - 8} L{x - 8} {y + 8}" stroke-width="4"/>'

def sticky(x, y, t, rot=0, size=24, w=96):
    return (f'<g transform="rotate({rot} {x} {y})"><rect x="{x - w/2}" y="{y - w/2 + 8}" width="{w}" height="{w - 16}" fill="{NOTE}" stroke-width="3"/>'
            + txt(x, y + 6, t, size) + '</g>')

def phone(x, y, w=74, h=130):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{PAPER}"/>'
    for i, (dx, ww) in enumerate([(8, 44), (22, 44), (8, 38), (22, 40)]):
        out += f'<rect x="{x + dx}" y="{y + 16 + i * 26}" width="{ww}" height="17" rx="8" fill="{SL if i % 2 else GREY}" stroke-width="2.6"/>'
    return out

def tag(x, y, t, rot=0, size=28, w=120, fill=CR):
    return (f'<g transform="rotate({rot} {x} {y})"><path d="M{x - w/2 + 22} {y - 26} L{x + w/2} {y - 26} L{x + w/2} {y + 26} L{x - w/2 + 22} {y + 26} L{x - w/2} {y} Z" fill="{fill}"/>'
            f'<circle cx="{x - w/2 + 20}" cy="{y}" r="5"/>' + txt(x + 10, y + 9, t, size, font='Poppins', weight=700) + '</g>')

def clock(x, y, r=34):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{PAPER}"/><path d="M{x} {y} L{x} {y - r + 10} M{x} {y} L{x + r - 14} {y + 6}"/><path d="M{x - r - 12} {y - 18} l-10 -6 M{x + r + 12} {y - 18} l10 -6" stroke-width="3"/>'

def die(x, y, s=46, rot=0, dots=((0.3, 0.3), (0.7, 0.7), (0.5, 0.5))):
    d = ''.join(f'<circle cx="{x + a * s}" cy="{y + b * s}" r="4.5" fill="{INK}" stroke="none"/>' for a, b in dots)
    return f'<g transform="rotate({rot} {x + s/2} {y + s/2})"><rect x="{x}" y="{y}" width="{s}" height="{s}" rx="9" fill="{PAPER}"/>{d}</g>'

def motion(x, y, n=3, ang=0, length=22):
    return ''.join(f'<path d="M{x} {y + i * 12} l{length} 0" transform="rotate({ang} {x} {y})" stroke-width="3"/>' for i in range(n))

def sparkle(x, y, s=12, color=ACC):
    return f'<path d="M{x} {y - s} L{x} {y + s} M{x - s} {y} L{x + s} {y}" stroke="{color}" stroke-width="3.6"/>'

def heart(x, y, s=1.0, fill='#E9A8A0'):
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 10 C-26 -8 -14 -30 0 -16 C14 -30 26 -8 0 10 Z" fill="{fill}" stroke-width="3.4"/>'

def bill(x, y, rot=0):
    return (f'<g transform="rotate({rot} {x} {y})"><rect x="{x - 30}" y="{y - 16}" width="60" height="32" rx="4" fill="#D7E4D3" stroke-width="3"/>'
            f'<circle cx="{x}" cy="{y}" r="8" stroke-width="2.6"/><path d="M{x - 30} {y - 4} q-16 -18 -26 -4 M{x + 30} {y - 4} q16 -18 26 -4" stroke-width="3"/></g>')

def gear(x, y, r=30):
    teeth = ''.join(f'<rect x="{x - 7}" y="{y - r - 10}" width="14" height="16" rx="3" fill="{SL}" transform="rotate({a} {x} {y})" stroke-width="3"/>' for a in range(0, 360, 45))
    return teeth + f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SL}"/><circle cx="{x}" cy="{y}" r="{r * .38}" fill="{PAPER}"/>'

def clipboard(x, y, w=110, h=140, title='SOP', ticks=3):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{PAPER}"/><rect x="{x + w/2 - 24}" y="{y - 10}" width="48" height="20" rx="6" fill="{SD}"/>'
    out += txt(x + w/2, y + 40, title, 24, font='Raleway', weight=700)
    for i in range(ticks):
        yy = y + 64 + i * 24
        out += f'<path d="M{x + 16} {yy} l6 7 l10 -12" stroke="{SD}" stroke-width="3.6"/><path d="M{x + 40} {yy} L{x + w - 16} {yy}" stroke-width="3"/>'
    return out

def megaphone(x, y):
    return (f'<path d="M{x} {y - 14} L{x + 60} {y - 40} L{x + 60} {y + 40} L{x} {y + 14} Z" fill="{ACC}"/>'
            f'<rect x="{x - 14}" y="{y - 16}" width="16" height="32" rx="4" fill="{PAPER}"/>'
            f'<path d="M{x + 76} {y - 30} q14 30 0 60 M{x + 92} {y - 44} q22 44 0 88" stroke-width="3.4"/>')
