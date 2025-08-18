#!/usr/bin/env python3
"""
VocaBeat Backend API サーバー起動スクリプト
"""
import uvicorn
from app.config import settings

if __name__ == "__main__":
    print("🚀 VocaBeat API サーバーを起動中...")
    print(f"📍 URL: http://{settings.API_HOST}:{settings.API_PORT}")
    print(f"📚 API Docs: http://{settings.API_HOST}:{settings.API_PORT}/docs")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )