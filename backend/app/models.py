"""
データモデル定義
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import UUID

# ============================================================================
# プロファイル関連モデル
# ============================================================================

class ProfileBase(BaseModel):
    """プロファイル基底モデル"""
    username: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[str] = None

class ProfileCreate(ProfileBase):
    """プロファイル作成モデル"""
    pass

class ProfileUpdate(ProfileBase):
    """プロファイル更新モデル"""
    pass

class Profile(ProfileBase):
    """プロファイルモデル"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ============================================================================
# 単語関連モデル  
# ============================================================================

class WordBase(BaseModel):
    """単語基底モデル"""
    word: str = Field(..., min_length=1, max_length=100)
    meaning: str = Field(..., min_length=1, max_length=500)
    pronunciation: Optional[str] = Field(None, max_length=100)
    example_sentence: Optional[str] = Field(None, max_length=1000)
    difficulty_level: int = Field(1, ge=1, le=5)

class WordCreate(WordBase):
    """単語作成モデル"""
    pass

class WordUpdate(WordBase):
    """単語更新モデル"""
    word: Optional[str] = Field(None, min_length=1, max_length=100)
    meaning: Optional[str] = Field(None, min_length=1, max_length=500)
    difficulty_level: Optional[int] = Field(None, ge=1, le=5)

class Word(WordBase):
    """単語モデル"""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ============================================================================
# 学習記録関連モデル
# ============================================================================

class LearningRecordBase(BaseModel):
    """学習記録基底モデル"""
    word_id: UUID
    is_correct: bool
    response_time: Optional[int] = Field(None, gt=0)

class LearningRecordCreate(LearningRecordBase):
    """学習記録作成モデル"""
    pass

class LearningRecord(LearningRecordBase):
    """学習記録モデル"""
    id: UUID
    user_id: UUID
    studied_at: datetime
    
    class Config:
        from_attributes = True

# ============================================================================
# 統計関連モデル
# ============================================================================

class WordStats(BaseModel):
    """単語統計モデル"""
    word_id: UUID
    word: str
    meaning: str
    total_attempts: int
    correct_attempts: int
    accuracy_rate: float
    last_studied: Optional[datetime]

class UserStats(BaseModel):
    """ユーザー統計モデル"""
    total_words: int
    total_sessions: int
    correct_answers: int
    accuracy_rate: float
    last_studied_at: Optional[datetime]

# ============================================================================
# レスポンス関連モデル
# ============================================================================

class APIResponse(BaseModel):
    """API基本レスポンス"""
    success: bool = True
    message: str = "OK"
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    """エラーレスポンス"""
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[dict] = None

# ============================================================================
# ページネーション関連モデル
# ============================================================================

class PaginationParams(BaseModel):
    """ページネーションパラメータ"""
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)

class PaginatedResponse(BaseModel):
    """ページネーション付きレスポンス"""
    items: List[dict]
    total: int
    page: int
    limit: int
    pages: int