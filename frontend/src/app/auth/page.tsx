'use client'

import { useState } from "react"
import { AuthHeader } from "@/components/auth/auth-header"
import { LoginForm } from "@/components/auth/login-form"
import { SignUpForm } from "@/components/auth/signup-form"
import { ExtensionPromotion } from "@/components/auth/extension-promotion"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center p-4 pt-12">
      <div className="w-full max-w-md space-y-6">
        <AuthHeader />
        
        {/* ログイン・登録切り替えタブ */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1 grid grid-cols-2 gap-1">
          <Button
            onClick={() => setIsLogin(true)}
            variant="ghost"
            className={`rounded-lg transition-all duration-200 ${
              isLogin 
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
            size="sm"
          >
            ログイン
          </Button>
          <Button
            onClick={() => setIsLogin(false)}
            variant="ghost"
            className={`rounded-lg transition-all duration-200 ${
              !isLogin 
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" 
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
            size="sm"
          >
            新規登録
          </Button>
        </div>

        {/* フォーム表示 */}
        <div className="space-y-6">
          {isLogin ? <LoginForm /> : <SignUpForm />}
        </div>
        
        {/* フッター */}
        <div className="text-center space-y-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isLogin 
              ? "アカウントをお持ちでない場合は、新規登録をご利用ください。" 
              : "すでにアカウントをお持ちの場合は、ログインをご利用ください。"
            }
          </div>
          <ExtensionPromotion />
        </div>
      </div>
    </div>
  )
}