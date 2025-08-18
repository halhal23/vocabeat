import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, TrendingUp, Target, Clock, Sparkles, Zap, Calendar } from "lucide-react"

const mockStats = {
  totalWords: 245,
  wordsLearned: 180,
  streakDays: 12,
  todayTime: 25
}

export function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-900/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">総単語数</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Book className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">{mockStats.totalWords}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-2">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            先週から +12
          </p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">習得済み単語</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{mockStats.wordsLearned}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-2">
            <Target className="h-3 w-3 mr-1 text-blue-500" />
            習得率 {Math.round((mockStats.wordsLearned / mockStats.totalWords) * 100)}%
          </p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-900/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">連続日数</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{mockStats.streakDays}日</div>
          <p className="text-xs text-muted-foreground flex items-center mt-2">
            <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />
            その調子で継続！
          </p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-900 dark:to-orange-900/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">今日の学習時間</CardTitle>
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Clock className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{mockStats.todayTime}分</div>
          <p className="text-xs text-muted-foreground flex items-center mt-2">
            <Calendar className="h-3 w-3 mr-1 text-orange-500" />
            目標: 30分
          </p>
        </CardContent>
      </Card>
    </div>
  )
}