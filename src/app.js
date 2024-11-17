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
});

app.get('/make', (req, res) => {
  res.render('make');
});

app.post('/make', async (req, res) => {
  const { title, repo, recipe } = req.body;

  async function translateAndGenerateImage(title, recipe, repo, res, db) {
    try {
      // DeepL APIを使用して翻訳
      const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        },
        body: new URLSearchParams({
          text: `コンビニ商品を組み合わせた料理です。タイトルは「${title}」、準備方法は次の通り：${recipe}。`,
          target_lang: 'EN', // 翻訳先の言語を指定
        }),
      });

      if (!deeplResponse.ok) throw new Error('DeepL API request failed');

      const deeplData = await deeplResponse.json();
      const translatedText = deeplData.translations[0].text;

      // 画像生成APIのリクエスト
      const response = await fetch(process.env.AI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: translatedText, // 翻訳されたプロンプトを使用
          n: 1,
          size: '1024x1024',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData); // 詳細なエラー内容を表示
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
            console.error('Database error:', err);
            res.status(500).send('Database error');
          } else {
            // 画像URLを含むレスポンスを返す
            res.redirect('/');
          }
        }
      );
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Process failed' });
    }
  }

  await translateAndGenerateImage(title, recipe, repo, res, db);
});

app.listen(3000, () => {
  console.log('started on http://localhost:3000');
});
