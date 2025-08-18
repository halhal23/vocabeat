# Supabase認証システム実装手順書

## 概要
VocaBeatアプリにSupabaseを使用したユーザー認証システムを実装します。メール/パスワード認証とGoogle OAuth認証の両方をサポートします。

**前提条件**: Supabaseプロジェクト「vocabase」が既に作成済み

## 実装手順

### 1. Supabaseプロジェクトの設定

#### 1.1 認証設定
1. Supabaseダッシュボード → Authentication → Settings
2. Site URL: `http://localhost:3000`（開発時）、本番URL（デプロイ時）
3. Redirect URLs: `http://localhost:3000/auth/callback`を追加

#### 1.2 Google OAuth設定
1. [Google Cloud Console](https://console.cloud.google.com)でプロジェクト作成
2. OAuth 2.0 クライアントIDを作成
3. 承認済みリダイレクトURI: `https://[vocabase-project-ref].supabase.co/auth/v1/callback`
4. SupabaseのAuthentication → Providers → Googleを有効化
5. Client IDとClient Secretを設定

### 2. データベース設計

#### 2.1 認証テーブル（Supabaseが自動生成）
- `auth.users`: ユーザー基本情報
- `auth.sessions`: セッション管理
- `auth.identities`: OAuth プロバイダー情報

#### 2.2 カスタムプロファイルテーブル
```sql
-- プロファイルテーブル作成
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 設定
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のプロファイルのみ参照・更新可能
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- プロファイル自動作成トリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### 2.3 単語学習関連テーブル
```sql
-- 単語テーブル
CREATE TABLE public.words (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    pronunciation TEXT,
    example_sentence TEXT,
    difficulty_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学習記録テーブル
CREATE TABLE public.learning_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    word_id UUID REFERENCES public.words(id) ON DELETE CASCADE NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time INTEGER, -- ミリ秒
    studied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS設定
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_records ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can manage own words" ON public.words
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning records" ON public.learning_records
    FOR ALL USING (auth.uid() = user_id);
```

### 3. 必要なパッケージインストール

```bash
cd webapp
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 4. 環境変数設定

#### 4.1 `.env.local`ファイル作成
```env
NEXT_PUBLIC_SUPABASE_URL=https://[vocabase-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[vocabase-anon-key]
```
**注意**: 実際のURLとキーはSupabaseダッシュボードの Settings → API から取得してください

### 5. Supabaseクライアント設定

#### 5.1 `src/lib/supabase.ts`作成
```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

#### 5.2 型定義生成
```bash
npx supabase gen types typescript --project-id vocabase > src/types/supabase.ts
```

### 6. 認証コンテキスト実装

#### 6.1 `src/contexts/AuthContext.tsx`作成
```typescript
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初期セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    // セッション変更監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    loading,
    signUp: (email: string, password: string) =>
      supabase.auth.signUp({ email, password }),
    signIn: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signInWithGoogle: () =>
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      }),
    signOut: () => supabase.auth.signOut()
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### 7. 認証コールバック処理

#### 7.1 `src/app/auth/callback/route.ts`作成
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=Authentication failed`)
}
```

### 8. 認証コンポーネント更新

#### 8.1 `src/components/auth/login-form.tsx`更新
既存のログインフォームにSupabase認証を統合:
```typescript
'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <div>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </Button>
      
      <Button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full"
        variant="outline"
      >
        Googleでログイン
      </Button>
    </form>
  )
}
```

### 9. ユーザー登録コンポーネント作成

#### 9.1 `src/components/auth/signup-form.tsx`作成
```typescript
'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    const { error } = await signUp(email, password)
    if (error) {
      setError(error.message)
    } else {
      setMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。')
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      {message && (
        <div className="text-green-500 text-sm">{message}</div>
      )}
      
      <div>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="パスワード（6文字以上）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'アカウント作成中...' : 'アカウント作成'}
      </Button>
    </form>
  )
}
```

### 10. 認証保護されたルート

#### 10.1 `src/components/auth/ProtectedRoute.tsx`作成
```typescript
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
```

### 11. レイアウト更新

#### 11.1 `src/app/layout.tsx`更新
```typescript
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 12. テストとデプロイ

#### 12.1 テスト項目
- [ ] メールアドレスでの新規登録
- [ ] メール認証の確認
- [ ] メール/パスワードでのログイン
- [ ] Googleでのログイン
- [ ] ログアウト機能
- [ ] 認証保護されたページのアクセス制御

#### 12.2 本番デプロイ時の設定
1. Supabase Settings → Auth → Site URLを本番URLに更新
2. Google Cloud ConsoleでリダイレクトURIを本番URL用に追加
3. 環境変数を本番環境に設定

## セキュリティ考慮事項

1. **Row Level Security (RLS)**: 全てのテーブルでRLSを有効化
2. **API認証**: Supabase APIキーの適切な管理
3. **HTTPS**: 本番環境では必ずHTTPSを使用
4. **パスワードポリシー**: 適切なパスワード強度の設定
5. **セッション管理**: 適切なセッションタイムアウト設定

## トラブルシューティング

### よくある問題と解決方法

1. **認証コールバックエラー**
   - リダイレクトURIの設定確認
   - CORS設定の確認

2. **RLSポリシーエラー**
   - ポリシー設定の確認
   - ユーザーIDの正しい参照

3. **型エラー**
   - Supabase型定義の再生成
   - TypeScript設定の確認

## 参考資料

- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Google OAuth Setup Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)