// อังกะลุงมือถือ: เก็บแอปไว้ในเครื่อง เปิดได้แม้ไม่มีอินเทอร์เน็ต (ยกเว้นการบันทึกการเข้าใช้)
const CACHE = 'angklung-2026.11.23q';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;   // ไม่ยุ่งกับ Google Form / ฟอนต์
  if (req.mode === 'navigate') {
    // หน้าแอป: ใช้ฉบับล่าสุดจากเว็บก่อน ถ้าออฟไลน์ใช้ฉบับที่เก็บไว้
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
