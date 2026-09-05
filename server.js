const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const dataPath = path.join(__dirname, 'data', 'destinations.json');

function loadDestinations() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// API: Get all destinations (with optional filters)
app.get('/api/destinations', (req, res) => {
  let destinations = loadDestinations();
  const { q, region, tag, maxPrice } = req.query;

  if (q) {
    const query = q.toLowerCase();
    destinations = destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.country.toLowerCase().includes(query) ||
        d.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (region) {
    destinations = destinations.filter((d) => d.region === region);
  }

  if (tag) {
    destinations = destinations.filter((d) => d.tags.includes(tag));
  }

  if (maxPrice) {
    destinations = destinations.filter((d) => d.price <= parseInt(maxPrice, 10));
  }

  res.json(destinations);
});

// API: Get single destination by ID
app.get('/api/destinations/:id', (req, res) => {
  const destinations = loadDestinations();
  const dest = destinations.find((d) => d.id === req.params.id);

  if (!dest) {
    return res.status(404).json({ error: 'Destination not found' });
  }

  res.json(dest);
});

// API: Demo booking endpoint
const bookings = [];

app.post('/api/bookings', (req, res) => {
  const { destinationId, checkIn, checkOut, guests } = req.body;

  if (!destinationId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const destinations = loadDestinations();
  const dest = destinations.find((d) => d.id === destinationId);

  if (!dest) {
    return res.status(404).json({ error: 'Destination not found' });
  }

  const booking = {
    id: `BK-${Date.now()}`,
    destinationId,
    destinationName: dest.name,
    checkIn,
    checkOut,
    guests: guests || 1,
    totalPrice: dest.price,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  res.status(201).json({ message: 'Booking confirmed!', booking });
});

// API: Get all bookings (demo)
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// API: Contact form (demo)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  res.json({ message: 'Message received! We\'ll get back to you soon.' });
});

app.listen(PORT, () => {
  console.log(`\n  ✈️  Wanderlust Travel Website`);
  console.log(`  🌐  Open http://localhost:${PORT} in your browser\n`);
});
