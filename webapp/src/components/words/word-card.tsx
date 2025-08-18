import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp } from "lucide-react"

interface WordData {
  id: string
  word: string
  meaning: string
  translation: string
  difficulty: "easy" | "medium" | "hard"
  sourceUrl?: string
  sourceText?: string
  createdAt: Date
  lastReviewed: Date | null
  reviewCount: number
  correctCount: number
}

interface WordCardProps {
  word: WordData
}

export function WordCard({ word }: WordCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '簡単'
      case 'medium': return '普通'
      case 'hard': return '難しい'
      default: return difficulty
    }
  }

  const getAccuracyRate = () => {
    if (word.reviewCount === 0) return null
    return Math.round((word.correctCount / word.reviewCount) * 100)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">{word.word}</h3>
              <Badge className={getDifficultyColor(word.difficulty)}>
                {getDifficultyText(word.difficulty)}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{word.meaning}</p>
            <p className="text-sm text-muted-foreground italic">
              &quot;{word.translation}&quot;
            </p>
          </div>
          <div className="text-right space-y-2">
            {word.reviewCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                正答率 {getAccuracyRate()}%
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {word.reviewCount}回復習
            </div>
          </div>
        </div>
        
        {word.sourceText && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              出典: <span className="italic">&quot;{word.sourceText}&quot;</span>
            </p>
            {word.sourceUrl && (
              <a
                href={word.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                {word.sourceUrl}
              </a>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs text-muted-foreground">
            追加日: {word.createdAt.toLocaleDateString('ja-JP')}
            {word.lastReviewed && (
              <span> • 最終復習: {word.lastReviewed.toLocaleDateString('ja-JP')}</span>
            )}
          </p>
          <Button variant="outline" size="sm">
            今すぐ復習
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}