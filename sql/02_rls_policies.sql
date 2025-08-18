-- ================================================================
-- VocaBeat Row Level Security (RLS) 設定
-- ================================================================
-- 
-- セキュリティポリシー:
-- - ユーザーは自分のデータのみアクセス可能
-- - auth.uid()関数でログイン中のユーザーIDを取得
-- - 全テーブルでRLSを有効化
--
-- ================================================================

-- ================================================================
-- 1. RLS有効化
-- ================================================================

-- プロファイルテーブルのRLS有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 単語テーブルのRLS有効化
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;

-- 学習記録テーブルのRLS有効化
ALTER TABLE public.learning_records ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 2. プロファイルテーブルのポリシー
-- ================================================================

-- ユーザーは自分のプロファイルのみ参照可能
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- ユーザーは自分のプロファイルのみ更新可能
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ================================================================
-- 3. 単語テーブルのポリシー
-- ================================================================

-- ユーザーは自分の単語のみ管理可能（CRUD全て）
CREATE POLICY "Users can manage own words" ON public.words
    FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- 4. 学習記録テーブルのポリシー
-- ================================================================

-- ユーザーは自分の学習記録のみ管理可能（CRUD全て）
CREATE POLICY "Users can manage own learning records" ON public.learning_records
    FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- 5. ポリシーの確認クエリ（参考用）
-- ================================================================

-- 以下のクエリでポリシーの設定状況を確認できます:
-- 
-- -- 全テーブルのRLS状況確認
-- SELECT 
--     schemaname,
--     tablename,
--     rowsecurity
-- FROM pg_tables 
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
-- 
-- -- ポリシー一覧確認
-- SELECT 
--     schemaname,
--     tablename,
--     policyname,
--     permissive,
--     roles,
--     cmd,
--     qual,
--     with_check
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;