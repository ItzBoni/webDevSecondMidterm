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
  const data = req.body.searchBar;
  // If no search term provided, redirect to home and stop further handling
  if (!data) {
    return res.redirect('/');
  }

  // Ensure we have characters loaded from the GET handler
  if (!characters || !Array.isArray(characters)) {
    // Render home with no characters (safe fallback)
    return res.render('index', { title: 'Home', characters: null });
  }

  // normalize search term
  const query = data.trim().toLowerCase();

  console.log(query);

  // try exact/partial match
  const character = characters.find((value) => {
    //const name = value.name.trim().toLowerCase();
    console.log("Query: ", query);
    console.log("value: ", value.name.toLowerCase());
    console.log(value.name.toLowerCase().includes(query));
    console.log("\n")
    return value.name && value.name.toLowerCase().includes(query);
  });

  console.log(character);

  // No match -> render home with empty results
  if (!character) {
    return res.render('index', { title: 'Home', characters: null });
  }



  // render index with a single-result array (view expects an array)
  return res.render('index', { title: 'Home', characters: [character] });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
