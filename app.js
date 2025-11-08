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
    const content = await zip.generateAsync({ type: "blob" });

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
    const content = await zip.generateAsync({ type: "blob" });
    const container = btn.closest('.media-item');
    const videoTitle = container.querySelector('.video-text').textContent.trim();

    a.href = URL.createObjectURL(content);
    a.download = `${videoTitle}.zip`;

    a.click();
}

document.addEventListener("DOMContentLoaded", function() {
    const infoElement = document.getElementById("info");

    if (!infoElement) return;

    fetch(`info.json?cb=${Date.now()}`)
        .then(response => response.json())

        .then(data => {
            const title = `site info:`;

            const diskInfo = 
                `<br>used storage - ${data.used_gb} gb / ${data.total_gb} gb<br>` +
                `last updated - ${new Date(data.last_updated).toLocaleString().toLowerCase()}`;

            infoElement.innerHTML = title + diskInfo;

            const bootTime = new Date(data.boot_time);

            function updateUptime() {
                const now = new Date();
                
                let diff = Math.floor((now - bootTime) / 1000);

                const hours = Math.floor(diff / 3600);

                diff %= 3600;

                const minutes = Math.floor(diff / 60);
                const seconds = diff % 60;

                infoElement.innerHTML = title + diskInfo + `<br>uptime - ${hours}h ${minutes}m ${seconds}s`;
            }

            updateUptime();
            setInterval(updateUptime, 1000);
        })

        .catch(error => {
            infoElement.innerText = "site info nil";

            console.error("error loading site info: ", error);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('/audio.html')) {
        document.querySelectorAll('.audio-item').forEach(item => {
            const cover = item.querySelector('.audio-cover');
            const text = item.querySelector('.audio-text');

            const goToAudioPage = () => {
                const title = item.querySelector('.audio-text').textContent;
                let slug = title.split('-').pop().trim().toLowerCase().replace(/ /g, '-');
                window.location.href = '/audio/' + encodeURIComponent(slug) + '.html';
            };

            cover.addEventListener('click', goToAudioPage);
            text.addEventListener('click', goToAudioPage);

            text.style.cursor = 'pointer';
        });
    }
});