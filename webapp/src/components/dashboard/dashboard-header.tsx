import { Trophy } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center animate-pulse-subtle">
          <Trophy className="h-6 w-6 text-white" />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        <span className="text-gradient">おかえりなさい！</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        語彙学習の進捗を確認し、マスターへの道のりを継続しましょう
      </p>
    </div>
  )
}