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

  characters = response.data;

  res.render('index', { title: 'Home', characters });
});

app.post('/searchCharacter', async (req, res) => {
  const data = req.body.searchBar.trim().toLowerCase();

  if (!data) {
    return res.redirect('/');
  }

  let characterSearch = [];

  // Iterates through the characters array for names that contain a similar string to the query
  characters.forEach((value) => {
    if(value.fullName.toLowerCase().includes(data)){
      characterSearch.push(value);
    }
  });

  // No match -> render home with empty results
  if (!characterSearch) {
    return res.render('index', { title: 'Home', characters: null });
  }
  
  return res.render('index', { title: 'Home', characters: characterSearch });
});

app.get('/getSingleCharacter', async (req, res) => {
  const id = req.query.id;

  if (!id) return res.status(400).send('Missing id');

  let singleCharacter = null;

  singleCharacter = characters.find((value) => String(value.id) === String(id));

  if (!singleCharacter) {
    return res.status(404).send('Character not found');
  }
  console.log(singleCharacter);

  return res.render('partials/single_character', { character: singleCharacter });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
