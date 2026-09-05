const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const palette = {
  bali: ['#0ea5e9', '#06b6d4'],
  santorini: ['#6366f1', '#818cf8'],
  tokyo: ['#ec4899', '#f43f5e'],
  paris: ['#8b5cf6', '#a78bfa'],
  maldives: ['#14b8a6', '#2dd4bf'],
  'new-york': ['#f59e0b', '#f97316'],
  dubai: ['#eab308', '#facc15'],
  'cape-town': ['#10b981', '#34d399'],
};

function svg(label, colors, w = 800, h = 600) {
  const [c1, c2] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.8}" cy="${h * 0.2}" r="${Math.min(w, h) * 0.12}" fill="rgba(255,255,255,0.15)"/>
  <circle cx="${w * 0.15}" cy="${h * 0.75}" r="${Math.min(w, h) * 0.18}" fill="rgba(255,255,255,0.1)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Poppins, Arial, sans-serif" font-size="${Math.min(w, h) * 0.08}" font-weight="700">${label}</text>
</svg>`;
}

function avatarSvg(initials, colors) {
  const [c1, c2] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="60" fill="url(#g)"/>
  <text x="60" y="60" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Poppins, Arial, sans-serif" font-size="36" font-weight="700">${initials}</text>
</svg>`;
}

function write(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log(`Created ${rel}`);
}

const destinations = [
  ['bali', 'Bali'],
  ['santorini', 'Santorini'],
  ['tokyo', 'Tokyo'],
  ['paris', 'Paris'],
  ['maldives', 'Maldives'],
  ['new-york', 'New York'],
  ['dubai', 'Dubai'],
  ['cape-town', 'Cape Town'],
];

for (const [id, label] of destinations) {
  const colors = palette[id];
  write(`images/destinations/${id}.svg`, svg(label, colors, 800, 600));
  write(`images/destinations/${id}-hero.svg`, svg(label, colors, 1600, 900));
}

write('images/hero-bg.svg', svg('Wanderlust', ['#0f766e', '#0891b2'], 1920, 1080));
write('images/about/story.svg', svg('Our Story', ['#7c3aed', '#db2777'], 800, 600));
write('images/testimonials/sarah.svg', avatarSvg('SM', ['#ec4899', '#f97316']));
write('images/testimonials/james.svg', avatarSvg('JC', ['#3b82f6', '#06b6d4']));
write('images/testimonials/emma.svg', avatarSvg('ER', ['#8b5cf6', '#ec4899']));
write('images/team/ceo.svg', svg('Michael', ['#1d4ed8', '#2563eb'], 400, 400));
write('images/team/coo.svg', svg('Priya', ['#be185d', '#db2777'], 400, 400));
write('images/team/designer.svg', svg('David', ['#047857', '#059669'], 400, 400));

console.log('Done.');
