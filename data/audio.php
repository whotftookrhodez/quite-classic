<?php
$slug = $_GET['slug'] ?? '';
$slugLower = strtolower(str_replace(' ', '-', trim($slug, '/')));

$audioJsonPath = __DIR__ . '/audio.json';
$audioJson = file_exists($audioJsonPath) ? file_get_contents($audioJsonPath) : '{}';
$audioData = json_decode($audioJson, true);
$audioDataLower = array_change_key_case($audioData, CASE_LOWER);

$current = $slugLower && isset($audioDataLower[$slugLower]) ? $audioDataLower[$slugLower] : null;

function h($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

// OG/fallback values
$ogImage = $current['cover'] ?? '/assets/icons/favicon-96x96.png';
$ogTitle = $current['title'] ?? 'quite classic';
$ogUrl   = $current ? "https://quiteclassic.org/audio/" . urlencode($slug) : "https://quiteclassic.org/audio";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= h($ogTitle) ?> – quite classic</title>

    <link rel="icon" type="image/png" href="/assets/icons/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
    <link rel="shortcut icon" href="/assets/icons/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
    <meta name="apple-mobile-web-app-title" content="quite classic">
    <link rel="manifest" href="/site.webmanifest">

    <link rel="stylesheet" href="/styles.css">

    <meta property="og:image" content="https://quiteclassic.org<?= h($ogImage) ?>">
    <meta property="og:title" content="<?= h($ogTitle) ?>">
    <meta property="og:description" content="on quiteclassic.org">
    <meta property="og:url" content="<?= h($ogUrl) ?>">
    <meta property="og:type" content="music.song">
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
            <li class="navbar__item"><a href="/about.html" class="navbar__links">about</a></li>
            <li class="navbar__item"><a href="/audio.html" class="navbar__links">* audio</a></li>
            <li class="navbar__item"><a href="/visual.html" class="navbar__links">visual</a></li>
            <li class="navbar__item"><a href="/other.html" class="navbar__links">other</a></li>
            <li class="navbar__item"><a href="/upload.html" class="navbar__links">upload</a></li>
        </ul>
    </div>
</nav>

<div class="main__container">
    <div class="main__content" id="dynamic-audio">
        <?php foreach ($itemList as $audio): ?>
        <div class="media-item audio-item">
            <img src="<?= h($audio['cover']) ?>" alt="cover.png" class="audio-cover">
            <p class="audio-text"><?= h($audio['title']) ?></p>
            <audio controls controlsList="nodownload noplaybackrate">
                <source src="<?= h($audio['mp3']) ?>" type="audio/mpeg">
            </audio>
            <a class="main__btn"
               onclick="downloadAudio(['<?= h($audio['flac']) ?>'], '<?= h($audio['cover']) ?>', '<?= h($audio['title']) ?>'); return false;">
               download
            </a>
        </div>
        <?php endforeach; ?>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="/app.js" defer></script>
</body>
</html>
