"""
モック単語APIルーター（Supabase接続問題の回避用）
"""
from typing import List
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from app.models import Word, WordCreate, WordUpdate, APIResponse

router = APIRouter(prefix="/mock-words", tags=["mock-words"])

# モックデータ
MOCK_WORDS = [
    {
        "id": str(uuid4()),
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "word": "apple",
        "meaning": "りんご",
        "pronunciation": "ˈæpl",
        "example_sentence": "I eat an apple every day.",
        "difficulty_level": 1,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": str(uuid4()),
        "user_id": "550e8400-e29b-41d4-a716-446655440000", 
        "word": "book",
        "meaning": "本",
        "pronunciation": "bʊk",
        "example_sentence": "This is a good book.",
        "difficulty_level": 1,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": str(uuid4()),
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "word": "beautiful",
        "meaning": "美しい", 
        "pronunciation": "ˈbjutɪfəl",
        "example_sentence": "The sunset is beautiful.",
        "difficulty_level": 2,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": str(uuid4()),
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "word": "responsibility",
        "meaning": "責任",
        "pronunciation": "rɪˌspɑnsəˈbɪlɪti",
        "example_sentence": "It is your responsibility to finish the task.",
        "difficulty_level": 3,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": str(uuid4()),
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "word": "sophisticated",
        "meaning": "洗練された",
        "pronunciation": "səˈfɪstɪˌkeɪtɪd",
        "example_sentence": "The software has a sophisticated interface.",
        "difficulty_level": 4,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

@router.get("/", response_model=List[Word])
async def get_mock_words(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    difficulty: int = Query(None, ge=1, le=5),
    search: str = Query(None)
):
    """モック単語一覧を取得"""
    words = MOCK_WORDS.copy()
    
    # 難易度フィルタ
    if difficulty:
        words = [w for w in words if w["difficulty_level"] == difficulty]
    
    # 検索フィルタ
    if search:
        search_lower = search.lower()
        words = [w for w in words if 
                search_lower in w["word"].lower() or 
                search_lower in w["meaning"].lower()]
    
    # ページング
    words = words[offset:offset + limit]
    
    return [Word(**word) for word in words]

@router.get("/{word_id}", response_model=Word)
async def get_mock_word(word_id: UUID):
    """特定のモック単語を取得"""
    for word in MOCK_WORDS:
        if word["id"] == str(word_id):
            return Word(**word)
    
    raise HTTPException(status_code=404, detail="単語が見つかりません")

@router.post("/", response_model=Word)
async def create_mock_word(word_data: WordCreate):
    """新しいモック単語を作成"""
    new_word = {
        "id": str(uuid4()),
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        **word_data.model_dump()
    }
    
    MOCK_WORDS.append(new_word)
    return Word(**new_word)

@router.get("/stats/summary")
async def get_mock_stats():
    """モック統計情報を取得"""
    total_words = len(MOCK_WORDS)
    difficulty_counts = {}
    
    for word in MOCK_WORDS:
        diff = word["difficulty_level"]
        difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1
    
    return {
        "total_words": total_words,
        "difficulty_distribution": difficulty_counts,
        "latest_word": MOCK_WORDS[-1]["word"] if MOCK_WORDS else None
    }