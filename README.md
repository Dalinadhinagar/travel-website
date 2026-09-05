# Wanderlust — Travel Website

A colorful, interactive travel website built with **HTML**, **CSS**, **Bootstrap 5**, and vanilla JavaScript.

## Features

- Animated hero section with gradient backgrounds and floating shapes
- 8 curated destinations with photos, ratings, and pricing
- Live search and filter (region, activity, price range)
- Wishlist with localStorage persistence
- Destination detail pages with booking form (demo)
- Scroll animations (AOS library)
- Confetti celebration on booking and newsletter signup
- Responsive design for mobile and desktop
- Simple Express.js backend API

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero, search, featured destinations, testimonials |
| `destinations.html` | All destinations with filters |
| `destination-detail.html` | Single destination with booking form |
| `about.html` | Company story and team |
| `contact.html` | Contact form and info |

## Quick Start

### Option 1: With backend server (recommended)

```bash
cd travel-website
npm install
npm start
```

Open **http://localhost:3000** in your browser.

### Option 2: Open directly

Double-click `index.html` to open in your browser.  
Note: Some features (JSON loading) may need a local server due to browser security.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destinations` | List all destinations (supports `?q=`, `?region=`, `?tag=`, `?maxPrice=`) |
| GET | `/api/destinations/:id` | Get single destination |
| POST | `/api/bookings` | Create a demo booking |
| GET | `/api/bookings` | List all demo bookings |
| POST | `/api/contact` | Submit contact form |

## Tech Stack

- HTML5
- CSS3 (custom animations & gradients)
- Bootstrap 5.3
- Bootstrap Icons
- AOS (Animate On Scroll)
- Canvas Confetti
- Express.js (backend)
- Google Fonts (Poppins)

## Project Structure

```
travel-website/
├── index.html
├── destinations.html
├── destination-detail.html
├── about.html
├── contact.html
├── css/style.css
├── js/main.js
├── data/destinations.json
├── server.js
└── package.json
```
