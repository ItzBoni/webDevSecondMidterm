const path = require('path');
const express = require('express');
const axios = require('axios');
const modules = require('./modules');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
const api = axios.create({
  baseURL: 'https://thronesapi.com/api/v2'
});

// Routes
app.get('/', async (req, res) => {
  // Fetch characters from external API safely
  const [response, error] = await modules.safeResponse(api.get('/Characters'));

  if (error || !response || !response.data) {
    // Fallback: provide local sample characters if the API fails
    const sample = [
      { id: 1, fullName: 'Alice', title: 'Explorer', imageUrl: '/placeholder-avatar.svg', family: 'None' },
      { id: 2, fullName: 'Boni', title: 'Developer', imageUrl: '/placeholder-avatar.svg', family: 'Team' },
      { id: 3, fullName: 'Cato', title: 'Guide', imageUrl: '/placeholder-avatar.svg', family: 'Guild' }
    ];
    return res.render('index', { title: 'Home', characters: sample });
  }

  // Map the API response into a small objects array for the view
  const characters = response.data.map((c) => ({
    id: c.id || c.characterId || c.slug || Math.random().toString(36).slice(2, 8),
    name: c.fullName || c.name || c.firstName || 'Unknown',
    role: c.title || c.role || c.house || '',
    img: c.imageUrl || c.image || '/placeholder-avatar.svg',
    description: c.family || c.description || ''
  }));

  res.render('index', { title: 'Home', characters });
});

app.post('/submit', (req, res) => {
  const data = req.body || {};
  // For demo we just re-render index with submitted data, and no characters
  res.render('index', { title: 'Home', submitted: data, characters: [] });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
