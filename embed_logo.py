"""
Embeds the TRUTHMODE logo into the planner HTML.
Run from the CALENDAR-APP directory.
"""
import base64, re, os

# Read logo as base64 data URI
with open('assets/truthmode_logo.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()
DATA_URI = f'data:image/jpeg;base64,{b64}'

HTML_PATH = os.path.join('src', 'index.html')
with open(HTML_PATH, 'r', encoding='utf-8') as f:
    html = f.read()

# ── 1. SIDEBAR HEADER ─────────────────────────────────────────────────────────
# Replace the text-based header with the logo image
OLD_HD = '''  <div class="hd">
    <div class="t"><span>TRUTH</span><span class="m">MODE</span></div>
    <small>Executive Planner 2026</small>
  </div>'''

NEW_HD = f'''  <div class="hd" style="padding:14px 12px 14px;border-bottom:1px solid #1e1e1e;text-align:center">
    <img src="{DATA_URI}" alt="TRUTHMODE" style="width:150px;height:150px;object-fit:contain;border-radius:8px;display:block;margin:0 auto 4px">
    <small style="display:block;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase">Executive Planner 2026</small>
  </div>'''

html = html.replace(OLD_HD, NEW_HD)

# ── 2. COVER PAGE ─────────────────────────────────────────────────────────────
# Replace the SVG diamond + text block on the cover with the logo
OLD_COV = '''  <svg width="56" height="56" viewBox="0 0 60 60" style="margin-bottom:18px">
    <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#c9a030" stroke-width="1.5"/>
    <polygon points="30,13 47,30 30,47 13,30" fill="none" stroke="#c9a030" stroke-width="1"/>
    <line x1="16" y1="38" x2="44" y2="38" stroke="#c9a030" stroke-width="1.2"/>
  </svg>
  <div style="font-family:Arial;letter-spacing:5px;font-size:32px;margin-bottom:12px"><span style="color:#fff">TRUTH</span><span style="color:#c9a030">MODE</span></div>'''

NEW_COV = f'''  <img src="{DATA_URI}" alt="TRUTHMODE" style="width:320px;height:320px;object-fit:contain;border-radius:16px;margin-bottom:18px;display:block">'''

html = html.replace(OLD_COV, NEW_COV)

# ── 3. ABOUT PAGE ─────────────────────────────────────────────────────────────
OLD_ABT = '''  <svg width="44" height="44" viewBox="0 0 60 60" style="margin-bottom:16px">
    <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#c9a030" stroke-width="1.5"/>
    <polygon points="30,13 47,30 30,47 13,30" fill="none" stroke="#c9a030" stroke-width="1"/>
    <line x1="16" y1="38" x2="44" y2="38" stroke="#c9a030" stroke-width="1.2"/>
  </svg>
  <div style="font-family:Arial;letter-spacing:4px;font-size:20px;margin-bottom:20px"><span style="color:#fff">TRUTH</span><span style="color:#c9a030">MODE</span></div>'''

NEW_ABT = f'''  <img src="{DATA_URI}" alt="TRUTHMODE" style="width:180px;height:180px;object-fit:contain;border-radius:12px;margin-bottom:20px;display:block;margin-left:auto;margin-right:auto">'''

html = html.replace(OLD_ABT, NEW_ABT)

# ── Write back ────────────────────────────────────────────────────────────────
with open(HTML_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print('Logo embedded in HTML successfully.')
print(f'HTML size: {len(html):,} bytes')
