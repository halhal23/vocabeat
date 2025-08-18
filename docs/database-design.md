# VocaBeat データベース定義書

## 概要
VocaBeatアプリケーションのデータベース設計仕様書です。
Supabase PostgreSQLを使用し、Row Level Security (RLS) によるセキュリティを実装します。

## データベース構成

### 認証関連（Supabase標準）
- `auth.users` - ユーザー基本情報（Supabase管理）
- `auth.sessions` - セッション管理（Supabase管理）
- `auth.identities` - OAuth プロバイダー情報（Supabase管理）

### アプリケーション関連（カスタム）
- `public.profiles` - ユーザープロファイル
- `public.words` - 単語データ
- `public.learning_records` - 学習記録

## テーブル定義

### 1. public.profiles (ユーザープロファイル)

#### 目的
ユーザーの拡張プロファイル情報を管理

#### カラム定義

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|----------|------|-------------|------|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | - | ユーザーID（auth.usersと1:1） |
| `username` | TEXT | UNIQUE | NULL | ユーザー名（一意） |
| `display_name` | TEXT | - | NULL | 表示名 |
| `avatar_url` | TEXT | - | NULL | アバター画像URL |
| `email` | TEXT | - | NULL | メールアドレス（auth.usersから複製） |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | 作成日時 |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | 更新日時 |

#### インデックス
- `PRIMARY KEY (id)`
- `UNIQUE INDEX (username)` where username IS NOT NULL

#### RLS設定
- **有効**: YES
- **SELECT**: ユーザーは自分のプロファイルのみ参照可能
- **UPDATE**: ユーザーは自分のプロファイルのみ更新可能
- **INSERT**: 自動トリガーによる作成のみ

#### 関連する関数・トリガー
- `handle_new_user()` - 新規ユーザー登録時のプロファイル自動作成

### 2. public.words (単語データ)

#### 目的
ユーザーが学習する単語データを管理

#### カラム定義

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|----------|------|-------------|------|
| `id` | UUID | PRIMARY KEY | gen_random_uuid() | 単語ID |
| `user_id` | UUID | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | - | 単語の所有者 |
| `word` | TEXT | NOT NULL | - | 単語（英語） |
| `meaning` | TEXT | NOT NULL | - | 意味（日本語） |
| `pronunciation` | TEXT | - | NULL | 発音記号・読み方 |
| `example_sentence` | TEXT | - | NULL | 例文 |
| `difficulty_level` | INTEGER | CHECK (difficulty_level BETWEEN 1 AND 5) | 1 | 難易度（1-5） |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | 作成日時 |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | 更新日時 |

#### インデックス
- `PRIMARY KEY (id)`
- `INDEX (user_id)` - ユーザー別検索用
- `INDEX (user_id, word)` - 単語検索用
- `INDEX (user_id, difficulty_level)` - 難易度別学習用
- `INDEX (user_id, created_at)` - 登録順ソート用

#### RLS設定
- **有効**: YES
- **ALL**: ユーザーは自分の単語のみアクセス可能（CRUD全て）

#### 制約
- `difficulty_level`は1-5の範囲
- `word`と`meaning`は必須

### 3. public.learning_records (学習記録)

#### 目的
ユーザーの学習履歴と正答率を追跡

#### カラム定義

| カラム名 | データ型 | 制約 | デフォルト値 | 説明 |
|---------|----------|------|-------------|------|
| `id` | UUID | PRIMARY KEY | gen_random_uuid() | 学習記録ID |
| `user_id` | UUID | NOT NULL, REFERENCES auth.users(id) ON DELETE CASCADE | - | 学習者 |
| `word_id` | UUID | NOT NULL, REFERENCES public.words(id) ON DELETE CASCADE | - | 学習した単語 |
| `is_correct` | BOOLEAN | NOT NULL | - | 正解かどうか |
| `response_time` | INTEGER | CHECK (response_time > 0) | NULL | 回答時間（ミリ秒） |
| `studied_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | NOW() | 学習日時 |

#### インデックス
- `PRIMARY KEY (id)`
- `INDEX (user_id, studied_at)` - ユーザー学習履歴用
- `INDEX (word_id)` - 単語別統計用
- `INDEX (user_id, word_id, studied_at)` - 単語別学習履歴用

#### RLS設定
- **有効**: YES
- **ALL**: ユーザーは自分の学習記録のみアクセス可能

#### 制約
- `response_time`は正の整数のみ

## セキュリティ設計

### Row Level Security (RLS)
全テーブルでRLSを有効化し、ユーザーは自分のデータのみアクセス可能

### ポリシー一覧

#### public.profiles
```sql
-- 参照ポリシー
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- 更新ポリシー
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
```

#### public.words
```sql
-- 全操作ポリシー
CREATE POLICY "Users can manage own words" ON public.words
    FOR ALL USING (auth.uid() = user_id);
```

#### public.learning_records
```sql
-- 全操作ポリシー
CREATE POLICY "Users can manage own learning records" ON public.learning_records
    FOR ALL USING (auth.uid() = user_id);
```

## トリガー・関数

### 1. handle_new_user() 関数
**目的**: 新規ユーザー登録時にプロファイル自動作成

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. on_auth_user_created トリガー
**目的**: auth.usersへの新規挿入時にhandle_new_user()を実行

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## パフォーマンス考慮事項

### インデックス戦略
1. **主キー**: 全テーブルでUUID主キー
2. **外部キー**: 結合性能向上のためインデックス作成
3. **検索頻度**: よく使用される検索条件にインデックス
4. **複合インデックス**: 複数条件での検索最適化

### 想定クエリパターン
1. ユーザー別単語一覧取得
2. 難易度別単語フィルタリング
3. 学習履歴による正答率計算
4. 最近の学習記録取得

## データ整合性

### 参照整合性
- `profiles.id` → `auth.users.id` (CASCADE DELETE)
- `words.user_id` → `auth.users.id` (CASCADE DELETE)
- `learning_records.user_id` → `auth.users.id` (CASCADE DELETE)
- `learning_records.word_id` → `words.id` (CASCADE DELETE)

### データ制約
- `difficulty_level`: 1-5の範囲制限
- `response_time`: 正の整数のみ
- `username`: 一意制約（NULL可）

## バックアップ・復旧

### Supabaseの自動バックアップ
- 日次自動バックアップ
- Point-in-time リカバリ対応

### データエクスポート
- SQL dump形式
- CSV形式（学習データ分析用）

## 監視・ログ

### パフォーマンス監視
- スロークエリログ
- インデックス使用状況
- RLS実行時間

### セキュリティ監視
- 認証失敗ログ
- 不正アクセス試行
- RLSポリシー違反

## 今後の拡張予定

### フェーズ2
- `word_categories` - 単語カテゴリ管理
- `study_sessions` - 学習セッション管理
- `achievements` - 達成バッジシステム

### フェーズ3
- `word_audio` - 音声データ管理
- `learning_analytics` - 学習分析データ
- `social_features` - ソーシャル機能

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|----------|--------|
| 2025-01-XX | v1.0 | 初版作成 | - |