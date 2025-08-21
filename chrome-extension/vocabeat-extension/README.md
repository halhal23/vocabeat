# Vocabeat Chrome Extension

Google翻訳の英単語を自動抽出してVocabeatデータベースに登録するChrome拡張機能です。

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## セットアップ

### 1. 環境変数の設定

`.env.example`を`.env`にコピーして、Supabase設定を入力してください：

```bash
cp .env.example .env
```

`.env`ファイルを編集：
```env
PLASMO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PLASMO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. 開発サーバーの起動

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

## セキュリティについて

### Supabase認証情報

- **匿名キー（anon key）**: Chrome拡張機能でのみ使用される公開キーです。Row Level Security (RLS) によって適切にアクセス制御されています。
- **サービスキー**: 絶対に拡張機能に含めないでください。
- **環境変数**: 認証情報は`.env`ファイルで管理し、gitにコミットしないでください。

### RLS (Row Level Security) 設定

Supabaseデータベースでは以下のRLSポリシーが必要です：

```sql
-- wordsテーブルのRLSポリシー例
CREATE POLICY "Users can only access their own words" ON words
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own words" ON words
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 本番環境でのセキュリティ考慮事項

1. **ドメイン制限**: Supabaseプロジェクトの認証設定で、許可されたドメインを制限してください。
2. **アクセス制御**: RLSで適切なアクセス制御を実装してください。
3. **レート制限**: 必要に応じてSupabase側でレート制限を設定してください。

## 機能

- Google翻訳ページでの英単語自動抽出
- Supabaseデータベースへの自動保存
- ユーザー認証（手動設定またはVocabeatフロントエンドからの自動検出）
- 重複単語の検出と防止
- オフライン時のローカル保存

## 使用方法

1. Chrome拡張機能として読み込み
2. Google翻訳ページで英単語を翻訳
3. 拡張機能ポップアップでユーザーIDを設定（初回のみ）
4. 自動的にVocabeatデータベースに単語が保存されます

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
