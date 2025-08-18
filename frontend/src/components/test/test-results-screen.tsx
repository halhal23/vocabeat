import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw } from "lucide-react"

interface TestResult {
  questionId: string
  isCorrect: boolean
  userAnswer: string
}

interface TestResultsScreenProps {
  testResults: TestResult[]
  onStartTest: () => void
}

export function TestResultsScreen({ testResults, onStartTest }: TestResultsScreenProps) {
  const correct = testResults.filter(result => result.isCorrect).length
  const total = testResults.length
  const percentage = Math.round((correct / total) * 100)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">テスト完了！</h1>
          <p className="text-muted-foreground">
            あなたの結果です
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="text-4xl font-bold mb-2">{percentage}%</div>
            <CardTitle>
              {total}問中{correct}問正解
            </CardTitle>
            <CardDescription>
              {percentage >= 80 ? "素晴らしい結果です！ 🎉" : 
               percentage >= 60 ? "良い結果です！継続して頑張りましょう 💪" :
               "学習を続ければ必ず上達します！ 📚"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResults.map((result, index) => (
              <div key={result.questionId} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">問題 {index + 1}</span>
                </div>
                <Badge className={result.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {result.isCorrect ? "正解" : "不正解"}
                </Badge>
              </div>
            ))}
            <div className="flex gap-4 pt-4">
              <Button onClick={onStartTest} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                再挑戦
              </Button>
              <Button variant="outline" className="flex-1">
                単語を復習
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}