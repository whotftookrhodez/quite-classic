<?php

$slug = $_GET['slug'] ?? '';
$slug = trim($slug, '/');
$slugLower = strtolower(str_replace(' ', '-', $slug));

$audioJsonPath = __DIR__ . '/audio.json';
$audioJson = file_exists($audioJsonPath) ? file_get_contents($audioJsonPath) : '{}';
$audioData = json_decode($audioJson, true);

$audioDataLower = array_change_key_case($audioData, CASE_LOWER);

$current = $slugLower && isset($audioDataLower[$slugLower]) ? $audioDataLower[$slugLower] : null;

$itemList = $current ? [$current] : $audioDataLower;

$ogTitle = $current['title'] ?? 'quite classic';
$ogImage = $current['cover'] ?? '';
$ogUrl   = $slug ? 'https://quiteclassic.org/audio/' . urlencode($slugLower) : 'https://quiteclassic.org/audio';
$ogDescription = 'on quiteclassic.org';
$ogImageWidth = 800;
$ogImageHeight = 800;

function h($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo h($ogTitle); ?> – quite classic</title>
<link rel="stylesheet" href="/styles.css">

<link rel="icon" type="image/png" href="/assets/icons/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/svg+xml" href="/assets/icons/favicon.svg">
<link rel="shortcut icon" href="/assets/icons/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="apple-mobile-web-app-title" content="quite classic">

<?php if ($current): ?>
<meta property="og:title" content="<?php echo h($ogTitle); ?>">
<meta property="og:image" content="https://quiteclassic.org<?php echo h($ogImage); ?>">
<meta property="og:image:width" content="<?php echo $ogImageWidth; ?>">
<meta property="og:image:height" content="<?php echo $ogImageHeight; ?>">
<meta property="og:description" content="<?php echo h($ogDescription); ?>">
<meta property="og:url" content="<?php echo h($ogUrl); ?>">
<meta property="og:type" content="music.song">
<?php endif; ?>
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
    <?php if (empty($itemList)): ?>
        <p>audio nil</p>
    <?php else: ?>
        <?php foreach ($itemList as $audio): ?>
        <div class="media-item audio-item">
            <img src="<?php echo h($audio['cover']); ?>" alt="cover.png" class="audio-cover">
            <p class="audio-text"><?php echo h($audio['title']); ?></p>
            <audio controls controlsList="nodownload noplaybackrate">
                <source src="<?php echo h($audio['mp3']); ?>" type="audio/mpeg">
            </audio>
            <a href="<?php echo h($audio['flac']); ?>" class="main__btn" download="<?php echo h($audio['title']); ?>.flac">
                download
            </a>
        </div>
        <?php endforeach; ?>
    <?php endif; ?>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="/app.js" defer></script>
</body>
</html>
