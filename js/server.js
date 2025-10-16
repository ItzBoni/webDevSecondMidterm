const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.post('/submit', (req, res) => {
  const data = req.body || {};
  // For demo we just re-render index with submitted data
  res.render('index', { title: 'Home', submitted: data });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
