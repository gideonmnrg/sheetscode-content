"""Rakit index.html: Index.html asli + Styles + JavaScript, backend Code.gs dibungkus jadi window.SERVER.

Sumber asli (src/) tidak di-commit. Font Google diganti font lokal (fontsource) karena render offline.
"""
import os, re
D = os.path.dirname(os.path.abspath(__file__))
src = lambda n: open(os.path.join(D, 'src', n), encoding='utf-8').read()
role = os.environ.get('APP_ROLE', 'MANAGER')

code = src('Code.gs').replace("var APP_ROLE = 'MANAGER';", f"var APP_ROLE = '{role}';", 1)
apis = re.findall(r'^function (api\w+)\(', code, re.M)
server = ('<script>window.SERVER = (function(){\n' + code + '\nreturn {' + ', '.join(f'{a}: {a}' for a in apis)
          + ', assignEmailHtml: assignEmailHtml};\n})();</script>')

FONTS = '../../../_kit/fonts'
font_css = '<style>' + ''.join(
    f"@font-face{{font-family:'{fam}';font-weight:{w};src:url({FONTS}/{d}/files/{d}-latin-{w}-normal.woff2)}}"
    for fam, d, ws in [('Raleway', 'raleway', (500, 600, 700, 800)), ('Nunito', 'nunito', (400, 600, 700))] for w in ws) + '</style>'

html = src('Index.html')
html = re.sub(r'<link href="https://fonts.googleapis.com[^>]+>', font_css, html)
html = html.replace('https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js', 'vendor/chart.umd.js')
html = html.replace("<?!= include('Styles'); ?>", src('Styles.html'))
html = html.replace("<?= APP_ROLE ?>", role)
html = html.replace("<?!= include('JavaScript'); ?>",
                    '<script src="data.js"></script><script src="gas_stub.js"></script>' + server
                    + '<script>Chart && (Chart.defaults.animation = false);</script>' + src('JavaScript.html'))
assert '<?' not in html
out = os.path.join(D, f'index_{role.lower()}.html')
open(out, 'w', encoding='utf-8').write(html)
print('wrote', out, len(apis), 'api')
