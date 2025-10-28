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
        const fileName = url.split('/').pop().split('?')[0];
        const audioData = await fetch(url).then(r => r.blob());
        
        zip.file(fileName, audioData);
    }

    const coverData = await fetch(coverUrl).then(r => r.blob());

    zip.file("cover.png", coverData);

    const content = await zip.generateAsync({type: "blob"});
    const a = document.createElement("a");

    a.href = URL.createObjectURL(content);
    a.download = `${title || "zip"}.zip`;

    a.click();
}

async function downloadVisual(visualUrl, coverUrl) {
    const zip = new JSZip();

    const visualData = await fetch(visualUrl).then(r => r.blob());
    const coverData = await fetch(coverUrl).then(r => r.blob());

    zip.file(getFileNameFromUrl(visualUrl), visualData);
    zip.file("cover.png", coverData);

    const content = await zip.generateAsync({type: "blob"});
    const a = document.createElement("a");

    a.href = URL.createObjectURL(content);
    a.download = getFileNameFromUrl(visualUrl).replace(/\.[^/.]+$/, "") + ".zip";

    a.click();
}