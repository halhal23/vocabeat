"""
Supabaseデータベース接続管理
"""
from supabase import create_client, Client
from app.config import settings

class SupabaseClient:
    """Supabaseクライアント管理"""
    
    _client: Client = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Supabaseクライアントを取得"""
        if cls._client is None:
            cls._client = create_client(
                supabase_url=settings.SUPABASE_URL,
                supabase_key=settings.SUPABASE_ANON_KEY
            )
        return cls._client
    
    @classmethod
    def get_service_client(cls) -> Client:
        """サービスロール用Supabaseクライアントを取得"""
        if settings.SUPABASE_KEY:
            return create_client(
                supabase_url=settings.SUPABASE_URL,
                supabase_key=settings.SUPABASE_KEY
            )
        return cls.get_client()

# グローバルクライアント取得関数
def get_supabase() -> Client:
    """Supabaseクライアントを取得"""
    return SupabaseClient.get_client()

def get_supabase_service() -> Client:
    """サービスロール用Supabaseクライアントを取得"""
    return SupabaseClient.get_service_client()