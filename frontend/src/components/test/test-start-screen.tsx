import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"

interface TestStartScreenProps {
  questionCount: number
  onStartTest: () => void
}

export function TestStartScreen({ questionCount, onStartTest }: TestStartScreenProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">語彙テスト</h1>
          <p className="text-muted-foreground">
            あなた専用の問題で語彙力をテスト
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              クイックテスト
            </CardTitle>
            <CardDescription>
              最近学習した単語に関する問題に答えましょう
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{questionCount}</div>
                <div className="text-sm text-muted-foreground">問題数</div>
              </div>
              <div>
                <div className="text-2xl font-bold">~5</div>
                <div className="text-sm text-muted-foreground">分</div>
              </div>
              <div>
                <div className="text-2xl font-bold">混合</div>
                <div className="text-sm text-muted-foreground">難易度</div>
              </div>
            </div>
            <Button onClick={onStartTest} className="w-full" size="lg">
              テスト開始
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}