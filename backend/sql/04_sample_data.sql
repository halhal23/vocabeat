-- ================================================================
-- VocaBeat サンプルデータ作成
-- ================================================================
-- 
-- 開発・テスト用のサンプルデータを作成します
-- 実際のユーザーIDに置き換えて使用してください
--
-- 注意: 本番環境では実行しないでください
-- ================================================================

-- ================================================================
-- 1. サンプルユーザー用のプロファイルデータ
-- ================================================================

-- 注意: 実際のauth.usersのIDに置き換えてください
-- このサンプルでは仮のUUIDを使用しています

-- サンプルプロファイル（実際のユーザーIDが必要）
-- INSERT INTO public.profiles (id, username, display_name, email) VALUES
-- ('01234567-89ab-cdef-0123-456789abcdef', 'sample_user', 'サンプルユーザー', 'sample@example.com');

-- ================================================================
-- 2. サンプル単語データ
-- ================================================================

-- 基本的な英単語サンプル（実際のユーザーIDに置き換えて使用）
/*
INSERT INTO public.words (user_id, word, meaning, pronunciation, example_sentence, difficulty_level) VALUES
-- 難易度1（基本）
('user-uuid-here', 'apple', 'りんご', 'ˈæpl', 'I eat an apple every day.', 1),
('user-uuid-here', 'book', '本', 'bʊk', 'This is a good book.', 1),
('user-uuid-here', 'cat', '猫', 'kæt', 'The cat is sleeping.', 1),
('user-uuid-here', 'dog', '犬', 'dɔg', 'My dog is very friendly.', 1),
('user-uuid-here', 'eat', '食べる', 'it', 'I eat breakfast at 7 AM.', 1),

-- 難易度2（初級）
('user-uuid-here', 'beautiful', '美しい', 'ˈbjutɪfəl', 'The sunset is beautiful.', 2),
('user-uuid-here', 'important', '重要な', 'ɪmˈpɔrtənt', 'This is an important meeting.', 2),
('user-uuid-here', 'understand', '理解する', 'ʌndərˈstænd', 'I understand the problem.', 2),
('user-uuid-here', 'computer', 'コンピューター', 'kəmˈpjutər', 'I use my computer for work.', 2),
('user-uuid-here', 'language', '言語', 'ˈlæŋgwɪdʒ', 'English is an international language.', 2),

-- 難易度3（中級）
('user-uuid-here', 'responsibility', '責任', 'rɪˌspɑnsəˈbɪlɪti', 'It is your responsibility to finish the task.', 3),
('user-uuid-here', 'environment', '環境', 'ɪnˈvaɪrənmənt', 'We must protect the environment.', 3),
('user-uuid-here', 'development', '開発', 'dɪˈveləpmənt', 'Software development requires patience.', 3),
('user-uuid-here', 'opportunity', '機会', 'ˌɑpərˈtunɪti', 'This is a great opportunity for growth.', 3),
('user-uuid-here', 'achievement', '達成', 'əˈtʃivmənt', 'Graduation was his greatest achievement.', 3),

-- 難易度4（上級）
('user-uuid-here', 'sophisticated', '洗練された', 'səˈfɪstɪˌkeɪtɪd', 'The software has a sophisticated interface.', 4),
('user-uuid-here', 'phenomenon', '現象', 'fəˈnɑməˌnɑn', 'This is an interesting phenomenon.', 4),
('user-uuid-here', 'controversial', '議論の余地がある', 'ˌkɑntrəˈvɜrʃəl', 'The topic is quite controversial.', 4),
('user-uuid-here', 'implementation', '実装', 'ˌɪmpləmənˈteɪʃən', 'The implementation was successful.', 4),
('user-uuid-here', 'substantial', '相当な', 'səbˈstænʃəl', 'There was substantial progress.', 4),

-- 難易度5（最上級）
('user-uuid-here', 'ubiquitous', '遍在する', 'juˈbɪkwɪtəs', 'Smartphones are ubiquitous in modern society.', 5),
('user-uuid-here', 'serendipity', '偶然の発見', 'ˌserənˈdɪpɪti', 'Meeting her was pure serendipity.', 5),
('user-uuid-here', 'perspicacious', '洞察力のある', 'ˌpɜrspɪˈkeɪʃəs', 'Her perspicacious analysis was impressive.', 5),
('user-uuid-here', 'ephemeral', '短命な', 'ɪˈfeməral', 'The beauty of cherry blossoms is ephemeral.', 5),
('user-uuid-here', 'quintessential', '典型的な', 'ˌkwɪntɪˈsenʃəl', 'This is the quintessential example.', 5);
*/

-- ================================================================
-- 3. サンプル学習記録データ
-- ================================================================

-- 学習記録のサンプル（実際のword_idに置き換えて使用）
/*
INSERT INTO public.learning_records (user_id, word_id, is_correct, response_time, studied_at) VALUES
-- apple の学習記録
('user-uuid-here', 'word-uuid-apple', true, 1500, NOW() - INTERVAL '2 days'),
('user-uuid-here', 'word-uuid-apple', true, 1200, NOW() - INTERVAL '1 day'),
('user-uuid-here', 'word-uuid-apple', false, 3000, NOW() - INTERVAL '12 hours'),

-- book の学習記録
('user-uuid-here', 'word-uuid-book', false, 2500, NOW() - INTERVAL '3 days'),
('user-uuid-here', 'word-uuid-book', true, 1800, NOW() - INTERVAL '2 days'),
('user-uuid-here', 'word-uuid-book', true, 1000, NOW() - INTERVAL '1 day'),

-- beautiful の学習記録
('user-uuid-here', 'word-uuid-beautiful', true, 2000, NOW() - INTERVAL '1 day'),
('user-uuid-here', 'word-uuid-beautiful', true, 1500, NOW() - INTERVAL '6 hours'),

-- responsibility の学習記録
('user-uuid-here', 'word-uuid-responsibility', false, 4000, NOW() - INTERVAL '2 days'),
('user-uuid-here', 'word-uuid-responsibility', false, 3500, NOW() - INTERVAL '1 day'),
('user-uuid-here', 'word-uuid-responsibility', true, 2800, NOW() - INTERVAL '3 hours');
*/

-- ================================================================
-- 4. データ確認用クエリ
-- ================================================================

-- 作成されたサンプルデータを確認するクエリ（参考用）
/*
-- プロファイル確認
SELECT * FROM public.profiles WHERE username = 'sample_user';

-- 単語データ確認
SELECT 
    word, 
    meaning, 
    difficulty_level,
    created_at
FROM public.words 
ORDER BY difficulty_level, word;

-- 学習記録確認
SELECT 
    w.word,
    lr.is_correct,
    lr.response_time,
    lr.studied_at
FROM public.learning_records lr
JOIN public.words w ON lr.word_id = w.id
ORDER BY lr.studied_at DESC;

-- 統計確認
SELECT * FROM public.get_user_learning_stats('user-uuid-here');
*/

-- ================================================================
-- 5. サンプルデータ削除用クエリ（必要に応じて）
-- ================================================================

-- サンプルデータを削除する場合に使用
/*
-- 学習記録削除
DELETE FROM public.learning_records WHERE user_id = 'user-uuid-here';

-- 単語削除
DELETE FROM public.words WHERE user_id = 'user-uuid-here';

-- プロファイル削除（注意: これはauth.usersも削除する必要があります）
-- DELETE FROM public.profiles WHERE id = 'user-uuid-here';
*/