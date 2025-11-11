#!/usr/bin/env python3

from data import visual
import os, json, urllib.parse, html

ROOT = '/var/www/html'

def read_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def url(x):
    return urllib.parse.quote(x, safe="/")

def h(x):
    return html.escape(x or '', quote=True)

def render_image_item(item):
    image = item.get('image', '')
    title = item.get('title', '')

    return f'''
<div class="media-item image-item">
    <div class="media-left">
        <img src="{url(image)}" alt="{h(os.path.basename(image))}" class="image/png">
    </div>
    <div class="media-right">
        <p class="image-text">{h(title)}</p>
        <a href="{url(image)}" class="main__btn">download</a>
    </div>
</div>
'''

def render_video_item(item):
    cover = item.get('cover', '')
    video = item.get('video', '')
    title = item.get('title', '')

    return f'''
<div class="media-item video-item">
    <div class="video-content">
        <img src="{url(cover)}" alt="cover.png" class="video-cover">
        <video controls class="video-player">
            <source src="{url(video)}" type="video/mp4">
        </video>
    </div>
    <p class="video-text">{h(title)}</p>
    <a class="main__btn"
       onclick="downloadVisual('{url(video)}', '{url(cover)}', this)">
       download
    </a>
</div>
'''

def render_visual_item(item):
    if item.get("type") == "video":
        return render_video_item(item)
    return render_image_item(item)

def render_html_page(items):
    html_items = '\n'.join([render_visual_item(i) for i in items])
    
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
    <title>quite classic</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
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
                    <a href="/audio.html" class="navbar__links">audio</a>
                </li>
                <li class="navbar__item">
                    <a href="/visual.html" class="navbar__links">* visual</a>
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
            {html_items}
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="/app.js"></script>
</body>
</html>
'''

def main():
    items = list(visual.data.values())
    html = render_html_page(items)

    with open(os.path.join(ROOT, 'visual.html'), 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    main()