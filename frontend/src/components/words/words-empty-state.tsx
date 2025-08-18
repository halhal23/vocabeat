import { BookOpen } from "lucide-react"

interface WordsEmptyStateProps {
  searchTerm: string
}

export function WordsEmptyState({ searchTerm }: WordsEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">単語が見つかりません</h3>
      <p className="text-muted-foreground">
        {searchTerm ? "検索条件を調整してみてください" : "Chrome拡張機能を使って自動的に単語を収集を開始しましょう"}
      </p>
    </div>
  )
}