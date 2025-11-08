#!/usr/bin/env python3

import os, json, re, shutil, pathlib

SITE_BASE = 'https://quiteclassic.org'
ROOT = '/var/www/html'
DATA_JSON = os.path.join(ROOT, 'data', 'audio.json')
OUT_DIR = os.path.join(ROOT, 'audio')

def read_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def slugify(s):

    s = s.lower()
    s = re.sub(r'[^a-z0-9]', '_', s)
    s = re.sub(r'_+', '_', s)
    return s.strip('_')

def clear_out_dir(folder):

    if os.path.exists(folder):
        for name in os.listdir(folder):
            path = os.path.join(folder, name)
            try:
                if os.path.isfile(path) or os.path.islink(path):
                    os.unlink(path)
                elif os.path.isdir(path):
                    shutil.rmtree(path)
            except Exception as e:
                print(f"Error clearing {path}: {e}")

def make_dirs(p):
    pathlib.Path(p).mkdir(parents=True, exist_ok=True)

def h(x):

    return (x or '').replace('&', '&amp;').replace('<', '&lt;').replace('"', '&quot;')

def render_audio_item(item, slug):

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
    page_link = f"/audio/{slug}"
    
    return f'''
<div class="media-item audio-item">
    <a href="{page_link}">
        <img src="{h(cover)}" alt="cover.png" class="audio-cover clickable">
        <p class="audio-text clickable">{h(title)}</p>
    </a>
    {audio_html}
    <a class="main__btn"
       onclick="downloadAudio([{flac_list_str}], '{h(cover)}', this.closest('.audio-item').querySelector('.audio-text').textContent)">
       download
    </a>
</div>
'''

def render_html_page(items, current_slug=None):

    og_title = h(items[current_slug]['title']) if current_slug else ''
    og_image = h(items[current_slug]['cover']) if current_slug else ''
    og_url = f"{SITE_BASE}/audio/{current_slug}" if current_slug else ''
    
    audio_items_html = '\n'.join([
        render_audio_item(item, slug)
        for slug, item in items.items()
    ])
    
    return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{og_title + ' - quite classic' if og_title else 'quite classic'}</title>
    <link rel="stylesheet" href="/styles.css">
    {'<meta property="og:title" content="' + og_title + '">' if current_slug else ''}
    {'<meta property="og:image" content="' + SITE_BASE + og_image + '">' if current_slug else ''}
    {'<meta property="og:url" content="' + og_url + '">' if current_slug else ''}
</head>
<body>
    <nav class="navbar">
        <div class="navbar__container">
            <a href="/" id="navbar__logo">quite classic</a>
            <ul class="navbar__menu">
                <li><a href="/about.html">about</a></li>
                <li><a href="/audio.html">audio</a></li>
                <li><a href="/visual.html">visual</a></li>
                <li><a href="/other.html">other</a></li>
                <li><a href="/upload.html">upload</a></li>
            </ul>
        </div>
    </nav>
    <div class="main__container">
        <div class="main__content">
            {audio_items_html}
        </div>
    </div>
    <script src="/app.js"></script>
</body>
</html>
'''

def main():
    data = read_json(DATA_JSON)
    slug_map = {slugify(k): v for k, v in data.items()}

    clear_out_dir(OUT_DIR)
    make_dirs(OUT_DIR)


    for slug, item in slug_map.items():
        html = render_html_page(slug_map, current_slug=slug)
        out_file = os.path.join(OUT_DIR, f'{slug}.html')
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(html)


    all_html = render_html_page(slug_map)
    with open(os.path.join(ROOT, 'audio.html'), 'w', encoding='utf-8') as f:
        f.write(all_html)

if __name__ == '__main__':
    main()