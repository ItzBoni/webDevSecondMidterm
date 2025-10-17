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

let characters;

// Routes
app.get('/', async (req, res) => {
  // Fetch characters from external API safely
  const [response, error] = await modules.safeResponse(api.get('/Characters'));

  if (error || !response || !response.data) {
    return res.render('index', { title: 'Home', characters: null });
  }

  // Map the API response into a small objects array for the view
  characters = response.data.map((c) => ({
    id: c.id || c.characterId || c.slug || 0,
    name: c.fullName || c.name || c.firstName || 'Unknown',
    role: c.title || c.role || c.house || '',
    img: c.imageUrl || c.image || '/placeholder-avatar.svg',
    description: c.family || c.description || ''
  }));

  res.render('index', { title: 'Home', characters });
});

app.post('/searchCharacter', async (req, res) => {
  const data = req.body.searchBar.trim().toLowerCase();
  // If no search term provided, redirect to home and stop further handling
  if (!data) {
    return res.redirect('/');
  }

  //If there are no characters stored (API error, go back to the home page)
  if (!characters || !Array.isArray(characters)) {
    return res.render('index', { title: 'Home', characters: null });
  }
  console.log(data);

  let characterSearch = [];

  // Iterates through the characters array for names that contain a similar string to the query
  characters.forEach((value) => {
    if(value.name.toLowerCase().includes(data)){
      characterSearch.push(value);
    }
  });

  // No match -> render home with empty results
  if (!characterSearch) {
    return res.render('index', { title: 'Home', characters: null });
  }
  
  return res.render('index', { title: 'Home', characters: characterSearch });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
