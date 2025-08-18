import { Button } from "@/components/ui/button"
import { Book, Target } from "lucide-react"

export function DashboardActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button className="flex-1 gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <Book className="mr-2 h-5 w-5" />
        新しい単語を学習
      </Button>
      <Button variant="outline" className="flex-1 border-2 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-300">
        <Target className="mr-2 h-5 w-5" />
        クイックテスト
      </Button>
    </div>
  )
}