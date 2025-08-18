import { Book } from "lucide-react"

export function AuthHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <Book className="h-12 w-12" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vocabeatへようこそ</h1>
        <p className="text-muted-foreground">
          ログインして自動的な語彙学習を始めましょう
        </p>
      </div>
    </div>
  )
}