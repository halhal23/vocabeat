# Vocabeat（ボキャビート）- 要件定義書

## プロジェクト概要

**プロジェクト名**: Vocabeat（ボキャビート）

**目的**: 日々、Google翻訳やDeepLで英語を調べる日本のITエンジニア向けに、自動的に語彙学習が進むシステムを開発する。翻訳履歴から英単語を自動で取得し、学習履歴として蓄積。LINE通知やアプリ内テストで復習・定着を促進する語彙トレーニングサービス。

## ターゲットユーザー

- **主要ターゲット**: 日本のITエンジニア（英語が得意ではない）
- **特徴**:
  - 日常的に英語の技術ドキュメントを読んでいる
  - Google翻訳・DeepLなどの翻訳ツールに依存している
  - 英語力を伸ばしたい気持ちはあるが、まとまった学習時間が取れない
  - 日本語での説明・サポートを求めている
  - 自分の翻訳履歴が自動で単語帳になり、復習も通知で進む設計を求めている

## MVP機能要件

### 1. Chrome拡張機能
- **機能**: Google翻訳 / DeepL の使用履歴から英単語を自動取得
- **技術要件**:
  - Chrome Extension Manifest V3
  - コンテンツスクリプトによる翻訳サイトの監視
  - 自前APIへのPOST送信（単語・出典・URL・タイムスタンプ・user token）

### 2. LINE通知機能
- **機能**: ユーザーごとに毎日出題をLINEに送信（語彙テスト or 復習）
- **技術要件**:
  - LINE Messaging API統合
  - Webhook設計（Bot → ユーザー → 回答）
  - 個別ユーザー管理とスケジューリング

### 3. Webアプリケーション
- **フレームワーク**: Next.js + React + TypeScript
- **スタイリング**: Tailwind CSS
- **機能**:
  - ログイン（Google認証）
  - 自分の単語一覧・テスト履歴ダッシュボード
  - 英単語テスト（4択、○×）
  - 学習進捗の可視化

### 4. APIサーバー
- **フレームワーク**: Python FastAPI（想定）
- **機能**:
  - ユーザー・単語・履歴データの保存と取得
  - RESTful API設計
  - テスト出題アルゴリズム（SRSベース）
  - Google認証統合

## UIデザイン要件

### デザインコンセプト
- **目標**: モダンでかっこよく、シンプルかつ洗練されたUI
- **技術スタック**: Tailwind CSS + React（Next.js）
- **デザインインスピレーション**: Notion、Linear、Vercel、Raycast

### カラーパレット
- **プライマリ**: パープル-ブルーグラデーション（#8B5CF6 → #3B82F6）
- **ベース**: グレー基調（#111, #999, #eaeaea）
- **アクセント**: イエロー（#FCD34D）、グリーン（#10B981）

### ビジュアルエフェクト
- **グラスモーフィズム**: 透明感のあるカード・ヘッダー
- **グラデーション**: 背景、ボタン、テキストに適用
- **アニメーション**: フローティング、ホバー、スケールエフェクト
- **タイポグラフィ**: Inter フォント、グラデーションテキスト

## 技術仕様

### フロントエンド
- **フレームワーク**: Next.js 15.x (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **UIコンポーネント**: shadcn/ui風のカスタムコンポーネント
- **アイコン**: Lucide React
- **状態管理**: React Hook（将来的にZustand検討）

### バックエンド（想定）
- **フレームワーク**: FastAPI
- **データベース**: PostgreSQL
- **認証**: Google OAuth 2.0
- **外部API**: LINE Messaging API

### インフラ（想定）
- **ホスティング**: Vercel (フロントエンド), Railway/AWS (バックエンド)
- **データベース**: Supabase / PlanetScale

## 画面構成

### 1. ランディングページ (`/`)
- **目的**: サービス紹介とユーザー獲得
- **要素**:
  - ヒーローセクション（グラデーション背景、アニメーション）
  - 機能紹介カード（3つの主要機能）
  - 統計セクション（ソーシャルプルーフ）
  - CTA（Get Started / Sign In）

### 2. 認証ページ (`/auth`)
- **機能**: Google認証によるサインイン
- **要素**:
  - Google認証ボタン
  - Chrome拡張機能の案内
  - プライバシーポリシーリンク

### 3. ダッシュボード (`/dashboard`)
- **機能**: 学習進捗の概要表示
- **要素**:
  - 統計カード（総単語数、習得数、連続日数、学習時間）
  - 最近の単語一覧
  - 復習予定の単語
  - アクションボタン（学習開始、テスト開始）

### 4. 単語一覧ページ (`/words`)
- **機能**: 登録された単語の管理
- **要素**:
  - 検索・フィルタリング機能
  - 単語カード（単語、意味、出典、難易度、正答率）
  - 個別復習ボタン

### 5. テストページ (`/test`)
- **機能**: インタラクティブな語彙テスト
- **要素**:
  - 問題形式（4択、○×）
  - 進捗バー
  - 結果表示・分析
  - 再テスト・単語復習へのナビゲーション

## データモデル

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Word
```typescript
interface Word {
  id: string;
  userId: string;
  word: string;
  meaning: string;
  translation: string;
  sourceUrl?: string;
  sourceText?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
}
```

### TestResult
```typescript
interface TestResult {
  id: string;
  userId: string;
  questionId: string;
  wordId: string;
  isCorrect: boolean;
  userAnswer: string;
  timeSpent: number;
  createdAt: Date;
}
```

### StudySession
```typescript
interface StudySession {
  id: string;
  userId: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  createdAt: Date;
}
```

## 実装フェーズ

### Phase 1: MVP開発 ✅
- [x] Next.jsプロジェクトセットアップ
- [x] UIコンポーネント開発
- [x] 全画面のプロトタイプ作成
- [x] モダンなデザインシステム構築

### Phase 2: Chrome拡張機能（予定）
- [ ] Manifest V3拡張機能開発
- [ ] Google翻訳/DeepL連携
- [ ] API連携とデータ送信

### Phase 3: バックエンドAPI（予定）
- [ ] FastAPI開発環境構築
- [ ] データベース設計・構築
- [ ] RESTful API実装
- [ ] Google認証統合

### Phase 4: LINE統合（予定）
- [ ] LINE Messaging API統合
- [ ] 通知システム開発
- [ ] Webhook実装

### Phase 5: 本格運用（予定）
- [ ] パフォーマンス最適化
- [ ] セキュリティ強化
- [ ] ユーザーフィードバック対応
- [ ] iOS/Androidアプリ展開検討

## 品質要件

### パフォーマンス
- **ページ読み込み**: 3秒以内
- **インタラクション**: 100ms以内の応答
- **モバイル対応**: 完全レスポンシブ

### セキュリティ
- **認証**: OAuth 2.0準拠
- **データ暗号化**: HTTPS通信必須
- **プライバシー**: GDPR準拠

### アクセシビリティ
- **WCAG 2.1 AA準拠**
- **キーボードナビゲーション対応**
- **スクリーンリーダー対応**

## 将来的な拡張

### 機能拡張
- **iOS/Androidアプリ**: ネイティブアプリ開発
- **AI機能**: 個人に最適化された学習アルゴリズム
- **コミュニティ機能**: ユーザー間での単語共有
- **ゲーミフィケーション**: バッジ、ランキング機能

### 技術的拡張
- **多言語対応**: 日本語以外の言語サポート
- **オフライン機能**: PWA対応
- **音声機能**: 発音練習機能
- **画像認識**: OCRによる単語抽出

---

**文書作成日**: 2025-08-18  
**最終更新日**: 2025-08-18  
**バージョン**: 1.0  
**作成者**: Claude Code Assistant