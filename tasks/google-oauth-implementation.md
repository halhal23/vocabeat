# Googleログイン機能実装タスク

## 概要
VocaBeatアプリにGoogleログイン機能を実装するための詳細タスクリスト

## 🧑‍💻 ユーザー側で実施する作業（必須）

### 1. Google Cloud Consoleプロジェクト作成
- **URL**: https://console.cloud.google.com/
- **作業内容**:
  1. 新しいプロジェクトを作成
  2. プロジェクト名: `vocabeat-app` (任意)
  3. 組織: 個人アカウントでOK

### 2. OAuth 2.0認証情報作成
- **場所**: Google Cloud Console > APIとサービス > 認証情報
- **作業内容**:
  1. 「認証情報を作成」→「OAuth 2.0 クライアントID」を選択
  2. アプリケーションタイプ: **ウェブアプリケーション**
  3. 名前: `VocaBeat Web Client`
  4. **承認済みJavaScript生成元**:
     - `http://localhost:3000`
     - `https://kwuzzirstoqjnxpdjkan.supabase.co`
  5. **承認済みリダイレクトURI**:
     - `http://localhost:3000/auth/callback`
     - `https://kwuzzirstoqjnxpdjkan.supabase.co/auth/v1/callback`
  6. 作成後、**クライアントID**と**クライアントシークレット**をメモ

### 3. OAuth同意画面設定
- **場所**: Google Cloud Console > APIとサービス > OAuth同意画面
- **作業内容**:
  1. ユーザータイプ: **外部**を選択
  2. アプリ情報:
     - アプリ名: `VocaBeat`
     - ユーザーサポートメール: あなたのGmailアドレス
     - 開発者の連絡先情報: あなたのGmailアドレス
  3. スコープ: デフォルトのまま（email, profile, openid）
  4. テストユーザー: あなたのGmailアドレスを追加

## 🔧 開発側で実施する作業

### 4. Supabase認証プロバイダー設定
- **場所**: Supabase Dashboard > Authentication > Providers
- **作業内容**:
  1. Google プロバイダーを有効化
  2. ユーザーから受け取った**クライアントID**を入力
  3. ユーザーから受け取った**クライアントシークレット**を入力
  4. リダイレクトURL確認: `https://kwuzzirstoqjnxpdjkan.supabase.co/auth/v1/callback`

### 5. フロントエンド環境変数更新
- **ファイル**: `/frontend/.env.local`
- **作業内容**:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://kwuzzirstoqjnxpdjkan.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=あなたのクライアントID.apps.googleusercontent.com
  ```

### 6. 認証フローテスト
- **作業内容**:
  1. http://localhost:3000/auth でGoogleログインボタンをテスト
  2. Google認証フローの完了確認
  3. ユーザープロファイル自動作成の確認
  4. ダッシュボードへのリダイレクト確認

### 7. 認証コンテキスト最適化（必要に応じて）
- **ファイル**: `/frontend/src/contexts/AuthContext.tsx`
- **作業内容**:
  1. Google認証エラーハンドリング改善
  2. 認証状態の永続化確認
  3. ログアウト機能の動作確認

### 8. UIコンポーネント調整
- **ファイル**: `/frontend/src/components/auth/login-form.tsx`, `/frontend/src/components/auth/signup-form.tsx`
- **作業内容**:
  1. Googleボタンのアイコン・スタイル最適化
  2. エラーメッセージの日本語化
  3. 読み込み状態の改善

## 📋 チェックリスト

### ユーザー側作業
- [ ] Google Cloud Consoleプロジェクト作成
- [ ] OAuth 2.0 クライアントID作成
- [ ] 承認済みリダイレクトURI設定
- [ ] OAuth同意画面設定
- [ ] テストユーザー追加
- [ ] クライアントID・シークレット取得

### 開発側作業
- [ ] Supabase Google プロバイダー設定
- [ ] 環境変数更新
- [ ] 認証フローテスト
- [ ] エラーハンドリング確認
- [ ] UI/UX調整
- [ ] 本番環境設定準備

## 🚨 重要な注意事項

1. **セキュリティ**:
   - クライアントシークレットは絶対に公開しない
   - 環境変数ファイル(.env.local)はGitにコミットしない

2. **テスト環境**:
   - 開発中はテストユーザーとして自分のGoogleアカウントを追加
   - 本番公開時はOAuth同意画面の審査が必要な場合あり

3. **ドメイン設定**:
   - 本番環境では実際のドメインを承認済みリダイレクトURIに追加

## 📞 サポートが必要な場合

Google Cloud Console関連で不明な点があれば、具体的にどの画面で困っているかお知らせください。スクリーンショット付きで説明いたします。

---

**推定作業時間**: 
- ユーザー側: 15-30分
- 開発側: 30-60分