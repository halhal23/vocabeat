import { Code2 } from "lucide-react"

export function AuthHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center animate-tech-pulse">
          <Code2 className="h-6 w-6 text-white" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Vocabeatへようこそ</h1>
        <p className="text-gray-600 dark:text-gray-300">
          ログインして自動的な語彙学習を始めましょう
        </p>
      </div>
    </div>
  )
}