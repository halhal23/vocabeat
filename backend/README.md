# VocaBeat Backend API

VocaBeat単語学習アプリケーションのPython FastAPIバックエンド

## 概要

- **フレームワーク**: FastAPI
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth（将来実装）
- **API仕様**: OpenAPI 3.0

## セットアップ

### 1. 依存パッケージインストール

```bash
cd backend
pip install -r requirements.txt
```

### 2. 環境変数設定

```bash
# .env ファイルを作成
cp .env.example .env

# 必要な値を設定
# - SUPABASE_URL: Supabaseプロジェクト URL
# - SUPABASE_ANON_KEY: Supabase anon key
# - SUPABASE_KEY: Supabase service role key（任意）
```

### 3. データベースセットアップ

```bash
# Supabaseでテーブル作成（手動）
# 1. Supabaseダッシュボード > SQL Editor
# 2. ../sql/01_create_tables.sql を実行
# 3. ../sql/02_rls_policies.sql を実行  
# 4. ../sql/03_functions_triggers.sql を実行

# サンプルデータ作成
python scripts/setup_db.py
```

### 4. APIサーバー起動

```bash
# 開発サーバー起動
python run.py

# または
python -m app.main

# または
uvicorn app.main:app --reload
```

## API エンドポイント

### 基本情報
- **ベースURL**: `http://localhost:8000`
- **API ドキュメント**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 単語管理 (/api/v1/words)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/words/` | 単語一覧取得 |
| GET | `/words/{word_id}` | 特定の単語取得 |
| POST | `/words/` | 新しい単語作成 |
| PUT | `/words/{word_id}` | 単語更新 |
| DELETE | `/words/{word_id}` | 単語削除 |

### クエリパラメータ

#### GET /words/
- `limit`: 取得件数（デフォルト: 20, 最大: 100）
- `offset`: オフセット（デフォルト: 0）
- `difficulty`: 難易度フィルタ（1-5）
- `search`: 検索キーワード（単語・意味で検索）

## 使用例

### 単語一覧取得
```bash
curl http://localhost:8000/api/v1/words/
```

### 難易度別単語取得
```bash
curl "http://localhost:8000/api/v1/words/?difficulty=1"
```

### 単語検索
```bash
curl "http://localhost:8000/api/v1/words/?search=apple"
```

### 新しい単語作成
```bash
curl -X POST "http://localhost:8000/api/v1/words/" \
  -H "Content-Type: application/json" \
  -d '{
    "word": "hello",
    "meaning": "こんにちは",
    "pronunciation": "həˈloʊ",
    "example_sentence": "Hello, how are you?",
    "difficulty_level": 1
  }'
```

## プロジェクト構成

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPIアプリケーション
│   ├── config.py            # 設定管理
│   ├── database.py          # データベース接続
│   ├── models.py            # Pydanticモデル
│   ├── routers/
│   │   ├── __init__.py
│   │   └── words.py         # 単語管理API
│   └── services/
│       ├── __init__.py
│       └── word_service.py  # 単語管理サービス
├── scripts/
│   └── setup_db.py          # データベースセットアップ
├── requirements.txt         # 依存パッケージ
├── .env.example            # 環境変数サンプル
├── .env                    # 環境変数（実際の値）
├── run.py                  # サーバー起動スクリプト
└── README.md
```

## 開発情報

### 現在の制限事項
- 認証機能未実装（テスト用固定ユーザーID使用）
- 学習記録API未実装
- 統計API未実装

### 次のステップ
1. Supabase認証統合
2. 学習記録API実装
3. 統計・分析API実装
4. フロントエンド連携

### テスト用ユーザーID
現在のテスト用固定ユーザーID: `550e8400-e29b-41d4-a716-446655440000`

## トラブルシューティング

### よくあるエラー

#### 1. Supabase接続エラー
```
supabase.exceptions.APIError: ...
```
- 環境変数の確認（SUPABASE_URL, SUPABASE_ANON_KEY）
- Supabaseプロジェクトの状態確認

#### 2. テーブル不存在エラー
```
relation "words" does not exist
```
- Supabaseでテーブル作成SQLの実行確認
- RLS設定の確認

#### 3. RLSポリシーエラー
```
new row violates row-level security policy
```
- 認証状態の確認
- ポリシー設定の確認

### ログ確認
```bash
# APIサーバーログ
python run.py

# Supabaseログ
# Supabaseダッシュボード > Logs
```