const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active')
})

async function downloadAudioPackage(audioUrl, coverUrl) {
    const zip = new JSZip();

    const audioData = await fetch(audioUrl).then(r => r.blob());
    const coverData = await fetch(coverUrl).then(r => r.blob());

    zip.file("audio.mp3", audioData);
    zip.file("cover.jpg", coverData);

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "audio_package.zip";
    a.click();
}


// === VIDEO DOWNLOAD PACKAGE SUPPORT ===
async function downloadVideoPackage(videoUrl, coverUrl) {
    const zip = new JSZip();

    const videoData = await fetch(videoUrl).then(r => r.blob());
    const coverData = await fetch(coverUrl).then(r => r.blob());

    zip.file("video.mp4", videoData);
    zip.file("cover.jpg", coverData);

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "video_package.zip";
    a.click();
}