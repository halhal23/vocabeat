import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const mockRecentWords = [
  { word: "implement", meaning: "実装する", difficulty: "medium" as const },
  { word: "architecture", meaning: "設計", difficulty: "hard" as const },
  { word: "deprecated", meaning: "非推奨", difficulty: "easy" as const },
  { word: "scalable", meaning: "拡張可能な", difficulty: "medium" as const },
]

export function RecentWordsCard() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>最近の単語</CardTitle>
        <CardDescription>
          最近のブラウジングで遭遇した単語
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecentWords.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="space-y-1">
                <p className="font-medium">{item.word}</p>
                <p className="text-sm text-muted-foreground">{item.meaning}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.difficulty === 'easy' ? '簡単' : 
                   item.difficulty === 'medium' ? '普通' : '難しい'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}