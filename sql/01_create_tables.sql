-- ================================================================
-- VocaBeat データベース作成スクリプト
-- ================================================================
-- 
-- 実行順序:
-- 1. プロファイルテーブル作成
-- 2. 単語テーブル作成  
-- 3. 学習記録テーブル作成
-- 4. RLS設定
-- 5. ポリシー作成
-- 6. トリガー・関数作成
--
-- ================================================================

-- ================================================================
-- 1. プロファイルテーブル作成
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

-- プロファイルテーブルのコメント
COMMENT ON TABLE public.profiles IS 'ユーザープロファイル情報';
COMMENT ON COLUMN public.profiles.id IS 'ユーザーID（auth.usersと1:1）';
COMMENT ON COLUMN public.profiles.username IS 'ユーザー名（一意）';
COMMENT ON COLUMN public.profiles.display_name IS '表示名';
COMMENT ON COLUMN public.profiles.avatar_url IS 'アバター画像URL';
COMMENT ON COLUMN public.profiles.email IS 'メールアドレス';
COMMENT ON COLUMN public.profiles.created_at IS '作成日時';
COMMENT ON COLUMN public.profiles.updated_at IS '更新日時';

-- ================================================================
-- 2. 単語テーブル作成
-- ================================================================

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

-- 単語テーブルのコメント
COMMENT ON TABLE public.words IS '単語データ';
COMMENT ON COLUMN public.words.id IS '単語ID';
COMMENT ON COLUMN public.words.user_id IS '単語の所有者';
COMMENT ON COLUMN public.words.word IS '単語（英語）';
COMMENT ON COLUMN public.words.meaning IS '意味（日本語）';
COMMENT ON COLUMN public.words.pronunciation IS '発音記号・読み方';
COMMENT ON COLUMN public.words.example_sentence IS '例文';
COMMENT ON COLUMN public.words.difficulty_level IS '難易度（1-5）';
COMMENT ON COLUMN public.words.created_at IS '作成日時';
COMMENT ON COLUMN public.words.updated_at IS '更新日時';

-- 単語テーブルのインデックス
CREATE INDEX IF NOT EXISTS words_user_id_idx ON public.words (user_id);
CREATE INDEX IF NOT EXISTS words_user_id_word_idx ON public.words (user_id, word);
CREATE INDEX IF NOT EXISTS words_user_id_difficulty_idx ON public.words (user_id, difficulty_level);
CREATE INDEX IF NOT EXISTS words_user_id_created_at_idx ON public.words (user_id, created_at);

-- ================================================================
-- 3. 学習記録テーブル作成
-- ================================================================

-- 学習記録テーブル作成
CREATE TABLE IF NOT EXISTS public.learning_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    word_id UUID REFERENCES public.words(id) ON DELETE CASCADE NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time INTEGER CHECK (response_time > 0),
    studied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 学習記録テーブルのコメント
COMMENT ON TABLE public.learning_records IS '学習記録';
COMMENT ON COLUMN public.learning_records.id IS '学習記録ID';
COMMENT ON COLUMN public.learning_records.user_id IS '学習者';
COMMENT ON COLUMN public.learning_records.word_id IS '学習した単語';
COMMENT ON COLUMN public.learning_records.is_correct IS '正解かどうか';
COMMENT ON COLUMN public.learning_records.response_time IS '回答時間（ミリ秒）';
COMMENT ON COLUMN public.learning_records.studied_at IS '学習日時';

-- 学習記録テーブルのインデックス
CREATE INDEX IF NOT EXISTS learning_records_user_id_studied_at_idx ON public.learning_records (user_id, studied_at);
CREATE INDEX IF NOT EXISTS learning_records_word_id_idx ON public.learning_records (word_id);
CREATE INDEX IF NOT EXISTS learning_records_user_id_word_id_studied_at_idx ON public.learning_records (user_id, word_id, studied_at);