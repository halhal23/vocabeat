"""
単語管理APIルーター
"""
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from app.models import Word, WordCreate, WordUpdate, APIResponse
from app.services.word_service import WordService, get_word_service

router = APIRouter(prefix="/words", tags=["words"])

# テスト用の固定ユーザーID（実際の認証実装時に置き換え）
TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

@router.get("/", response_model=List[Word])
async def get_words(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    difficulty: int = Query(None, ge=1, le=5),
    search: str = Query(None),
    word_service: WordService = Depends(get_word_service)
):
    """単語一覧を取得"""
    try:
        user_id = UUID(TEST_USER_ID)
        
        if search:
            words = await word_service.search_words(user_id, search)
        elif difficulty:
            words = await word_service.get_words_by_difficulty(user_id, difficulty)
        else:
            words = await word_service.get_words(user_id, limit, offset)
        
        return words
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{word_id}", response_model=Word)
async def get_word(
    word_id: UUID,
    word_service: WordService = Depends(get_word_service)
):
    """特定の単語を取得"""
    try:
        user_id = UUID(TEST_USER_ID)
        word = await word_service.get_word(word_id, user_id)
        
        if not word:
            raise HTTPException(status_code=404, detail="単語が見つかりません")
        
        return word
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Word)
async def create_word(
    word_data: WordCreate,
    word_service: WordService = Depends(get_word_service)
):
    """新しい単語を作成"""
    try:
        user_id = UUID(TEST_USER_ID)
        word = await word_service.create_word(user_id, word_data)
        return word
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{word_id}", response_model=Word)
async def update_word(
    word_id: UUID,
    word_data: WordUpdate,
    word_service: WordService = Depends(get_word_service)
):
    """単語を更新"""
    try:
        user_id = UUID(TEST_USER_ID)
        word = await word_service.update_word(word_id, user_id, word_data)
        
        if not word:
            raise HTTPException(status_code=404, detail="単語が見つかりません")
        
        return word
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{word_id}", response_model=APIResponse)
async def delete_word(
    word_id: UUID,
    word_service: WordService = Depends(get_word_service)
):
    """単語を削除"""
    try:
        user_id = UUID(TEST_USER_ID)
        success = await word_service.delete_word(word_id, user_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="単語が見つかりません")
        
        return APIResponse(message="単語を削除しました")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))