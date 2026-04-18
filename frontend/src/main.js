import './style.css';
import { renderHome } from './views/home.js';
import { renderStadium } from './views/stadium.js';
import { renderFood } from './views/food.js';
import { renderEmergency } from './views/emergency.js';

const API = import.meta.env.VITE_API_URL;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const densityFromCount = (count) => {
  if (count >= 3800) return 'crowded';
  if (count >= 1800) return 'medium';
  return 'safe';
};

function formatScore(match) {
  return `${match.runs}/${match.wickets} (${match.overs}.${match.balls} Overs)`;
}

function formatClock(date = new Date()) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Vanilla hooks-style helpers used to manage state/effects cleanly.
function useState(initialValue) {
  let value = initialValue;
  const getValue = () => value;
  const setValue = (nextValue) => {
    value = typeof nextValue === 'function' ? nextValue(value) : nextValue;
    return value;
  };
  return [getValue, setValue];
}

function useEffect(effectCallback) {
  const cleanup = effectCallback();
  return typeof cleanup === 'function' ? cleanup : () => {};
}

function normalizeFoodVendors(rawFood) {
  if (!Array.isArray(rawFood)) return [];

  return rawFood.map((vendor, index) => {
    const waitTime = Number(vendor.waitTime) || 10;
    let status = 'safe';
    if (waitTime >= 25) status = 'crowded';
    else if (waitTime >= 12) status = 'medium';

    const menuFromApi = Array.isArray(vendor.menu) ? vendor.menu : [];
    const menu = (menuFromApi.length > 0 ? menuFromApi : [
      { id: `m-${index + 1}-1`, name: 'Regular Combo', price: 220 },
      { id: `m-${index + 1}-2`, name: 'Premium Combo', price: 320 },
      { id: `m-${index + 1}-3`, name: 'Beverage', price: 120 }
    ]).map((item, itemIndex) => ({
      id: item.id || `m-${index + 1}-${itemIndex + 1}`,
      name: item.name || `Item ${itemIndex + 1}`,
      price: Number(item.price) || 200
    }));

    return {
      id: Number(vendor.id) || (index + 1),
      name: vendor.name || `Vendor ${index + 1}`,
      type: vendor.type || 'snacks',
      image: vendor.image || 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
      waitTime,
      rating: vendor.rating || '4.2/5',
      status: vendor.status || status,
      menu
    };
  });
}

// ---- GLOBAL STATE & SIMULATOR ---- //
export const AppState = {
  isLoading: true,
  error: null,
  activeRoute: 'home',

  // Match Info
  match: {
    teamA: 'India',
    teamB: 'Australia',
    runs: 142,
    wickets: 3,
    overs: 15,
    balls: 2,
    score: '142/3 (15.2 Overs)',
    audience: 45230,
    maxAudience: 50000
  },

  system: {
    lastUpdated: formatClock(),
    congestionIndex: 42,
    recommendedGate: 'Gate 3',
    connectivity: 'stable'
  },
  config: {
    apiBase: API
  },

  // Alerts shown across views
  alerts: [],

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
    {
      id: 1,
      name: 'Burger Point',
      type: 'burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
      waitTime: 15,
      rating: '4.5/5',
      status: 'medium',
      menu: [
        { id: 'b1', name: 'Classic Beef Burger', price: 320 },
        { id: 'b2', name: 'Smoky BBQ Burger', price: 360 },
        { id: 'b3', name: 'Crispy Chicken Burger', price: 340 }
      ]
    },
    {
      id: 2,
      name: 'Pizza Corner',
      type: 'pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      waitTime: 30,
      rating: '4.8/5',
      status: 'crowded',
      menu: [
        { id: 'p1', name: 'Margherita Slice', price: 240 },
        { id: 'p2', name: 'Pepperoni Slice', price: 280 },
        { id: 'p3', name: 'Farmhouse Pizza', price: 320 }
      ]
    },
    {
      id: 3,
      name: 'Refreshments',
      type: 'drinks',
      image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80',
      waitTime: 5,
      rating: '4.0/5',
      status: 'safe',
      menu: [
        { id: 'd1', name: 'Fresh Lime Soda', price: 90 },
        { id: 'd2', name: 'Cold Coffee', price: 160 },
        { id: 'd3', name: 'Energy Drink', price: 180 }
      ]
    },
    {
      id: 4,
      name: 'Biryani House',
      type: 'rice',
      image: '/biryani_house.png',
      waitTime: 18,
      rating: '4.7/5',
      status: 'medium',
      menu: [
        { id: 'r1', name: 'Chicken Biryani Bowl', price: 380 },
        { id: 'r2', name: 'Paneer Biryani Bowl', price: 340 },
        { id: 'r3', name: 'Raita Combo', price: 70 }
      ]
    },
    {
      id: 5,
      name: 'Taco Bay',
      type: 'mexican',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80',
      waitTime: 11,
      rating: '4.4/5',
      status: 'medium',
      menu: [
        { id: 'm1', name: 'Chicken Taco', price: 220 },
        { id: 'm2', name: 'Veg Taco', price: 190 },
        { id: 'm3', name: 'Nachos & Salsa', price: 210 }
      ]
    },
    {
      id: 6,
      name: 'Sweet Spot',
      type: 'dessert',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
      waitTime: 7,
      rating: '4.6/5',
      status: 'safe',
      menu: [
        { id: 's1', name: 'Chocolate Brownie', price: 170 },
        { id: 's2', name: 'Soft Serve Sundae', price: 190 },
        { id: 's3', name: 'Churros', price: 180 }
      ]
    }
  ],
  
  // Custom Event Target for Pub/Sub
  events: new EventTarget()
};

function buildAlerts() {
  const now = new Date();
  const time = formatClock(now);
  const nextAlerts = [];

  const crowdedSections = Object.entries(AppState.stadium.sections)
    .filter(([, value]) => value.density === 'crowded')
    .map(([name]) => name);

  if (crowdedSections.length > 0) {
    nextAlerts.push({
      id: `sec-${now.getTime()}`,
      level: 'warning',
      message: `High density in ${crowdedSections.join(', ')}`,
      time
    });
  }

  const crowdedGates = Object.entries(AppState.stadium.gates)
    .filter(([, value]) => value.crowd >= 180)
    .map(([name, gate]) => `${name.replace('Gate', 'Gate ')} (${gate.crowd})`);

  if (crowdedGates.length > 0) {
    nextAlerts.push({
      id: `gate-${now.getTime() + 1}`,
      level: 'warning',
      message: `Queue pressure at ${crowdedGates.join(', ')}`,
      time
    });
  }

  const fastestVendor = [...AppState.foodVendors].sort((a, b) => a.waitTime - b.waitTime)[0];
  if (fastestVendor) {
    nextAlerts.push({
      id: `food-${now.getTime() + 2}`,
      level: 'info',
      message: `Fastest food pickup: ${fastestVendor.name} (${fastestVendor.waitTime}m)`,
      time
    });
  }

  AppState.alerts = [...nextAlerts, ...AppState.alerts].slice(0, 6);
}

function updateInsights() {
  const allSections = Object.values(AppState.stadium.sections);
  const sectionScore = allSections.reduce((acc, section) => {
    if (section.density === 'crowded') return acc + 35;
    if (section.density === 'medium') return acc + 18;
    return acc + 6;
  }, 0);

  const gateScore = Object.values(AppState.stadium.gates)
    .reduce((acc, gate) => acc + gate.crowd, 0) / 10;

  AppState.system.congestionIndex = clamp(Math.round((sectionScore + gateScore) / 5), 0, 100);

  const bestGate = Object.entries(AppState.stadium.gates)
    .sort((a, b) => a[1].crowd - b[1].crowd)[0];
  AppState.system.recommendedGate = bestGate ? bestGate[0].replace('Gate', 'Gate ') : 'Gate 1';

  AppState.system.lastUpdated = formatClock();
}

function syncGlobalStatus() {
  const statusEl = document.getElementById('global-status-text');
  if (statusEl) {
    if (AppState.isLoading) {
      statusEl.textContent = 'Loading...';
      return;
    }
    if (AppState.error) {
      statusEl.textContent = `Error: ${AppState.error}`;
      return;
    }
    const stateText = AppState.system.congestionIndex > 68 ? 'Attention Needed' : 'Live: Match Ongoing';
    statusEl.textContent = `${stateText} | Updated ${AppState.system.lastUpdated}`;
  }
}

async function fetchData() {
  try {
    AppState.isLoading = !getHasLoadedOnce();
    syncGlobalStatus();

    const [dashboardRes, foodRes] = await Promise.all([
      fetch(`${API}/dashboard`).catch(() => null),
      fetch(`${API}/food`).catch(() => null)
    ]);

    if (!dashboardRes || !foodRes || !dashboardRes.ok || !foodRes.ok) {
      throw new Error('API request failed');
    }

    const dashboardData = await dashboardRes.json();
    const foodData = await foodRes.json();

    if (typeof dashboardData.audience === 'number') AppState.match.audience = dashboardData.audience;
    if (typeof dashboardData.totalAudience === 'number') AppState.match.audience = dashboardData.totalAudience;
    if (typeof dashboardData.maxAudience === 'number') AppState.match.maxAudience = dashboardData.maxAudience;
    if (typeof dashboardData.congestion === 'number') AppState.system.congestionIndex = dashboardData.congestion;
    if (typeof dashboardData.congestionIndex === 'number') AppState.system.congestionIndex = dashboardData.congestionIndex;
    if (dashboardData.gate) AppState.system.recommendedGate = dashboardData.gate;
    if (dashboardData.recommendedGate) AppState.system.recommendedGate = dashboardData.recommendedGate;
    if (dashboardData.lastUpdated) AppState.system.lastUpdated = formatClock(new Date(dashboardData.lastUpdated));
    
    if (dashboardData.stadium) AppState.stadium = dashboardData.stadium;

    if (Array.isArray(foodData)) {
      AppState.foodVendors = normalizeFoodVendors(foodData);
    } else if (foodData.vendors) {
      AppState.foodVendors = normalizeFoodVendors(foodData.vendors);
    }

    setHasLoadedOnce(true);
    AppState.isLoading = false;
    AppState.error = null;

  } catch (err) {
    AppState.error = err.message || 'Backend connection failed. Please start the backend server.';
    AppState.isLoading = false;
  }

  updateInsights();
  buildAlerts();
  syncGlobalStatus();
  AppState.events.dispatchEvent(new CustomEvent('stateChanged', { detail: AppState }));
}

AppState.match.score = formatScore(AppState.match);
updateInsights();
buildAlerts();
syncGlobalStatus();

const [getHasLoadedOnce, setHasLoadedOnce] = useState(false);
let stopSync = () => {};

export function startDataSync() {
  stopSync = useEffect(() => {
    fetchData();
    const fetchInterval = setInterval(fetchData, 5000);
    return () => clearInterval(fetchInterval);
  });
}

export function stopDataSync() {
  stopSync();
  stopSync = () => {};
}

startDataSync();

// ---- ROUTER ---- //
const routes = {
  'home': renderHome,
  'stadium': renderStadium,
  'food': renderFood,
  'emergency': renderEmergency
};

let mountedView = null;

function navigateTo(route) {
  if (!routes[route]) return;
  AppState.activeRoute = route;

  if (mountedView && typeof mountedView.onUnmount === 'function') {
    mountedView.onUnmount();
  }

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
  mountedView = viewContainer;
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
