import { Card, CardContent } from "@/components/ui/card"
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
      case 'easy': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
      case 'medium': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
      case 'hard': return 'bg-red-500/20 text-red-400 border border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
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
    <Card className="card-tech group hover:glow-intense transition-all duration-300">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-foreground truncate tracking-tight">{word.word}</h3>
              <Badge className={`${getDifficultyColor(word.difficulty)} text-xs px-1.5 py-0.5 font-medium shrink-0 rounded-md`}>
                {getDifficultyText(word.difficulty)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-tight">{word.meaning}</p>
            {word.sourceText && (
              <p className="text-xs text-muted-foreground/70 mt-1 truncate italic">
                &quot;{word.sourceText}&quot;
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-3 shrink-0">
            {word.reviewCount > 0 && (
              <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium text-xs">{getAccuracyRate()}%</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 backdrop-blur-sm">
              <span className="text-primary/80 font-medium text-xs">復習 {word.reviewCount}回</span>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground/60">
            追加日: {word.createdAt.toLocaleDateString('ja-JP')}
            {word.lastReviewed && (
              <span className="ml-3 text-muted-foreground/40">
                最終復習: {word.lastReviewed.toLocaleDateString('ja-JP')}
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}