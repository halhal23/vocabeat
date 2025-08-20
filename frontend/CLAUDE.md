# Vocabeat Frontend

Vocabeatは、Google翻訳やDeepLでの翻訳履歴を自動取得し、スマートな間隔反復学習でエンジニアの英語力を効率的に向上させる次世代の語彙習得システムです。

## 🚀 プロジェクト概要

- **プロジェクト名**: Vocabeat Frontend
- **技術スタック**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **デプロイ**: http://localhost:3000
- **状態**: 開発中 (レスポンシブ対応完了)

## 📁 ディレクトリ構造

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # 認証ページ (/auth)
│   │   ├── dashboard/         # ダッシュボードページ (/dashboard)
│   │   ├── test/              # テストページ (/test)
│   │   ├── words/             # 単語一覧ページ (/words)
│   │   ├── globals.css        # グローバルスタイル
│   │   └── layout.tsx         # ルートレイアウト
│   ├── components/            # Reactコンポーネント
│   │   ├── auth/             # 認証関連コンポーネント
│   │   ├── dashboard/        # ダッシュボード関連
│   │   ├── home/             # ホームページコンポーネント
│   │   ├── layout/           # レイアウトコンポーネント
│   │   ├── test/             # テスト関連コンポーネント
│   │   ├── ui/               # 共通UIコンポーネント
│   │   └── words/            # 単語管理コンポーネント
│   ├── contexts/             # React Context
│   ├── lib/                  # ユーティリティ
│   └── types/                # TypeScript型定義
├── tailwind.config.ts        # Tailwind CSS設定
├── next.config.ts            # Next.js設定
└── package.json              # 依存関係
```

## 🛠️ 技術スタック詳細

### フレームワーク・ライブラリ
- **Next.js 15.4.6**: React フレームワーク、App Router使用
- **React 19.1.0**: UIライブラリ
- **TypeScript 5**: 型安全性
- **Tailwind CSS 3.4.17**: CSSフレームワーク

### UI・スタイリング
- **Lucide React**: アイコンライブラリ
- **カスタムコンポーネントシステム**: `src/components/ui/`
- **レスポンシブデザイン**: xs(375px), sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
- **ダークモード対応**: TailwindのDark mode機能

### 認証・データ
- **Supabase**: 認証・データベース
- **@supabase/auth-ui-react**: Supabase認証UI
- **@supabase/supabase-js**: Supabaseクライアント

## 🎨 デザインシステム

### カラーパレット
- **プライマリー**: Purple gradient (#6636eb → #a855f7)
- **背景**: Dark theme (#000000 → #1a1a1a)
- **アクセント**: Tech-inspired glassmorphism effects

### コンポーネント設計
- **Atomic Design**: atoms (ui/), molecules, organisms
- **レスポンシブファースト**: モバイル → デスクトップ
- **アクセシビリティ**: ARIA対応、キーボードナビゲーション

## 📱 レスポンシブ対応

全ページでレスポンシブデザインが実装済み：

### ブレークポイント
- **xs (375px)**: 小型スマートフォン
- **sm (640px)**: スマートフォン
- **md (768px)**: タブレット
- **lg (1024px)**: 小型デスクトップ
- **xl (1280px)**: デスクトップ
- **2xl (1536px)**: 大型ディスプレイ

### 最適化項目
- アイコン・テキストサイズの段階的調整
- タッチフレンドリーなボタンサイズ (44px minimum)
- モバイルでのアニメーション軽量化
- ガラスモーフィズム効果の最適化

## 🔐 認証システム

### 実装済み機能
- **Google OAuth**: ワンクリックログイン
- **Email/Password**: 従来の認証方式
- **ProtectedRoute**: 認証が必要なページの保護
- **AuthContext**: 認証状態のグローバル管理

### 認証フロー
1. `/auth` - ログイン/サインアップ選択
2. Google OAuth または Email認証
3. `/auth/callback` - 認証コールバック処理
4. `/dashboard` - ダッシュボードへリダイレクト

## 📄 主要ページ

### `/` - ホームページ
- **HeroSection**: メインビジュアル、CTA
- **FeaturesSection**: 機能紹介
- **StatsSection**: 統計情報
- **CtaSection**: 最終的なCTA

### `/dashboard` - ダッシュボード
- **StatsGrid**: 学習統計の表示
- **RecentWordsCard**: 最近の単語
- **UpcomingReviewsCard**: 復習予定

### `/words` - 単語管理
- **WordsHeader**: ページヘッダー
- **WordsFilters**: 検索・フィルタリング
- **WordCard**: 個別単語カード

### `/test` - テスト機能
- **TestStartScreen**: テスト開始画面
- **QuestionCard**: 問題表示
- **TestResultsScreen**: 結果表示

## 🚦 開発フロー

### 起動コマンド
```bash
npm run dev          # 開発サーバー (localhost:3000)
npm run build        # 本番ビルド
npm run start        # 本番サーバー
npm run lint         # ESLint実行
```

### コンポーネント作成ガイドライン
1. **TypeScript**: 必須、propsの型定義
2. **レスポンシブ**: モバイルファースト設計
3. **Tailwind**: ユーティリティクラス使用
4. **アクセシビリティ**: aria-label, role等の設定

## ⚠️ 注意事項・既知の課題

### 開発時の注意
- **Button + Link構造**: `<Link><Button /></Link>` の順序を守る
- **認証状態**: AuthContextでの状態管理を使用
- **レスポンシブテスト**: 全ブレークポイントでの動作確認

### 最適化済み項目
- ✅ レスポンシブデザイン完全対応
- ✅ TypeScriptエラー修正済み
- ✅ ESLint警告の修正
- ✅ ナビゲーション遷移の修正
- ✅ Hydrationエラーの修正

## 🔮 今後の開発予定

### バックエンド連携
- [ ] Supabaseデータベースとの実データ連携
- [ ] 単語データのCRUD操作実装
- [ ] テスト機能の実データ対応

### 機能拡張
- [ ] Chrome拡張機能との連携
- [ ] 学習進捗の永続化
- [ ] 間隔反復学習アルゴリズムの実装

### パフォーマンス
- [ ] 画像最適化
- [ ] コード分割の最適化
- [ ] SEO対応

## 📚 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

**最終更新**: 2025年8月19日  
**開発状況**: レスポンシブ対応完了、基本機能実装済み