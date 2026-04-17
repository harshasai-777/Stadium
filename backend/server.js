const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const densityFromCount = (count) => {
  if (count >= 3800) return 'crowded';
  if (count >= 1800) return 'medium';
  return 'safe';
};

// --- Mock Database State --- //
let audience = 45230;
let maxAudience = 50000;

let stadium = {
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
};

let foodVendors = [
  {
    id: 1, name: 'Burger Point', type: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    waitTime: 15, rating: '4.5/5', status: 'medium',
    menu: [{ id: 'b1', name: 'Classic Beef Burger', price: 12 }, { id: 'b2', name: 'Smoky BBQ Burger', price: 14 }, { id: 'b3', name: 'Crispy Chicken Burger', price: 13 }]
  },
  {
    id: 2, name: 'Pizza Corner', type: 'pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    waitTime: 30, rating: '4.8/5', status: 'crowded',
    menu: [{ id: 'p1', name: 'Margherita Slice', price: 10 }, { id: 'p2', name: 'Pepperoni Slice', price: 11 }, { id: 'p3', name: 'Farmhouse Pizza', price: 13 }]
  },
  {
    id: 3, name: 'Refreshments', type: 'drinks',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80',
    waitTime: 5, rating: '4.0/5', status: 'safe',
    menu: [{ id: 'd1', name: 'Fresh Lime Soda', price: 4 }, { id: 'd2', name: 'Cold Coffee', price: 5 }, { id: 'd3', name: 'Energy Drink', price: 6 }]
  },
  {
    id: 4, name: 'Biryani House', type: 'rice',
    image: '/biryani_house.png',
    waitTime: 18, rating: '4.7/5', status: 'medium',
    menu: [{ id: 'r1', name: 'Chicken Biryani Bowl', price: 15 }, { id: 'r2', name: 'Paneer Biryani Bowl', price: 13 }, { id: 'r3', name: 'Raita Combo', price: 3 }]
  },
  {
    id: 5, name: 'Taco Bay', type: 'mexican',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80',
    waitTime: 11, rating: '4.4/5', status: 'medium',
    menu: [{ id: 'm1', name: 'Chicken Taco', price: 9 }, { id: 'm2', name: 'Veg Taco', price: 8 }, { id: 'm3', name: 'Nachos & Salsa', price: 7 }]
  },
  {
    id: 6, name: 'Sweet Spot', type: 'dessert',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
    waitTime: 7, rating: '4.6/5', status: 'safe',
    menu: [{ id: 's1', name: 'Chocolate Brownie', price: 6 }, { id: 's2', name: 'Soft Serve Sundae', price: 7 }, { id: 's3', name: 'Churros', price: 6 }]
  }
];

// --- Server Cycle Simulator --- //
function simulateData() {
  const audienceChange = Math.floor(Math.random() * 100) - 50;
  audience = clamp(audience + audienceChange, 10000, maxAudience);

  Object.keys(stadium.sections).forEach(section => {
    const change = Math.floor(Math.random() * 200) - 100;
    const count = clamp(stadium.sections[section].count + change, 100, 8000);
    stadium.sections[section] = { count, density: densityFromCount(count) };
  });

  Object.keys(stadium.gates).forEach(gate => {
    const change = Math.floor(Math.random() * 40) - 20;
    stadium.gates[gate].crowd = clamp(stadium.gates[gate].crowd + change, 0, 500);
  });

  foodVendors.forEach(vendor => {
    const timeChange = Math.floor(Math.random() * 5) - 2;
    vendor.waitTime = clamp(vendor.waitTime + timeChange, 2, 45);
    if (vendor.waitTime >= 25) vendor.status = 'crowded';
    else if (vendor.waitTime >= 12) vendor.status = 'medium';
    else vendor.status = 'safe';
  });
}

// --- Routes --- //

app.get('/dashboard', (req, res) => {
  simulateData();
  
  // Calculate dynamic congestion
  const sectionScore = Object.values(stadium.sections).reduce((acc, section) => {
    if (section.density === 'crowded') return acc + 35;
    if (section.density === 'medium') return acc + 18;
    return acc + 6;
  }, 0);
  const gateScore = Object.values(stadium.gates).reduce((acc, gate) => acc + gate.crowd, 0) / 10;
  const congestionIndex = clamp(Math.round((sectionScore + gateScore) / 5), 0, 100);
  
  const bestGateEntry = Object.entries(stadium.gates).sort((a, b) => a[1].crowd - b[1].crowd)[0];
  const recommendedGate = bestGateEntry ? bestGateEntry[0].replace('Gate', 'Gate ') : 'Gate 1';

  res.json({
    audience,
    congestion: congestionIndex,
    gate: recommendedGate,
    stadium
  });
});

app.get('/food', (req, res) => {
  res.json(foodVendors);
});

app.listen(PORT, () => {
  console.log(`Backend simulation server running at http://localhost:${PORT}`);
});
