const express = require('express');
const db = require('./db/database');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
// form send data
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  db.all('SELECT * FROM product', (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      res.render('index', { products: rows });
    }
  });
})

app.get('/make', (req, res) => {
  res.render('make');
})

app.post('/make', (req, res) => {
  console.log(req.body);
  db.run('INSERT INTO product (title, repo, recipe) VALUES (?, ?, ?)', req.body.title, req.body.repo, req.body.recipe, (err) => {
    if (err) {
      console.error(err);
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  })
})

app.listen(3000, () => {
  console.log('started on http://localhost:3000');
})