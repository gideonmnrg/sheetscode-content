"""Screenshot tiap fitur Property Tracker (web app asli + data dummy) ke ../shots/.

Lebar konten diatur lewat lebar viewport desktop (sidebar 248px + padding 56px), lalu yang
di-screenshot elemennya saja, supaya tampilan tetap layout desktop asli.
"""
import asyncio, os, json
from playwright.async_api import async_playwright

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, '..', 'shots')
SIDE = 304                                  # sidebar 248 + padding konten 2x28

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--lang=id-ID'],
                                    env={**os.environ, 'LANG': 'id_ID.UTF-8', 'LANGUAGE': 'id', 'LC_ALL': 'id_ID.UTF-8'})

        async def app(role='manager', cw=860, h=1000, mobile_w=None):
            w = mobile_w or cw + SIDE
            ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=3, locale='id-ID', timezone_id='Asia/Jakarta')
            pg = await ctx.new_page()
            pg.on('pageerror', lambda e: print('PAGEERR', str(e)[:200]))
            await pg.goto(f'file://{D}/index_{role}.html')
            await pg.wait_for_timeout(1500)
            return pg

        async def go(pg, key, wait=1200):
            await pg.evaluate(f"openPage('{key}')"); await pg.wait_for_timeout(wait)

        async def el(pg, sel, name, nth=0, max_h=None):
            loc = pg.locator(sel).nth(nth)
            await loc.scroll_into_view_if_needed()
            bb = await loc.bounding_box()
            if max_h and bb['height'] > max_h:
                await pg.screenshot(path=f'{OUT}/{name}.png', clip={'x': bb['x'], 'y': bb['y'], 'width': bb['width'], 'height': max_h}, full_page=True)
            else:
                await loc.screenshot(path=f'{OUT}/{name}.png')
            print('shot', name, round(bb['width']), 'x', round(min(bb['height'], max_h or 1e9)))

        async def span(pg, sel_a, sel_b, name, pad=0):
            a = await pg.locator(sel_a).first.bounding_box(); z = await pg.locator(sel_b).first.bounding_box()
            x0, y0 = min(a['x'], z['x']) - pad, a['y'] - pad
            await pg.screenshot(path=f'{OUT}/{name}.png', full_page=True,
                                clip={'x': x0, 'y': y0, 'width': max(a['x'] + a['width'], z['x'] + z['width']) - x0 + pad, 'height': z['y'] + z['height'] - y0 + pad})
            print('span', name)

        # 1. desktop overview (cover)
        pg = await app(cw=976, h=820)
        await pg.screenshot(path=f'{OUT}/desk_dashboard.png')
        await go(pg, 'leads', 1500)
        await pg.screenshot(path=f'{OUT}/desk_leads.png')
        await pg.context.close()

        # 2. login (web app Sales & Marketing)
        pg = await app('sales', mobile_w=860, h=640)
        await pg.screenshot(path=f'{OUT}/login.png')
        await pg.context.close()

        # 3. dashboard scorecards (4 per baris)
        pg = await app(cw=650, h=1200)
        await span(pg, '.filterbar', '.scorecards', 'dash_score')
        await pg.context.close()

        # 4-7. insight, sumber, top, target
        pg = await app(cw=860, h=1400)
        await el(pg, '#dashInsightSec .chart-card', 'dash_kpichart', 0)
        await el(pg, '#dashInsightSec .dash-section-inner', 'dash_monthly')
        await el(pg, '#dashInsightSec .chart-card', 'dash_sumber', 1)
        await el(pg, '#dashInsightSec .chart-card', 'dash_properti', 2)
        await el(pg, '#dashTopSec .dash-section', 'dash_toppenjualan', 1)
        await el(pg, '#dashTopSec .dash-section', 'dash_topleads', 0)
        await el(pg, '#dashTargetSec .dash-subblock', 'dash_target_global', 0)
        await el(pg, '#dashTargetSec .dash-subblock', 'dash_target_person', 1)
        await el(pg, '#dashTargetSec .funnel-pills', 'dash_posisi', 0)
        await pg.context.close()

        # 8. leads table (lebar) + filter
        pg = await app(cw=1500, h=1100)
        await go(pg, 'leads', 1500)
        await el(pg, '.filterbar', 'leads_filter')
        await el(pg, '#tableWrap .panel', 'leads_table')
        cols = await pg.evaluate("[...document.querySelectorAll('#tableWrap thead th')].map(t => {const r=t.getBoundingClientRect(), p=document.querySelector('#tableWrap .panel').getBoundingClientRect(); return [t.innerText, Math.round(r.left-p.left), Math.round(r.right-p.left)]})")
        await pg.evaluate("document.querySelector('#tableWrap .table-scroll').scrollLeft = 99999"); await pg.wait_for_timeout(200)
        cols_r = await pg.evaluate("[...document.querySelectorAll('#tableWrap thead th')].map(t => {const r=t.getBoundingClientRect(), p=document.querySelector('#tableWrap .panel').getBoundingClientRect(); return [t.innerText, Math.round(r.left-p.left), Math.round(r.right-p.left)]})")
        await el(pg, '#tableWrap .panel', 'leads_table_right')
        json.dump({'left': cols, 'right': cols_r}, open(f'{OUT}/_leads_cols.json', 'w'))
        await pg.evaluate("setPage('leads', 19)"); await pg.wait_for_timeout(400)
        JS_COLS = "[...document.querySelectorAll('#tableWrap thead th')].map(t => {const r=t.getBoundingClientRect(), p=document.querySelector('#tableWrap .panel').getBoundingClientRect(); return [t.innerText, Math.round(r.left-p.left), Math.round(r.right-p.left)]})"
        c19 = await pg.evaluate(JS_COLS)
        await el(pg, '#tableWrap .panel', 'leads_p19')
        await pg.evaluate("document.querySelector('#tableWrap .table-scroll').scrollLeft = 99999"); await pg.wait_for_timeout(200)
        c19r = await pg.evaluate(JS_COLS)
        await el(pg, '#tableWrap .panel', 'leads_p19_right')
        json.dump({'left': c19, 'right': c19r}, open(f'{OUT}/_leads19_cols.json', 'w'))
        await pg.evaluate("document.querySelector('#tableWrap .table-scroll').scrollLeft = 0")
        # 9. assign modal + email notifikasi
        idx = await pg.evaluate("STATE.rows.findIndex(r => !String(r.values.pics||'').trim())")
        await pg.evaluate(f"openAssign({idx})"); await pg.wait_for_timeout(400)
        await pg.locator('#assignSales input[value="Bima Saputra"]').check()
        await pg.fill('#assignNote', 'Klien minta dihubungi sore, tertarik unit hook.')
        await el(pg, '.modal-card', 'assign_modal')
        await pg.click('#modalSave'); await pg.wait_for_timeout(900)
        mail = await pg.evaluate("window.SENT_MAIL[0] || null")
        await pg.evaluate("document.getElementById('modal').style.display='none'")
        # 10. riwayat lead (lead yang sudah akad)
        lid = await pg.evaluate("(STATE.rows.find(r => r.values.status === 'Akad') || STATE.rows[0])._id")
        await pg.evaluate(f"viewHistory('{lid}')"); await pg.wait_for_timeout(600)
        await el(pg, '.modal-card', 'history_modal')
        await pg.context.close()
        if mail:
            json.dump(mail, open(f'{OUT}/_mail.json', 'w'))
            ctx = await b.new_context(viewport={'width': 640, 'height': 900}, device_scale_factor=3)
            mp = await ctx.new_page(); await mp.set_content(mail.get('htmlBody') or mail.get('body', ''))
            await mp.wait_for_timeout(300)
            await mp.screenshot(path=f'{OUT}/email.png', full_page=True); print('email', mail.get('subject'))
            from PIL import Image, ImageChops
            im = Image.open(f'{OUT}/email.png').convert('RGB')
            bb = ImageChops.difference(im, Image.new('RGB', im.size, (255, 255, 255))).getbbox()
            im.crop(bb).save(f'{OUT}/email.png')
            await ctx.close()

        # 11. pemberkasan: daftar + form dokumen
        pg = await app(cw=1900, h=1100)
        await go(pg, 'closing', 1500)
        await el(pg, '#tableWrap .panel', 'berkas_table')
        i2 = await pg.evaluate("STATE.rows.findIndex(r => r.values.statusberkas === 'Proses')")
        await pg.evaluate(f"openForm('closing', {i2})"); await pg.wait_for_timeout(1500)
        await el(pg, '.form-card .form-section', 'berkas_form_main', 0)
        secs = pg.locator('.form-card .form-section')
        a1 = await secs.nth(1).bounding_box(); a3 = await secs.nth(3).bounding_box()
        await pg.screenshot(path=f'{OUT}/berkas_docs.png', full_page=True,
                            clip={'x': a1['x'], 'y': a1['y'], 'width': a1['width'], 'height': a3['y'] + a3['height'] - a1['y']})
        print('docs', await secs.count())
        await pg.context.close()

        # 12. target per pekan
        pg = await app(cw=1000, h=1200)
        await go(pg, 'target', 1500)
        await span(pg, '.topbar', '.target-bulk-panel', 'target_module')
        # 13. absensi + rekap
        await go(pg, 'absensi', 1500)
        await span(pg, '.topbar', '#absensiBulkBody', 'absensi_module')
        await pg.context.close()
        pg = await app(cw=1500, h=1000)
        await go(pg, 'rekap', 1500)
        await span(pg, '.topbar', '.rekap-panel', 'rekap_module')
        await pg.context.close()

        # 14. master data
        pg = await app(cw=1100, h=1000)
        for key in ['menudropdown', 'property', 'developer', 'karyawan', 'clients', 'piket']:
            await go(pg, key, 1500)
            await span(pg, '.topbar', '#content', f'mod_{key}')
        await go(pg, 'templates', 1200)
        await span(pg, '.topbar', '#content', 'mod_templates')
        await pg.context.close()

        # 15. mobile
        pg = await app(mobile_w=390, h=844)
        await pg.screenshot(path=f'{OUT}/m_dashboard.png')
        await go(pg, 'leads', 1500)
        await pg.screenshot(path=f'{OUT}/m_leads.png')
        await pg.evaluate("toggleNav(true)"); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{OUT}/m_nav.png')
        await pg.context.close()
        await b.close()

asyncio.run(main())
