const path = require('path');
const express = require('express');
const axios = require('axios');
const modules = require('./modules');
const https = require('https');

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
app.get("/characters", async (req, res) => {
    const [response, error] = await modules.safeResponse(api.get('/Characters'));
    if (error) {
        return res.status(500).send("Error fetching characters");
    } else {
        const characters = response.data;
    }
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});



app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
