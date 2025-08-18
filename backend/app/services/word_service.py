"""
単語管理サービス
"""
from typing import List, Optional
from uuid import UUID
from supabase import Client
from app.models import Word, WordCreate, WordUpdate, WordStats
from app.database import get_supabase

class WordService:
    """単語管理サービス"""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
    
    async def get_words(self, user_id: UUID, limit: int = 20, offset: int = 0) -> List[Word]:
        """ユーザーの単語一覧を取得"""
        try:
            response = self.supabase.table("words").select("*").eq("user_id", str(user_id)).order("created_at", desc=True).limit(limit).offset(offset).execute()
            
            if response.data:
                return [Word(**word) for word in response.data]
            return []
        except Exception as e:
            raise Exception(f"単語取得エラー: {str(e)}")
    
    async def get_word(self, word_id: UUID, user_id: UUID) -> Optional[Word]:
        """特定の単語を取得"""
        try:
            response = self.supabase.table("words").select("*").eq("id", str(word_id)).eq("user_id", str(user_id)).execute()
            
            if response.data and len(response.data) > 0:
                return Word(**response.data[0])
            return None
        except Exception as e:
            raise Exception(f"単語取得エラー: {str(e)}")
    
    async def create_word(self, user_id: UUID, word_data: WordCreate) -> Word:
        """新しい単語を作成"""
        try:
            word_dict = word_data.model_dump()
            word_dict["user_id"] = str(user_id)
            
            response = self.supabase.table("words").insert(word_dict).execute()
            
            if response.data and len(response.data) > 0:
                return Word(**response.data[0])
            else:
                raise Exception("単語作成に失敗しました")
        except Exception as e:
            raise Exception(f"単語作成エラー: {str(e)}")
    
    async def update_word(self, word_id: UUID, user_id: UUID, word_data: WordUpdate) -> Optional[Word]:
        """単語を更新"""
        try:
            word_dict = word_data.model_dump(exclude_unset=True)
            
            response = self.supabase.table("words").update(word_dict).eq("id", str(word_id)).eq("user_id", str(user_id)).execute()
            
            if response.data and len(response.data) > 0:
                return Word(**response.data[0])
            return None
        except Exception as e:
            raise Exception(f"単語更新エラー: {str(e)}")
    
    async def delete_word(self, word_id: UUID, user_id: UUID) -> bool:
        """単語を削除"""
        try:
            response = self.supabase.table("words").delete().eq("id", str(word_id)).eq("user_id", str(user_id)).execute()
            return True
        except Exception as e:
            raise Exception(f"単語削除エラー: {str(e)}")
    
    async def get_words_by_difficulty(self, user_id: UUID, difficulty_level: int) -> List[Word]:
        """難易度別で単語を取得"""
        try:
            response = self.supabase.table("words").select("*").eq("user_id", str(user_id)).eq("difficulty_level", difficulty_level).order("created_at", desc=True).execute()
            
            if response.data:
                return [Word(**word) for word in response.data]
            return []
        except Exception as e:
            raise Exception(f"単語取得エラー: {str(e)}")
    
    async def search_words(self, user_id: UUID, query: str) -> List[Word]:
        """単語を検索"""
        try:
            response = self.supabase.table("words").select("*").eq("user_id", str(user_id)).or_(f"word.ilike.%{query}%,meaning.ilike.%{query}%").order("created_at", desc=True).execute()
            
            if response.data:
                return [Word(**word) for word in response.data]
            return []
        except Exception as e:
            raise Exception(f"単語検索エラー: {str(e)}")

def get_word_service() -> WordService:
    """単語サービスを取得"""
    return WordService(get_supabase())