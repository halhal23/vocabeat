#!/usr/bin/env python3
"""
データベースセットアップスクリプト
Supabaseにテーブルを作成し、サンプルデータを挿入
"""
import os
import sys
from pathlib import Path

# プロジェクトルートをパスに追加
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.database import get_supabase_service
from datetime import datetime, timedelta
import uuid

def create_sample_profile():
    """サンプルプロファイルを作成"""
    supabase = get_supabase_service()
    
    # テスト用ユーザーID
    test_user_id = "550e8400-e29b-41d4-a716-446655440000"
    
    try:
        # プロファイル作成
        profile_data = {
            "id": test_user_id,
            "username": "sample_user",
            "display_name": "サンプルユーザー",
            "email": "sample@vocabeat.com"
        }
        
        response = supabase.table("profiles").upsert(profile_data).execute()
        print(f"✅ プロファイル作成完了: {profile_data['username']}")
        
    except Exception as e:
        print(f"❌ プロファイル作成エラー: {str(e)}")

def create_sample_words():
    """サンプル単語を作成"""
    supabase = get_supabase_service()
    
    # テスト用ユーザーID
    test_user_id = "550e8400-e29b-41d4-a716-446655440000"
    
    # サンプル単語データ
    sample_words = [
        # 難易度1（基本）
        {
            "user_id": test_user_id,
            "word": "apple",
            "meaning": "りんご",
            "pronunciation": "ˈæpl",
            "example_sentence": "I eat an apple every day.",
            "difficulty_level": 1
        },
        {
            "user_id": test_user_id,
            "word": "book",
            "meaning": "本",
            "pronunciation": "bʊk",
            "example_sentence": "This is a good book.",
            "difficulty_level": 1
        },
        {
            "user_id": test_user_id,
            "word": "cat",
            "meaning": "猫",
            "pronunciation": "kæt",
            "example_sentence": "The cat is sleeping.",
            "difficulty_level": 1
        },
        {
            "user_id": test_user_id,
            "word": "dog",
            "meaning": "犬",
            "pronunciation": "dɔg",
            "example_sentence": "My dog is very friendly.",
            "difficulty_level": 1
        },
        {
            "user_id": test_user_id,
            "word": "house",
            "meaning": "家",
            "pronunciation": "haʊs",
            "example_sentence": "I live in a big house.",
            "difficulty_level": 1
        },
        
        # 難易度2（初級）
        {
            "user_id": test_user_id,
            "word": "beautiful",
            "meaning": "美しい",
            "pronunciation": "ˈbjutɪfəl",
            "example_sentence": "The sunset is beautiful.",
            "difficulty_level": 2
        },
        {
            "user_id": test_user_id,
            "word": "important",
            "meaning": "重要な",
            "pronunciation": "ɪmˈpɔrtənt",
            "example_sentence": "This is an important meeting.",
            "difficulty_level": 2
        },
        {
            "user_id": test_user_id,
            "word": "understand",
            "meaning": "理解する",
            "pronunciation": "ʌndərˈstænd",
            "example_sentence": "I understand the problem.",
            "difficulty_level": 2
        },
        {
            "user_id": test_user_id,
            "word": "computer",
            "meaning": "コンピューター",
            "pronunciation": "kəmˈpjutər",
            "example_sentence": "I use my computer for work.",
            "difficulty_level": 2
        },
        
        # 難易度3（中級）
        {
            "user_id": test_user_id,
            "word": "responsibility",
            "meaning": "責任",
            "pronunciation": "rɪˌspɑnsəˈbɪlɪti",
            "example_sentence": "It is your responsibility to finish the task.",
            "difficulty_level": 3
        },
        {
            "user_id": test_user_id,
            "word": "environment",
            "meaning": "環境",
            "pronunciation": "ɪnˈvaɪrənmənt",
            "example_sentence": "We must protect the environment.",
            "difficulty_level": 3
        },
        {
            "user_id": test_user_id,
            "word": "development",
            "meaning": "開発",
            "pronunciation": "dɪˈveləpmənt",
            "example_sentence": "Software development requires patience.",
            "difficulty_level": 3
        },
        
        # 難易度4（上級）
        {
            "user_id": test_user_id,
            "word": "sophisticated",
            "meaning": "洗練された",
            "pronunciation": "səˈfɪstɪˌkeɪtɪd",
            "example_sentence": "The software has a sophisticated interface.",
            "difficulty_level": 4
        },
        {
            "user_id": test_user_id,
            "word": "implementation",
            "meaning": "実装",
            "pronunciation": "ˌɪmpləmənˈteɪʃən",
            "example_sentence": "The implementation was successful.",
            "difficulty_level": 4
        },
        
        # 難易度5（最上級）
        {
            "user_id": test_user_id,
            "word": "serendipity",
            "meaning": "偶然の発見",
            "pronunciation": "ˌserənˈdɪpɪti",
            "example_sentence": "Meeting her was pure serendipity.",
            "difficulty_level": 5
        }
    ]
    
    try:
        response = supabase.table("words").insert(sample_words).execute()
        print(f"✅ サンプル単語作成完了: {len(sample_words)}件")
        
        # 作成された単語のIDを表示
        if response.data:
            print("\n📝 作成された単語:")
            for word in response.data[:5]:  # 最初の5件のみ表示
                print(f"  - {word['word']}: {word['meaning']} (難易度: {word['difficulty_level']})")
            if len(response.data) > 5:
                print(f"  ... 他 {len(response.data) - 5}件")
                
    except Exception as e:
        print(f"❌ サンプル単語作成エラー: {str(e)}")

def main():
    """メイン処理"""
    print("🚀 VocaBeat データベースセットアップ開始")
    print("=" * 50)
    
    print("\n1. サンプルプロファイル作成")
    create_sample_profile()
    
    print("\n2. サンプル単語作成")
    create_sample_words()
    
    print("\n" + "=" * 50)
    print("✨ データベースセットアップ完了")
    print("\n💡 次のステップ:")
    print("  1. APIサーバーを起動: python -m app.main")
    print("  2. APIドキュメント確認: http://localhost:8000/docs")
    print("  3. 単語一覧取得: curl http://localhost:8000/api/v1/words/")

if __name__ == "__main__":
    main()