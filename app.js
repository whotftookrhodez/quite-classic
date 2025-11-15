console.log("you saw nothing")

window.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});

const savedMode = localStorage.getItem('mode') || 'dark';

document.body.classList.add(savedMode + '-mode');

let typingTimeout;

const toggleBtn = document.createElement("button");

toggleBtn.id = "mode-toggle";
toggleBtn.textContent = "/";

const navbarContainer = document.querySelector(".navbar__container");

navbarContainer.insertBefore(toggleBtn, navbarContainer.children[1]);

function getText() {
    const currentMode = document.body.classList.contains("dark-mode") ? 'dark' : 'light';

    return currentMode === 'dark' ? "* dm" : "* lm";
}

function typeText(text) {
    clearTimeout(typingTimeout);

    toggleBtn.textContent = "";

    let i = 0;

    function typeChar() {
        if (i < text.length) {
            toggleBtn.textContent += text[i];

            i++;

            typingTimeout = setTimeout(typeChar, Math.random() * 120);
        }
    }

    typeChar();
}

toggleBtn.addEventListener('mouseenter', () => {
    clearTimeout(typingTimeout);

    typeText(getText());
});

toggleBtn.addEventListener('mouseleave', () => {
    clearTimeout(typingTimeout);

    toggleBtn.textContent = "/";
});

toggleBtn.addEventListener('click', () => {
    const currentMode = document.body.classList.contains("dark-mode") ? 'dark' : 'light';
    const newMode = currentMode === 'dark' ? 'light' : 'dark';

    document.body.classList.remove(currentMode + '-mode');
    document.body.classList.add(newMode + '-mode');
    localStorage.setItem('mode', newMode);

    clearTimeout(typingTimeout);
    typeText(getText());
});

(async () => {
    await flushCache();
})();

async function flushCache() {
    try {
        const lastKnown = localStorage.getItem('last_updated');
        const response = await fetch(`${window.location.origin}/info.json?cb=${Date.now()}`, { cache: "no-store" });
        const data = await response.json();

        if (lastKnown && lastKnown !== data.last_updated) {
            if ('caches' in window) {
                const cacheNames = await caches.keys();

                await Promise.all(cacheNames.map(c => caches.delete(c)));
            }
            
            localStorage.setItem('last_updated', data.last_updated);
            window.location.reload(true);
        } else if (!lastKnown) {
            localStorage.setItem('last_updated', data.last_updated);
        }

    } catch (error) {
        console.error("cache check error: ", error);
    }
}

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

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

    zip.file('cover.png', coverData);

    const a = document.createElement("a");
    const content = await zip.generateAsync({ type: "blob" });

    a.href = URL.createObjectURL(content);
    a.download = `${title}.zip`;

    a.click();
}

document.querySelectorAll('.image-item .main__btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();

        const a = document.createElement("a");
        const fileUrl = btn.getAttribute('href');
        const imageTitle = btn.closest('.media-item').querySelector('.image-text').textContent.trim();

        a.href = fileUrl;
        a.download = imageTitle + fileUrl.substring(fileUrl.lastIndexOf('.'));

        a.click();
    });
});

async function downloadVisual(visualUrl, coverUrl, btn) {
    const zip = new JSZip();

    const fileName = getFileNameFromUrl(visualUrl);
    const visualData = await fetch(visualUrl).then(r => r.blob());
    const coverData = await fetch(coverUrl).then(r => r.blob());

    zip.file(fileName, visualData);
    zip.file('cover.png', coverData);

    const a = document.createElement("a");
    const content = await zip.generateAsync({ type: "blob" });
    const videoTitle = btn.closest('.media-item').querySelector('.video-text').textContent.trim();

    a.href = URL.createObjectURL(content);
    a.download = `${videoTitle}.zip`;

    a.click();
}

document.addEventListener("DOMContentLoaded", () => {
    const infoElement = document.getElementById("info");

    if (!infoElement) return;

    fetch(`info.json?cb=${Date.now()}`)
        .then(response => response.json())
        .then(data => {
            const title = 'site info:';
            const diskInfo = 
                `<br>used storage - ${data.used_gb} gb / ${data.total_gb} gb<br>` +
                `last updated - ${new Date(data.last_updated).toLocaleString().toLowerCase()} - ${data.last_commit_message}`;

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

function slugify(s) {
    s = s.trim().toLowerCase();
    s = s.replace(/[^a-z0-9_-]+/g, '_');
    s = s.replace(/_+/g, '_');
    s = s.replace(/^_+|_+$/g, '');

    return s;
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.startsWith("/audio/")) {
        const cover = document.querySelector('.audio-cover');

        if (cover) {
            cover.addEventListener('mouseenter', () => {
                cover.classList.add('hover-tilt');
            });

            cover.addEventListener('mouseleave', () => {
                cover.classList.remove('hover-tilt');
            });
        }
    }

    if (!window.location.pathname.endsWith("/audio")) {
        return;
    }
    
    document.querySelectorAll('.audio-item').forEach(item => {
        const cover = item.querySelector('.audio-cover');
        const text = item.querySelector('.audio-text');

        const goToAudioPage = () => {
            const title = text.textContent.split(' - ')[1];
            const slug = slugify(title);

            window.location.href = "/audio/" + encodeURIComponent(slug) + ".html";
        };
        
        cover.addEventListener('click', goToAudioPage);
        text.addEventListener('click', goToAudioPage);
    });
});

let outlineColor = "#000000";

document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 960) return;

    const canvas = document.getElementById("background");

    if (!canvas) return;

    const containerMaxWidth = 1300;
    const navbarHeight = 80;
    const normX = 0.75;
    const normY = 0.5;
    let cx, cy, scaleBase;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const containerWidth = Math.min(canvas.width, containerMaxWidth);
        const containerHeight = canvas.height - navbarHeight;
        const containerLeft = (canvas.width - containerWidth) / 2;
        const containerTop = navbarHeight;

        cx = containerWidth * normX + containerLeft;
        cy = containerHeight * normY + containerTop;
        scaleBase = containerWidth * 0.24;
    }

    resize();

    window.addEventListener('resize', resize);

    let framesPassed = 0;
    let clear = true;
    const ctx = canvas.getContext("2d");
    const numVertices = Math.floor(Math.random() * 64) + 64;
    const vertices = [];

    for (let i = 0; i < numVertices; i++) {
        const factor = Math.random() * 0.8 + 0.4;
    
        vertices.push([
            (Math.random() - 0.5) * 2 * factor,
            (Math.random() - 0.5) * 2 * factor,
            (Math.random() - 0.5) * 2 * factor
        ]);
    }

    function project(v) {
        const scale = scaleBase / (scaleBase + v[2] * 120 + 120);

        return {
            x: cx + v[0] * scaleBase * scale,
            y: cy + v[1] * scaleBase * scale
        };
    }

    let angleX = 0;
    let angleY = 0;

    function rotateVertex(v) {
        let [x, y, z] = v;

        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;

        y = y1; z = z1;

        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
        let x1 = x * cosY + z * sinY;
        let z2 = -x * sinY + z * cosY;

        x = x1; z = z2;

        return [x, y, z];
    }

    const numFaces = Math.floor(Math.random() * 4) + 4;
    const faces = [];

    for (let i = 0; i < numFaces; i++) {
        const face = [];
        const faceSize = Math.floor(Math.random() * 4) + 4;

        while (face.length < faceSize) {
            const v = Math.floor(Math.random() * numVertices);

            if (!face.includes(v)) face.push(v);
        }

        faces.push(face);
    }

    // funny.
  
    const texture = new Image();
    texture.src = "";
    let imgLoaded = false;
    texture.onload = () => { imgLoaded = true; };

    function draw() {
        framesPassed++;

        if (framesPassed == 720) {
            clear = Math.random() > 0.1;
            framesPassed = 0;
        }

        if (clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
      
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const projected = vertices.map(v => project(rotateVertex(v)));

        faces.forEach(f => {
            const pts = f.map(i => projected[i]);

            ctx.beginPath();

            ctx.moveTo(pts[0].x, pts[0].y);

            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);

            ctx.closePath();

            if (imgLoaded) {
                const minX = Math.min(...pts.map(p => p.x));
                const minY = Math.min(...pts.map(p => p.y));
                const maxX = Math.max(...pts.map(p => p.x));
                const maxY = Math.max(...pts.map(p => p.y));

                ctx.drawImage(texture, minX, minY, maxX - minX, maxY - minY);
            } else {
                ctx.fillStyle = "gray";

                ctx.fill();
            }

            ctx.strokeStyle = outlineColor;
            ctx.lineWidth = 1;

            ctx.stroke();
        });
    
        if (Math.random() < 0.2) {
            angleX += Math.random() * .018;
        } else {
            angleX += 0.009;
        }

        if (Math.random() > 0.8) {
            angleY += Math.random() * .018;
        } else {
            angleY += 0.009;
        }

        requestAnimationFrame(draw);
    }

    draw();
});