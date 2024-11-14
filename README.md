# progate-momiji

## Node.jsをインストールする

v20.11.0

## セットアップ

### Codeをクローンする

```bash
git clone git@github.com:mt-oka/progate-momiji.git
```

### ライブラリをインストールする

```bash
npm install
```

### ローカルサーバーを起動する

```bash
node src/app.js
```

変更のたびに ctrl + c でサーバーを停止し、再度起動してください。

## ディレクトリ構成

- app.js: サーバーの処理全部
- views: 見た目全部

## データベースの設定

### クライアントをインストールする

一旦SQLITEで書いてます・・・MySQLでもできるけど、コードも少し変えなきゃいけないかもしれない

```bash
brew install sqlite3
```

### データベースを作成する

```bash
sqlite3 database.sqlite
```

テーブル削除したいときは `drop table product;` みたいな感じでできます

### テーブルを作成する

`src/db/database.js`をみてください

ローカルサーバーを起動すると勝ってに実行されてテーブルも作成されます

## AIの設定

### API Keyを取得する

https://platform.openai.com/api-keys からAPI Keyを発行してください

※公開はしないでください

### 鍵を環境変数に設定する

`.env`ファイルを作成して下記のように設定してください

```
AI_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AI_API_ENDPOINT=https://api.openai.com/v1/images/generations
```
