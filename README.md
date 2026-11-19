# tengkuNaufal.github.io

Personal portfolio of **Tengku Naufal Saqib** — Informatics Engineering, Institut Teknologi Bandung.

Live: https://tengkunaufal.github.io

## Structure
```
index.html                     # the whole site (single page)
assets/css/style.css           # styles (dark/light theme tokens at the top)
assets/js/main.js              # theme toggle, scroll reveal, filters, lightbox gallery
assets/img/*.webp              # project screenshots (optimized)
assets/CV_Tengku_Naufal_Saqib.pdf
```

No build step — plain HTML/CSS/JS, served directly by GitHub Pages.

## Adding a project
1. Put the screenshot in `assets/img/` (WebP, ≤1600px wide).
2. Copy one `<article class="card">` in the **More projects** section of `index.html`.
3. To make it open in the gallery, add an entry to `galleries` in `assets/js/main.js` and set `data-gallery="<name>"` on the image.
