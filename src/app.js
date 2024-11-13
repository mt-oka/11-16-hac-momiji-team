require('dotenv').config(); // .envファイルから環境変数を読み込み
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

app.post('/make', async (req, res) => {
  const { title, repo, recipe } = req.body;

  try {
    // 画像生成APIのリクエスト設定
    const response = await fetch(process.env.AI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `I'm creating a cost-effective meal by combining convenience store menu items. Please generate an image of the completed dish based on the ingredients. The title of the dish is '${title}', and the preparation method is as follows: ${recipe}.`, // タイトルやレシピの情報をプロンプトに使う
        n: 1,
        size: '1024x1024'
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url; // 生成された画像のURL

    // データベースに保存
    db.run(
      'INSERT INTO product (title, repo, recipe, image_url) VALUES (?, ?, ?, ?)',
      [title, repo, recipe, imageUrl],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Database error');
        } else {
          // 画像URLを含むレスポンスを返す
          res.redirect('/');
        }
      }
    );
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

app.listen(3000, () => {
  console.log('started on http://localhost:3000');
})