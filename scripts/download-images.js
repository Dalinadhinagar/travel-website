const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const downloads = [
  { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', dest: 'images/destinations/bali.jpg' },
  { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&q=80', dest: 'images/destinations/bali-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d325?w=800&q=80', dest: 'images/destinations/santorini.jpg' },
  { url: 'https://images.unsplash.com/photo-1570077188670-e3a8fbf47f22?w=1600&q=80', dest: 'images/destinations/santorini-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', dest: 'images/destinations/tokyo.jpg' },
  { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da29?w=1600&q=80', dest: 'images/destinations/tokyo-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', dest: 'images/destinations/paris.jpg' },
  { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d04?w=1600&q=80', dest: 'images/destinations/paris-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', dest: 'images/destinations/maldives.jpg' },
  { url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1600&q=80', dest: 'images/destinations/maldives-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1496442226666-8d0d0e62e056?w=800&q=80', dest: 'images/destinations/new-york.jpg' },
  { url: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1600&q=80', dest: 'images/destinations/new-york-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', dest: 'images/destinations/dubai.jpg' },
  { url: 'https://images.unsplash.com/photo-1582672060674-1ab04c8e0e69?w=1600&q=80', dest: 'images/destinations/dubai-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1580060839134-75a3edda2e64?w=800&q=80', dest: 'images/destinations/cape-town.jpg' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80', dest: 'images/destinations/cape-town-hero.jpg' },
  { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80', dest: 'images/hero-bg.jpg' },
  { url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80', dest: 'images/about/story.jpg' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80', dest: 'images/testimonials/sarah.jpg' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80', dest: 'images/testimonials/james.jpg' },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80', dest: 'images/testimonials/emma.jpg' },
  { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', dest: 'images/team/ceo.jpg' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', dest: 'images/team/coo.jpg' },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', dest: 'images/team/designer.jpg' },
];

async function download(url, dest) {
  const fullPath = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(fullPath, buf);
  console.log(`Saved ${dest}`);
}

(async () => {
  for (const item of downloads) {
    await download(item.url, item.dest);
  }
  console.log('Done.');
})();
