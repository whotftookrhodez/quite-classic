const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})

function getFileNameFromUrl(url) {
    return decodeURIComponent(url.split('/').pop().split('?')[0]);
}

async function downloadAudio(audioUrls, coverUrl, title) {
    const zip = new JSZip();

    for (const url of audioUrls) {
        const fileName = getFileNameFromUrl(url);
        const audioData = await fetch(url).then(r => r.blob());
        
        zip.file(fileName, audioData);
    }

    const coverData = await fetch(coverUrl).then(r => r.blob());

    zip.file("cover.png", coverData);

    const a = document.createElement("a");
    const content = await zip.generateAsync({type: "blob"});

    a.href = URL.createObjectURL(content);
    a.download = `${title}.zip`;

    a.click();
}

document.querySelectorAll('.image-item .main__btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();

        const a = document.createElement('a');
        const fileUrl = btn.getAttribute('href');
        const container = btn.closest('.media-item');
        const imageTitle = container.querySelector('.image-text').textContent.trim();

        a.href = fileUrl;
        a.download = imageTitle + fileUrl.substring(fileUrl.lastIndexOf('.'));

        a.click();
    });
});

async function downloadVisual(visualUrl, coverUrl, btn) {
    const zip = new JSZip();

    const visualData = await fetch(visualUrl).then(r => r.blob());
    const coverData = await fetch(coverUrl).then(r => r.blob());

    zip.file(getFileNameFromUrl(visualUrl), visualData);
    zip.file("cover.png", coverData);

    const a = document.createElement("a");
    const content = await zip.generateAsync({type: "blob"});
    const container = btn.closest('.media-item');
    const videoTitle = container.querySelector('.video-text').textContent.trim();

    a.href = URL.createObjectURL(content);
    a.download = `${videoTitle}.zip`;

    a.click();
}