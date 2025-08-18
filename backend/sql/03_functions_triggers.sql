-- ================================================================
-- VocaBeat 関数・トリガー作成
-- ================================================================
-- 
-- 含まれる機能:
-- 1. 新規ユーザープロファイル自動作成
-- 2. 更新日時の自動更新
-- 3. 便利な統計関数
--
-- ================================================================

-- ================================================================
-- 1. プロファイル自動作成関数
-- ================================================================

-- 新規ユーザー登録時のプロファイル自動作成関数
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

-- プロファイル自動作成関数のコメント
COMMENT ON FUNCTION public.handle_new_user() IS '新規ユーザー登録時にプロファイルを自動作成';

-- ================================================================
-- 2. プロファイル自動作成トリガー
-- ================================================================

-- auth.usersテーブルへの新規挿入時にプロファイル作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- 3. 更新日時自動更新関数
-- ================================================================

-- 更新日時を自動で設定する関数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 更新日時自動更新関数のコメント
COMMENT ON FUNCTION public.handle_updated_at() IS 'updated_atカラムを自動更新';

-- ================================================================
-- 4. 更新日時自動更新トリガー
-- ================================================================

-- プロファイルテーブルの更新日時自動更新
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 単語テーブルの更新日時自動更新
DROP TRIGGER IF EXISTS set_updated_at_words ON public.words;
CREATE TRIGGER set_updated_at_words
    BEFORE UPDATE ON public.words
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ================================================================
-- 5. 便利な統計関数（将来の拡張用）
-- ================================================================

-- ユーザーの総単語数を取得する関数
CREATE OR REPLACE FUNCTION public.get_user_word_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM public.words 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 単語の正答率を取得する関数
CREATE OR REPLACE FUNCTION public.get_word_accuracy_rate(word_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    correct_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE is_correct = true)::INTEGER,
        COUNT(*)::INTEGER
    INTO correct_count, total_count
    FROM public.learning_records 
    WHERE word_id = word_uuid;
    
    IF total_count = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (correct_count::DECIMAL / total_count::DECIMAL * 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザーの学習統計を取得する関数
CREATE OR REPLACE FUNCTION public.get_user_learning_stats(user_uuid UUID)
RETURNS TABLE (
    total_words INTEGER,
    total_sessions INTEGER,
    correct_answers INTEGER,
    accuracy_rate DECIMAL,
    last_studied_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM public.words WHERE user_id = user_uuid) as total_words,
        COUNT(DISTINCT DATE(lr.studied_at))::INTEGER as total_sessions,
        COUNT(*) FILTER (WHERE lr.is_correct = true)::INTEGER as correct_answers,
        CASE 
            WHEN COUNT(*) = 0 THEN 0::DECIMAL
            ELSE (COUNT(*) FILTER (WHERE lr.is_correct = true)::DECIMAL / COUNT(*)::DECIMAL * 100)
        END as accuracy_rate,
        MAX(lr.studied_at) as last_studied_at
    FROM public.learning_records lr
    WHERE lr.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- 6. 関数のコメント
-- ================================================================

COMMENT ON FUNCTION public.get_user_word_count(UUID) IS 'ユーザーの総単語数を取得';
COMMENT ON FUNCTION public.get_word_accuracy_rate(UUID) IS '特定の単語の正答率を取得（%）';
COMMENT ON FUNCTION public.get_user_learning_stats(UUID) IS 'ユーザーの学習統計を取得';

-- ================================================================
-- 7. 関数使用例（参考用）
-- ================================================================

-- 以下のクエリで関数を使用できます:
-- 
-- -- ユーザーの単語数取得
-- SELECT public.get_user_word_count(auth.uid());
-- 
-- -- 特定の単語の正答率取得
-- SELECT public.get_word_accuracy_rate('word-uuid-here');
-- 
-- -- ユーザーの学習統計取得
-- SELECT * FROM public.get_user_learning_stats(auth.uid());