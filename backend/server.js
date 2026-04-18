const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

app.get('/dashboard', (req, res) => {
  console.log('GET /dashboard route hit');
  res.json({
    totalAudience: 45000,
    congestionIndex: 60,
    recommendedGate: 'Gate 2'
  });
});

app.get('/food', (req, res) => {
  res.json([
    { name: 'Burger Point', waitTime: 10 },
    { name: 'Pizza Hub', waitTime: 6 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
