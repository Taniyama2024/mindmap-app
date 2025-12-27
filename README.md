# マインドマップWebアプリ

個人用のマインドマップツールです。React + react-flow + Supabase で構築されています。

## 主な機能

- 🧠 **マインドマップ作成・編集** - ノードとエッジを使った直感的なマインドマップ
- 🎨 **自由なスタイル設定** - フォントサイズ、文字色、背景色をノードごとにカスタマイズ
- 🔒 **パスワード保護** - データは暗号化されてSupabaseに保存
- 📱 **レスポンシブ対応** - PC・スマートフォンの両方で利用可能
- 💾 **自動保存** - 編集内容は5秒後に自動保存

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editorで `supabase-setup.sql` の内容を実行してテーブルを作成
3. プロジェクトのAPIキーを取得

### 3. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、以下の値を設定:

```env
VITE_SUPABASE_URL=あなたのSupabaseプロジェクトURL
VITE_SUPABASE_ANON_KEY=あなたのSupabase匿名キー
VITE_APP_PASSWORD=任意のパスワード
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

## Supabaseテーブルの作成

Supabaseダッシュボードの「SQL Editor」で以下を実行:

```sql
-- supabase-setup.sql の内容をコピー&ペースト
```

または、`supabase-setup.sql` ファイルの内容を実行してください。

## 使い方

1. **ログイン**: 環境変数で設定したパスワードを入力
2. **ノード追加**: 「ノードを追加」ボタンをクリック
3. **ノード編集**: 
   - ノードをダブルクリックでテキスト編集
   - ノードを選択して右パネルでスタイル編集
4. **エッジ追加**: ノードのハンドル（●）をドラッグして接続
5. **保存**: 自動保存されます（手動保存ボタンも利用可能）

## 技術スタック

- **Frontend**: React + TypeScript
- **UI**: react-flow (マインドマップ描画)
- **Backend**: Supabase (データ保存)
- **暗号化**: crypto-js (AES暗号化)
- **ビルドツール**: Vite

## デプロイ

### Vercelへのデプロイ

1. Vercelアカウントを作成
2. プロジェクトをGitHubにプッシュ
3. Vercelで「Import Project」
4. 環境変数を設定
5. デプロイ

## ライセンス

MIT
