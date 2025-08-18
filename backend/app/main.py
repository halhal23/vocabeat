"""
VocaBeat Backend API
FastAPI アプリケーションのメインエントリーポイント
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import words, mock_words

# FastAPIアプリケーション作成
app = FastAPI(
    title="VocaBeat API",
    description="VocaBeat単語学習アプリケーションのバックエンドAPI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(mock_words.router, prefix="/api/v1")
# app.include_router(words.router, prefix="/api/v1")  # Supabase接続修正後に有効化

@app.get("/")
async def root():
    """ルートエンドポイント"""
    return {
        "message": "VocaBeat API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """ヘルスチェックエンドポイント"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )