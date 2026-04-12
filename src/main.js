import './style.css';
import { renderHome } from './views/home.js';
import { renderStadium } from './views/stadium.js';
import { renderFood } from './views/food.js';
import { renderEmergency } from './views/emergency.js';

// ---- GLOBAL STATE & SIMULATOR ---- //
export const AppState = {
  activeRoute: 'home',
  
  // Match Info
  match: {
    teamA: 'India',
    teamB: 'Australia',
    score: '142/3 (15.2 Overs)',
    audience: 45230,
    maxAudience: 50000
  },

  // Sections Data for Map (Randomized periodically)
  stadium: {
    sections: {
      'NorthStand': { density: 'safe', count: 1200 },
      'SouthStand': { density: 'crowded', count: 4800 },
      'EastPavilion': { density: 'medium', count: 2500 },
      'WestPavilion': { density: 'safe', count: 900 }
    },
    gates: {
      'Gate1': { crowd: 50 },
      'Gate2': { crowd: 250 },
      'Gate3': { crowd: 10 }
    }
  },

  // Food Services Data
  foodVendors: [
    { id: 1, name: 'Burger Point', type: 'burger', waitTime: 15, rating: '4.5/5', status: 'medium' },
    { id: 2, name: 'Pizza Corner', type: 'pizza', waitTime: 30, rating: '4.8/5', status: 'crowded' },
    { id: 3, name: 'Refreshments', type: 'drinks', waitTime: 5, rating: '4.0/5', status: 'safe' }
  ],
  
  // Custom Event Target for Pub/Sub
  events: new EventTarget()
};

// Simulate Real-time Data
setInterval(() => {
  // Update audience
  AppState.match.audience += Math.floor(Math.random() * 20) - 10;
  
  // Randomize section densities
  const densities = ['safe', 'medium', 'crowded'];
  for (let key in AppState.stadium.sections) {
    if(Math.random() > 0.7) {
       AppState.stadium.sections[key].density = densities[Math.floor(Math.random() * densities.length)];
    }
    // fluctuate count
    AppState.stadium.sections[key].count += Math.floor(Math.random() * 100) - 50;
  }

  // Randomize gate crowds
  for (let key in AppState.stadium.gates) {
    let change = Math.floor(Math.random() * 20) - 10;
    AppState.stadium.gates[key].crowd = Math.max(0, AppState.stadium.gates[key].crowd + change);
  }

  // Randomize food wait times
  AppState.foodVendors.forEach(v => {
    if(Math.random() > 0.5) {
      v.waitTime = Math.max(2, v.waitTime + (Math.floor(Math.random() * 5) - 2));
      if (v.waitTime < 10) v.status = 'safe';
      else if (v.waitTime < 25) v.status = 'medium';
      else v.status = 'crowded';
    }
  });

  // Dispatch custom update event
  AppState.events.dispatchEvent(new CustomEvent('stateChanged'));
}, 3000);


// ---- ROUTER ---- //
const routes = {
  'home': renderHome,
  'stadium': renderStadium,
  'food': renderFood,
  'emergency': renderEmergency
};

function navigateTo(route) {
  if (!routes[route]) return;
  AppState.activeRoute = route;
  
  // Update UI active states
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.route === route) {
      el.classList.add('active');
    }
  });

  // Render content
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = ''; // clear

  const viewContainer = document.createElement('div');
  viewContainer.className = 'view active';
  
  mainContent.appendChild(viewContainer);
  routes[route](viewContainer, AppState);
}

// Global Nav Handlers
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const route = e.currentTarget.dataset.route;
    navigateTo(route);
  });
});

// Init
navigateTo('home');
