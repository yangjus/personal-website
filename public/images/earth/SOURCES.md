# Earth artwork and texture sources

The current illustrated globe follows the public-domain Natural Earth 1:110m land coastlines:

- Dataset: https://www.naturalearthdata.com/
- Maintainer source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson
- Downloaded source is bundled in `scripts/data/ne_110m_land.geojson`.

Run `python3 scripts/build-earth-map.py` followed by `node scripts/build-earth-tides.mjs` to regenerate `cartoon-map.svg`, `water-mask.svg`, `cartoon-waves.svg`, `new-york-pin.svg`, and `shore-distance.png`. The land uses one mint fill; there are no hill or mountain props. Tidal bands use distance from the same land polygons, with periodic longitude, and animate directly in the ocean shader. These washes are artistic animation, rather than a physical tide simulation. The NYC marker uses 40.7128° N, 74.0060° W. Colors, tidal styling, and cloud artwork are original. Small coastlines are intentionally generalized at this map scale.

The following locally served Three.js example assets are retained from the earlier realistic globe and are not loaded by the current renderer. Downloaded October 10, 2026:

- Surface: https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg
- Cloud layer: https://threejs.org/examples/textures/planets/earth_clouds_1024.png
- Ocean specular mask: https://threejs.org/examples/textures/planets/earth_specular_2048.jpg

Earth imagery credit: NASA. Background: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/

Higgsfield generation was previously attempted but returned “Requires basic plan or higher.” No generated image was used.
