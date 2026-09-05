/* Wanderlust — Main JavaScript */

const API_URL = 'data/destinations.json';

let destinations = [];
let wishlist = JSON.parse(localStorage.getItem('wanderlust-wishlist') || '[]');

async function loadDestinations() {
  try {
    const res = await fetch(API_URL);
    destinations = await res.json();
    return destinations;
  } catch (err) {
    console.error('Failed to load destinations:', err);
    return [];
  }
}

function getTagClass(tag) {
  const map = {
    Beach: 'tag-beach',
    Culture: 'tag-culture',
    Food: 'tag-food',
    Nature: 'tag-nature',
    Romance: 'tag-culture',
    City: 'tag-default',
    Luxury: 'tag-beach',
    Adventure: 'tag-nature',
    Wellness: 'tag-nature',
    Islands: 'tag-beach',
    Sunset: 'tag-food',
    Shopping: 'tag-default',
    Broadway: 'tag-culture',
    Diving: 'tag-beach',
    Wine: 'tag-food',
  };
  return map[tag] || 'tag-default';
}

function renderDestinationCard(dest) {
  const isWishlisted = wishlist.includes(dest.id);
  const tags = dest.tags
    .map((t) => `<span class="tag-badge ${getTagClass(t)}">${t}</span>`)
    .join('');

  return `
    <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
      <div class="card destination-card h-100">
        <div class="card-img-wrapper">
          <img src="${dest.image}" alt="${dest.name}" loading="lazy">
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${dest.id}" aria-label="Add to wishlist">
            <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
          </button>
          <span class="card-img-overlay-badge">
            <i class="bi bi-star-fill"></i> ${dest.rating}
          </span>
        </div>
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h5 class="card-title fw-bold mb-0">${dest.name}</h5>
              <small class="text-muted"><i class="bi bi-geo-alt"></i> ${dest.country}</small>
            </div>
            <span class="fw-bold text-primary">$${dest.price}</span>
          </div>
          <p class="card-text text-muted small mb-3">${dest.description.substring(0, 80)}...</p>
          <div class="mb-3">${tags}</div>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted"><i class="bi bi-clock"></i> ${dest.duration}</small>
            <a href="destination-detail.html?id=${dest.id}" class="btn btn-gradient btn-sm">
              <span>Explore <i class="bi bi-arrow-right"></i></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedDestinations(containerId, limit = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const featured = destinations.slice(0, limit);
  container.innerHTML = featured.map(renderDestinationCard).join('');
  attachWishlistListeners();
  if (typeof AOS !== 'undefined') AOS.refresh();
}

function renderAllDestinations(containerId, filtered = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const list = filtered || destinations;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search display-1 text-muted"></i>
        <h4 class="mt-3">No destinations found</h4>
        <p class="text-muted">Try adjusting your filters</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(renderDestinationCard).join('');
  attachWishlistListeners();
  if (typeof AOS !== 'undefined') AOS.refresh();
}

function attachWishlistListeners() {
  document.querySelectorAll('.wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      toggleWishlist(id, btn);
    });
  });
}

function toggleWishlist(id, btn) {
  const index = wishlist.indexOf(id);
  const icon = btn.querySelector('i');

  if (index > -1) {
    wishlist.splice(index, 1);
    btn.classList.remove('active');
    icon.className = 'bi bi-heart';
    showToast('Removed from wishlist');
  } else {
    wishlist.push(id);
    btn.classList.add('active');
    icon.className = 'bi bi-heart-fill';
    showToast('Added to wishlist ❤️');
    btn.style.animation = 'none';
    btn.offsetHeight;
    btn.style.animation = 'pulseGlow 0.5s ease';
  }

  localStorage.setItem('wanderlust-wishlist', JSON.stringify(wishlist));
}

function showToast(message) {
  let toastEl = document.getElementById('wanderlust-toast');
  if (!toastEl) {
    const html = `
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
        <div id="wanderlust-toast" class="toast toast-wanderlust" role="alert">
          <div class="toast-body fw-semibold" id="toast-message"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    toastEl = document.getElementById('wanderlust-toast');
  }

  document.getElementById('toast-message').textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
  toast.show();
}

function initNavbar() {
  const navbar = document.querySelector('.navbar-wanderlust');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

function animateCounter(el, target) {
  let current = 0;
  const increment = target / 60;
  const suffix = el.dataset.suffix || '';
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 30);
}

function initHomeSearch() {
  const form = document.getElementById('hero-search-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-destination').value.trim();
    const region = document.getElementById('search-region').value;
    let url = 'destinations.html';
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (region) params.set('region', region);
    if (params.toString()) url += '?' + params.toString();
    window.location.href = url;
  });
}

function initDestinationFilters() {
  const grid = document.getElementById('destinations-grid');
  if (!grid) return;

  const searchInput = document.getElementById('filter-search');
  const regionChips = document.querySelectorAll('[data-filter-region]');
  const tagChips = document.querySelectorAll('[data-filter-tag]');
  const priceRange = document.getElementById('filter-price');
  const priceLabel = document.getElementById('price-label');

  const params = new URLSearchParams(window.location.search);
  let activeRegion = params.get('region') || '';
  let activeTag = '';
  let searchQuery = params.get('q') || '';

  if (searchInput && searchQuery) searchInput.value = searchQuery;
  if (activeRegion) {
    regionChips.forEach((c) => {
      if (c.dataset.filterRegion === activeRegion) c.classList.add('active');
    });
  }

  function applyFilters() {
    let filtered = [...destinations];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeRegion) {
      filtered = filtered.filter((d) => d.region === activeRegion);
    }

    if (activeTag) {
      filtered = filtered.filter((d) => d.tags.includes(activeTag));
    }

    if (priceRange) {
      const maxPrice = parseInt(priceRange.value, 10);
      filtered = filtered.filter((d) => d.price <= maxPrice);
      if (priceLabel) priceLabel.textContent = `Up to $${maxPrice.toLocaleString()}`;
    }

    renderAllDestinations('destinations-grid', filtered);
    document.getElementById('result-count').textContent = filtered.length;
  }

  if (searchInput) {
    searchInput.addEventListener(
      'input',
      debounce((e) => {
        searchQuery = e.target.value.trim();
        applyFilters();
      }, 300)
    );
  }

  regionChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      regionChips.forEach((c) => c.classList.remove('active'));
      if (activeRegion === chip.dataset.filterRegion) {
        activeRegion = '';
      } else {
        activeRegion = chip.dataset.filterRegion;
        chip.classList.add('active');
      }
      applyFilters();
    });
  });

  tagChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      tagChips.forEach((c) => c.classList.remove('active'));
      if (activeTag === chip.dataset.filterTag) {
        activeTag = '';
      } else {
        activeTag = chip.dataset.filterTag;
        chip.classList.add('active');
      }
      applyFilters();
    });
  });

  if (priceRange) {
    priceRange.addEventListener('input', applyFilters);
  }

  applyFilters();
}

async function initDetailPage() {
  const container = document.getElementById('detail-content');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = 'destinations.html';
    return;
  }

  await loadDestinations();
  const dest = destinations.find((d) => d.id === id);

  if (!dest) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h2>Destination not found</h2>
        <a href="destinations.html" class="btn btn-gradient mt-3"><span>Back to Destinations</span></a>
      </div>
    `;
    return;
  }

  document.title = `${dest.name} — Wanderlust`;

  const tags = dest.tags
    .map((t) => `<span class="tag-badge ${getTagClass(t)}">${t}</span>`)
    .join('');

  const highlights = dest.highlights
    .map((h) => `<div class="highlight-item"><i class="bi bi-check-circle-fill text-success me-2"></i>${h}</div>`)
    .join('');

  container.innerHTML = `
    <div class="detail-hero" data-aos="fade-in">
      <img src="${dest.hero}" alt="${dest.name}">
      <div class="detail-hero-overlay">
        <div class="text-white">
          <h1 class="display-4 fw-bold">${dest.name}</h1>
          <p class="lead mb-0"><i class="bi bi-geo-alt"></i> ${dest.country} &bull; ${dest.duration}</p>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <div data-aos="fade-up">
            <div class="d-flex flex-wrap gap-2 mb-3">${tags}</div>
            <div class="d-flex align-items-center gap-3 mb-4">
              <span class="badge bg-warning text-dark fs-6"><i class="bi bi-star-fill"></i> ${dest.rating}</span>
              <span class="text-muted"><i class="bi bi-thermometer-half"></i> ${dest.climate}</span>
              <span class="text-muted"><i class="bi bi-globe"></i> ${dest.region}</span>
            </div>
            <h3 class="section-title mb-3">About ${dest.name}</h3>
            <p class="text-muted fs-5 mb-4">${dest.description}</p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h4 class="fw-bold mb-3">Trip Highlights</h4>
            ${highlights}
          </div>

          <div class="mt-5" data-aos="fade-up" data-aos-delay="200">
            <h4 class="fw-bold mb-3">Gallery</h4>
            <div class="row g-3">
              <div class="col-6">
                <img src="${dest.image}" class="img-fluid rounded-4 shadow" alt="${dest.name}">
              </div>
              <div class="col-6">
                <img src="${dest.hero}" class="img-fluid rounded-4 shadow" alt="${dest.name} view">
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="booking-card" data-aos="fade-left">
            <h4 class="fw-bold mb-1">Book This Trip</h4>
            <p class="text-muted small mb-4">Demo booking — no real payment</p>
            <div class="d-flex justify-content-between align-items-center mb-4">
              <span class="text-muted">From</span>
              <span class="display-6 fw-bold text-primary">$${dest.price}</span>
            </div>
            <form id="booking-form">
              <div class="mb-3">
                <label class="form-label fw-semibold">Check-in</label>
                <input type="date" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Check-out</label>
                <input type="date" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Guests</label>
                <select class="form-select">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>
              <button type="submit" class="btn btn-gradient w-100 pulse-glow">
                <span><i class="bi bi-calendar-check"></i> Book Now</span>
              </button>
            </form>
            <p class="text-center text-muted small mt-3 mb-0">
              <i class="bi bi-shield-check"></i> Free cancellation up to 48 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast(`🎉 Booking confirmed for ${dest.name}! (Demo)`);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  });

  if (typeof AOS !== 'undefined') AOS.refresh();
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you soon.');
    form.reset();
  });
}

function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('🎉 Welcome to the Wanderlust newsletter!');
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.8 } });
    }
    form.reset();
  });
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initCounters();
  initHomeSearch();
  initContactForm();
  initNewsletter();

  await loadDestinations();

  if (document.getElementById('featured-destinations')) {
    renderFeaturedDestinations('featured-destinations');
  }

  if (document.getElementById('destinations-grid')) {
    initDestinationFilters();
  }

  await initDetailPage();

  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 80 });
  }
});
