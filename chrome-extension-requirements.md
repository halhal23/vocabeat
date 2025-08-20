# Vocabeat Chrome Extension 要件定義書

## 📋 プロジェクト概要

### プロジェクト名
Vocabeat Chrome Extension - Google翻訳単語自動抽出システム

### 目的
Google翻訳サービス利用時に翻訳した単語を自動的に抽出し、Vocabeatのデータベースに登録することで、エンジニアの語彙学習を効率化する。

### 対象ユーザー
- エンジニア・技術者
- 英語技術文書を頻繁に読む開発者
- Google翻訳を日常的に使用するユーザー

## 🎯 機能要件

### 1. 単語抽出機能
- **対象サイト**: translate.google.com
- **抽出対象**: 
  - 翻訳前の英単語
  - 翻訳後の日本語
  - 翻訳実行時刻
- **抽出条件**:
  - 単語（1語）の翻訳のみ対象
  - 複数語や文章の翻訳は除外
  - 既に登録済みの単語は重複チェック

### 2. データベース連携機能
- **保存先**: Supabase PostgreSQL
- **認証**: Supabaseセッション管理
- **データ構造**:
  ```typescript
  interface Word {
    id: string
    user_id: string
    english_word: string
    japanese_meaning: string
    translation_source: 'google_translate'
    confidence_level: number
    created_at: Date
    last_reviewed_at?: Date
    review_count: number
    difficulty: 'easy' | 'medium' | 'hard'
  }
  ```

### 3. ユーザーインターフェース
- **ポップアップ画面**:
  - 拡張機能の有効/無効切り替え
  - 登録済み単語数表示
  - Vocabeatアプリへのリンク
  - 設定画面への遷移
- **通知機能**:
  - 新単語登録時の軽微な通知
  - 登録失敗時のエラー表示

### 4. 設定機能
- **自動抽出ON/OFF**: ユーザーが機能を制御可能
- **除外単語リスト**: 登録したくない単語の設定
- **ログレベル**: デバッグ用ログ出力レベル

## 🔧 技術要件

### 開発フレームワーク
- **Plasmo Framework**: Chrome拡張機能開発
- **TypeScript**: 型安全性の確保
- **React**: UIコンポーネント（ポップアップ画面）

### 主要技術スタック
```json
{
  "framework": "Plasmo",
  "language": "TypeScript",
  "ui": "React + Tailwind CSS",
  "database": "Supabase",
  "build": "Parcel (Plasmo内蔵)",
  "testing": "Jest + Chrome Extension Testing Library"
}
```

### Chrome Extension APIs
- **Manifest V3**: 最新のマニフェスト形式
- **Content Scripts**: Google翻訳ページでのDOM監視
- **Background Service Worker**: データ処理とAPI通信
- **Storage API**: ローカル設定保存
- **Tabs API**: アクティブタブ情報取得

### 外部API連携
- **Supabase REST API**: データベース操作
- **Supabase Auth**: ユーザー認証

## 📁 プロジェクト構造

```
vocabeat-extension/
├── src/
│   ├── background/           # Service Worker
│   │   └── index.ts         # バックグラウンド処理
│   ├── content/             # Content Scripts
│   │   └── google-translate.ts  # Google翻訳ページ用
│   ├── popup/               # ポップアップUI
│   │   ├── index.tsx        # ポップアップメイン
│   │   └── components/      # UIコンポーネント
│   ├── options/             # 設定ページ
│   │   └── index.tsx        # 設定画面
│   ├── lib/                 # ユーティリティ
│   │   ├── supabase.ts      # Supabase設定
│   │   ├── storage.ts       # Chrome Storage API
│   │   └── word-extractor.ts # 単語抽出ロジック
│   └── types/               # TypeScript型定義
│       └── index.ts
├── assets/                  # アイコン・画像
├── manifest.json            # 拡張機能マニフェスト
├── package.json
├── plasmo.config.ts         # Plasmo設定
└── tailwind.config.ts       # TailwindCSS設定
```

## 🎨 UI/UX要件

### ポップアップデザイン
- **サイズ**: 320px × 480px
- **デザイン**: Vocabeatフロントエンドと統一感
- **カラーテーマ**: Purple gradient + Glassmorphism
- **レスポンシブ**: 異なるDPI対応

### 通知デザイン
- **Chrome通知**: 控えめで邪魔にならない
- **成功時**: グリーンアクセント
- **エラー時**: レッドアクセント

## 🔐 セキュリティ要件

### データ保護
- **ローカルストレージ**: 最小限の情報のみ保存
- **API通信**: HTTPS必須
- **認証トークン**: セキュアな保存と更新

### プライバシー
- **最小権限の原則**: 必要最小限のPermission
- **データ収集**: 翻訳単語のみ、個人情報収集なし
- **ユーザー同意**: 初回起動時の利用規約同意

## 📊 パフォーマンス要件

### 応答時間
- **単語抽出**: 500ms以内
- **データベース登録**: 2秒以内
- **ポップアップ表示**: 200ms以内

### リソース使用量
- **メモリ使用量**: 50MB以下
- **CPU使用率**: バックグラウンドで5%以下
- **ネットワーク**: 必要時のみAPI通信

## 🧪 テスト要件

### 単体テスト
- **Content Script**: DOM操作ロジック
- **Background**: API通信処理
- **Word Extractor**: 単語抽出アルゴリズム

### 統合テスト
- **E2E**: Google翻訳→抽出→DB登録フロー
- **UI**: ポップアップ操作テスト
- **API**: Supabase連携テスト

### ブラウザ互換性
- **Chrome**: v88+（Manifest V3対応）
- **Edge**: v88+（Chromium基盤）

## 🚀 デプロイ要件

### 開発環境
- **Local Development**: Plasmo dev server
- **Hot Reload**: リアルタイム開発

### 本番環境
- **Chrome Web Store**: 公式ストア配布
- **Version Management**: Semantic Versioning
- **Update Strategy**: 自動更新有効

## 📋 開発フェーズ

### Phase 1: 基盤構築（1週間）
- Plasmoプロジェクト初期化
- 基本的なManifest設定
- Supabase連携設定

### Phase 2: コア機能実装（2週間）
- Google翻訳ページでの単語抽出
- データベース連携
- 基本的なポップアップUI

### Phase 3: UI/UX改善（1週間）
- デザインシステム適用
- 設定画面実装
- エラーハンドリング

### Phase 4: テスト・最適化（1週間）
- 単体・統合テスト
- パフォーマンス最適化
- Chrome Web Store申請準備

## 📝 成功指標

### 機能指標
- **抽出精度**: 95%以上の正確な単語抽出
- **レスポンス時間**: 平均500ms以内
- **エラー率**: 1%以下

### ユーザー指標
- **アクティブユーザー**: 月間100名以上
- **継続利用率**: 30日後80%以上
- **満足度**: レビュー4.0以上

## 🔄 今後の拡張計画

### 追加機能
- **DeepL対応**: Google翻訳以外の翻訳サービス
- **音声機能**: 単語の発音再生
- **学習統計**: 翻訳頻度分析
- **同期機能**: 複数デバイス間でのデータ同期

### 他サービス連携
- **Anki**: 単語カード自動生成
- **Notion**: 学習ノート連携
- **Slack**: チーム学習機能

---

**作成日**: 2025年8月20日  
**対象**: Vocabeat Chrome Extension v1.0  
**作成者**: Claude (AI Assistant)