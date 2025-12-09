
if (deferredPrompt) {
deferredPrompt.prompt();
const { outcome } = await deferredPrompt.userChoice;
deferredPrompt = null;
installBtn.style.display = 'none';
console.log('Install outcome', outcome);
}



const notifyBtn = document.getElementById('notify-btn');
if (notifyBtn) {
notifyBtn.addEventListener('click', async () => {
if (!('Notification' in window)) return alert('Notifications not supported');
const perm = await Notification.requestPermission();
if (perm === 'granted') {
navigator.serviceWorker.ready.then(reg => {
reg.showNotification('Hello from PWA!', {
body: 'This is a simple push-like notification.',
icon: '/images/icons/icon-192x192.png',
tag: 'simple-notif'
});
});
}
});
}



// Theme / dark mode
const THEME_KEY = 'pwa-theme';
const defaultTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(defaultTheme);


function applyTheme(theme) {
document.documentElement.setAttribute('data-theme', theme);
localStorage.setItem(THEME_KEY, theme);
}


function toggleTheme() {
const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
applyTheme(next);
}


const themeToggle = document.getElementById('theme-toggle') || document.getElementById('theme-toggle-2');
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);


// Mobile menu
const menuToggle = document.getElementById('menu-toggle') || document.getElementById('menu-toggle-2');
if (menuToggle) menuToggle.addEventListener('click', () => document.body.classList.toggle('menu-open'));


// Load dynamic content
async function loadCards() {
const el = document.getElementById('cards');
if (!el) return;
try {
const res = await fetch('/data.json');
const items = await res.json();
el.innerHTML = items.map(item => (
`<article class="card" tabindex="0">
<img src="${item.image || '/images/icons/icon-192x192.png'}" alt="${item.title}" />
<div class="card-body">
<h3>${item.title}</h3>
<p>${item.description}</p>
</div>
</article>`
)).join('');
} catch (e) {
el.innerHTML = '<p class="muted">Could not load items — showing offline content.</p>';
}
}
loadCards();


// Simple animation: reveal on scroll
const observer = new IntersectionObserver((entries) => {
entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('reveal'); });
}, { threshold: 0.2 });
document.querySelectorAll('.card, .hero').forEach(n => observer.observe(n));