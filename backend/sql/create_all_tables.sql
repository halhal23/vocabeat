-- ================================================================
-- VocaBeat データベース一括作成スクリプト
-- Supabase SQL Editorで実行してください
-- ================================================================

-- ================================================================
-- 1. テーブル作成
-- ================================================================

-- プロファイルテーブル作成
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 単語テーブル作成
CREATE TABLE IF NOT EXISTS public.words (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    pronunciation TEXT,
    example_sentence TEXT,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 学習記録テーブル作成
CREATE TABLE IF NOT EXISTS public.learning_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    word_id UUID REFERENCES public.words(id) ON DELETE CASCADE NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time INTEGER CHECK (response_time > 0),
    studied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ================================================================
-- 2. インデックス作成
-- ================================================================

CREATE INDEX IF NOT EXISTS words_user_id_idx ON public.words (user_id);
CREATE INDEX IF NOT EXISTS words_user_id_word_idx ON public.words (user_id, word);
CREATE INDEX IF NOT EXISTS words_user_id_difficulty_idx ON public.words (user_id, difficulty_level);
CREATE INDEX IF NOT EXISTS words_user_id_created_at_idx ON public.words (user_id, created_at);

CREATE INDEX IF NOT EXISTS learning_records_user_id_studied_at_idx ON public.learning_records (user_id, studied_at);
CREATE INDEX IF NOT EXISTS learning_records_word_id_idx ON public.learning_records (word_id);
CREATE INDEX IF NOT EXISTS learning_records_user_id_word_id_studied_at_idx ON public.learning_records (user_id, word_id, studied_at);

-- ================================================================
-- 3. RLS設定
-- ================================================================

-- RLS有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_records ENABLE ROW LEVEL SECURITY;

-- プロファイルテーブルのポリシー
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 単語テーブルのポリシー
CREATE POLICY "Users can manage own words" ON public.words
    FOR ALL USING (auth.uid() = user_id);

-- 学習記録テーブルのポリシー
CREATE POLICY "Users can manage own learning records" ON public.learning_records
    FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- 4. 関数・トリガー作成
-- ================================================================

-- プロファイル自動作成関数
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

-- プロファイル自動作成トリガー
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 更新日時自動更新関数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 更新日時自動更新トリガー
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_words ON public.words;
CREATE TRIGGER set_updated_at_words
    BEFORE UPDATE ON public.words
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ================================================================
-- 5. 確認クエリ
-- ================================================================

-- 作成されたテーブル一覧を表示
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 作成完了メッセージ
SELECT 'VocaBeat データベース作成完了!' as status;