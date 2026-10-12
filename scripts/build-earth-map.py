"""Build the illustrated globe assets from public-domain Natural Earth land polygons."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'scripts/data/ne_110m_land.geojson').read_text())
paths = []
for feature in data['features']:
    geometry = feature['geometry']
    polygons = [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates']
    for polygon in polygons:
        rings = []
        for ring in polygon:
            points = [((lon + 180) / 360 * 1000, (90 - lat) / 180 * 500) for lon, lat, *_ in ring]
            rings.append('M' + 'L'.join(f'{x:.2f},{y:.2f}' for x, y in points) + 'Z')
        paths.append(''.join(rings))
land = ''.join(f'<path d="{p}"/>' for p in paths)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1024" viewBox="0 0 1000 500">
<rect width="1000" height="500" fill="#3d8ea8"/>
<g transform="translate(0 2.5)" fill="#285968" stroke="#285968" stroke-width="1.5" opacity=".55">{land}</g>
<g fill="#a5c7a3" stroke="#7dbfc0" stroke-width="3" stroke-linejoin="round">{land}</g>
<g fill="none" stroke="#37656c" stroke-width=".65" stroke-linejoin="round">{land}</g>
</svg>'''
(ROOT / 'public/images/earth/cartoon-map.svg').write_text(svg)
mask = f'<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1024" viewBox="0 0 1000 500"><rect width="1000" height="500" fill="white"/><g fill="black" stroke="black" stroke-width="1.1">{land}</g></svg>'
(ROOT / 'public/images/earth/water-mask.svg').write_text(mask)
# A static location marker for the accessible / touch fallback. Same geographic projection.
x, y = (-74.006 + 180) / 360 * 1000, (90 - 40.7128) / 180 * 500
pin = f'<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1024" viewBox="0 0 1000 500"><g transform="translate({x:.4f} {y:.4f})"><circle r="7" fill="#edab7d" opacity=".22"/><path d="M0 0V-14" stroke="#ffd8ad" stroke-width="1.7"/><circle cy="-16" r="4" fill="#efaf80" stroke="#fff1df" stroke-width="1.2"/><text x="9" y="-12" fill="#ffe3c0" font-family="Arial,sans-serif" font-size="13" letter-spacing="1.2">NYC</text></g></svg>'
(ROOT / 'public/images/earth/new-york-pin.svg').write_text(pin)
print(f'Built {len(paths)} land polygons and NYC marker at {x:.4f}, {y:.4f}.')

# Concentric shoreline bands for the lightweight mobile / reduced-motion fallback.
# WebGL animates a distance field of these same coasts directly in the ocean shader.
tides = []
for width, opacity in [(30,.13), (20,.2), (10,.3)]:
    tides.append(f'<g fill="none" stroke="#b7ddd9" stroke-width="{width}" opacity="{opacity}" stroke-linejoin="round">{land}</g>')
(ROOT/'public/images/earth/cartoon-waves.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1024" viewBox="0 0 1000 500"><defs><mask id="water"><rect width="1000" height="500" fill="white"/><g fill="black" stroke="black" stroke-width="3">{land}</g></mask></defs><g mask="url(#water)">'+''.join(tides)+'</g></svg>')
