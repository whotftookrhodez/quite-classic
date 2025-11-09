#!/usr/bin/env python3

import os, json, pathlib, urllib.parse

SITE_BASE = 'https://quiteclassic.org'
ROOT = '/var/www/html'
DATA_JSON = os.path.join(ROOT, 'data', 'audio.json')
OUT_DIR = os.path.join(ROOT, 'audio')

def read_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def slugify(s):
    return s.strip().lower().replace(' ', '-')

def make_dirs(p):
    pathlib.Path(p).mkdir(parents=True, exist_ok=True)

def h(x):
    return (x or '').replace('&', '&amp;').replace('<', '&lt;').replace('"', '&quot;')

def render_audio_item(item):
    slug = item.get('slug', '')
    title = item.get('title', '')
    cover = item.get('cover', '')
    tracks = item.get('tracks', [])
    audio_html = ""
    flac_files = []

    for track in tracks:
        mp3 = track.get('mp3', '')
        flac = track.get('flac', '')
        audio_html += f'''
        <audio controls controlsList="nodownload noplaybackrate">
            <source src="{h(mp3)}" type="audio/mpeg">
        </audio>'''

        if flac:
            flac_files.append(h(flac))

    flac_list_str = ', '.join(f"'{f}'" for f in flac_files)

    return f'''
<div class="media-item audio-item">
    <img src="{h(cover)}" alt="cover.png" class="audio-cover clickable">
    <p class="audio-text clickable" data-slug="{slug}">{h(title)}</p>
    {audio_html}
    <a class="main__btn"
       onclick="downloadAudio([{flac_list_str}], '{h(cover)}', this.closest('.audio-item').querySelector('.audio-text').textContent)">
       download
    </a>
</div>
'''

def render_html_page(items, slug=None, current=None):
    og_title = h(current.get('title')) if current else ''
    og_image = h(current.get('cover')) if current else ''
    og_url = f"{SITE_BASE}/audio/{urllib.parse.quote(slug)}" if slug else ''
    audio_items_html = '\n'.join([render_audio_item(item) for item in items])

    return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" type="image/png" href="/assets/icons/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
    <link rel="shortcut icon" href="/assets/icons/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
    <meta name="apple-mobile-web-app-title" content="quite classic">
    <link rel="manifest" href="/site.webmanifest">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{og_title or 'quite classic'}</title>
    <link rel="stylesheet" href="/styles.css">
    {'<meta property="og:title" content="' + og_title + '">' if current else ''}
    {'<meta property="og:description" content="on quiteclassic.org">' if current else ''}
    {'<meta property="og:image" content="' + SITE_BASE + og_image + '">' if current else ''}
    {'<meta property="og:url" content="' + og_url + '">' if current else ''}
</head>
<body>
    <canvas id="background"></canvas>
    <nav class="navbar">
        <div class="navbar__container">
            <a href="/" id="navbar__logo">quite classic</a>
            <div class="navbar__toggle" id="mobile-menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <ul class="navbar__menu">
                <li class="navbar__item">
                    <a href="/about.html" class="navbar__links">about</a>
                </li>
                <li class="navbar__item">
                    <a href="/audio.html" class="navbar__links">* audio</a>
                </li>
                <li class="navbar__item">
                    <a href="/visual.html" class="navbar__links">visual</a>
                </li>
                <li class="navbar__item">
                    <a href="/other.html" class="navbar__links">other</a>
                </li>
                <li class="navbar__item">
                    <a href="/upload.html" class="navbar__links">upload</a>
                </li>
            </ul>
        </div>
    </nav>
    <div class="main__container">
        <div class="main__content">
            {audio_items_html}
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="/app.js"></script>
</body>
</html>
'''

def main():
    data = read_json(DATA_JSON)
    items = {slugify(k): v for k, v in data.items()}

    make_dirs(OUT_DIR)

    for slug, item in items.items():
        html = render_html_page([item], slug=slug, current=item)
        out_file = os.path.join(OUT_DIR, f'{slug}.html')

        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(html)

    all_html = render_html_page(list(items.values()))

    with open(os.path.join(OUT_DIR, 'audio.html'), 'w', encoding='utf-8') as f:
        f.write(all_html)

if __name__ == '__main__':
    main()