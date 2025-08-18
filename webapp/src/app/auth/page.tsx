import { AuthHeader } from "@/components/auth/auth-header"
import { LoginForm } from "@/components/auth/login-form"
import { ExtensionPromotion } from "@/components/auth/extension-promotion"

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto space-y-6">
        <AuthHeader />
        <LoginForm />
        <ExtensionPromotion />
        
        <div className="text-center text-xs text-muted-foreground">
          Vocabeatは初めてですか？ログインするとアカウントが自動的に作成されます。
        </div>
      </div>
    </div>
  )
}