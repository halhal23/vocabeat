import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface WordsFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDifficulty: string | null
  setSelectedDifficulty: (difficulty: string | null) => void
}

export function WordsFilters({ 
  searchTerm, 
  setSearchTerm, 
  selectedDifficulty, 
  setSelectedDifficulty 
}: WordsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="単語を検索..."
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={selectedDifficulty === null ? "default" : "outline"}
          onClick={() => setSelectedDifficulty(null)}
          size="sm"
        >
          すべて
        </Button>
        <Button
          variant={selectedDifficulty === "easy" ? "default" : "outline"}
          onClick={() => setSelectedDifficulty("easy")}
          size="sm"
        >
          簡単
        </Button>
        <Button
          variant={selectedDifficulty === "medium" ? "default" : "outline"}
          onClick={() => setSelectedDifficulty("medium")}
          size="sm"
        >
          普通
        </Button>
        <Button
          variant={selectedDifficulty === "hard" ? "default" : "outline"}
          onClick={() => setSelectedDifficulty("hard")}
          size="sm"
        >
          難しい
        </Button>
      </div>
    </div>
  )
}