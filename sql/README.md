# VocaBeat データベース設定

## 概要
VocaBeatアプリケーションのSupabaseデータベースを設定するためのSQLファイル群です。

## ファイル構成

| ファイル名 | 説明 | 実行順序 |
|-----------|------|----------|
| `01_create_tables.sql` | テーブル作成とインデックス設定 | 1 |
| `02_rls_policies.sql` | Row Level Securityの設定 | 2 |
| `03_functions_triggers.sql` | 関数とトリガーの作成 | 3 |
| `04_sample_data.sql` | サンプルデータ（開発用） | 4（任意） |

## 実行手順

### 1. Supabaseダッシュボードでの実行

1. Supabaseダッシュボードにアクセス
2. プロジェクト「vocabase」を選択
3. 左メニューから「SQL Editor」を選択
4. 以下の順序でSQLファイルを実行:

#### ステップ1: テーブル作成
```sql
-- 01_create_tables.sql の内容を実行
```

#### ステップ2: RLS設定
```sql
-- 02_rls_policies.sql の内容を実行
```

#### ステップ3: 関数・トリガー作成
```sql
-- 03_functions_triggers.sql の内容を実行
```

#### ステップ4: サンプルデータ（任意）
```sql
-- 04_sample_data.sql の内容を実行（開発環境のみ）
```

### 2. CLI経由での実行（代替方法）

Supabase CLIがインストールされている場合:

```bash
# プロジェクトにログイン
supabase login

# プロジェクトリンク
supabase link --project-ref YOUR_PROJECT_REF

# SQLファイル実行
supabase db reset --local=false
```

## 作成されるテーブル

### public.profiles
- ユーザープロファイル情報
- auth.usersと1:1の関係
- 自動作成トリガー付き

### public.words  
- ユーザーの単語データ
- 難易度別管理
- RLS有効

### public.learning_records
- 学習履歴データ
- 正答率追跡
- RLS有効

## セキュリティ機能

### Row Level Security (RLS)
- 全テーブルでRLS有効
- ユーザーは自分のデータのみアクセス可能
- `auth.uid()`関数でユーザー識別

### ポリシー
- `public.profiles`: 参照・更新のみ
- `public.words`: 全操作（CRUD）
- `public.learning_records`: 全操作（CRUD）

## 自動化機能

### トリガー
- **新規ユーザープロファイル作成**: auth.users挿入時に自動実行
- **更新日時自動更新**: profiles, words更新時に自動実行

### 関数
- `handle_new_user()`: プロファイル自動作成
- `handle_updated_at()`: 更新日時自動更新
- `get_user_word_count()`: ユーザー単語数取得
- `get_word_accuracy_rate()`: 単語正答率取得
- `get_user_learning_stats()`: 学習統計取得

## 確認方法

### 1. テーブル確認
```sql
-- 作成されたテーブル一覧
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 2. RLS状況確認
```sql
-- RLS有効状況確認
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

### 3. ポリシー確認
```sql
-- ポリシー一覧確認
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4. 関数確認
```sql
-- 作成された関数一覧
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

## トラブルシューティング

### よくあるエラー

#### 1. テーブル作成エラー
- **原因**: auth.usersテーブルへの参照権限不足
- **解決**: Supabaseダッシュボードから実行

#### 2. RLSポリシーエラー
- **原因**: auth.uid()関数が利用できない
- **解決**: 認証済みユーザーでテスト

#### 3. トリガー実行エラー
- **原因**: 関数の権限設定
- **解決**: SECURITY DEFINERを確認

### デバッグ用クエリ

```sql
-- 現在のユーザーID確認
SELECT auth.uid();

-- テーブルのRLS状況確認
SELECT * FROM pg_tables WHERE schemaname = 'public';

-- エラーログ確認（Supabase Logs画面で）
```

## 注意事項

1. **本番環境**: サンプルデータは実行しない
2. **バックアップ**: 重要なデータがある場合は事前にバックアップ
3. **権限**: Supabaseプロジェクトのオーナー権限が必要
4. **順序**: SQLファイルは必ず指定された順序で実行

## 関連ドキュメント

- [データベース定義書](../docs/database-design.md)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)