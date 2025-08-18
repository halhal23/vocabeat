"use client"

import { useState } from "react"
import { WordsHeader } from "@/components/words/words-header"
import { WordsFilters } from "@/components/words/words-filters"
import { WordCard } from "@/components/words/word-card"
import { WordsEmptyState } from "@/components/words/words-empty-state"

const mockWords = [
  {
    id: "1",
    word: "implement",
    meaning: "実装する",
    translation: "To put a decision or plan into effect",
    difficulty: "medium" as const,
    sourceUrl: "https://docs.react.dev/learn",
    sourceText: "implement the useState hook",
    createdAt: new Date("2024-01-15"),
    lastReviewed: new Date("2024-01-20"),
    reviewCount: 3,
    correctCount: 2,
  },
  {
    id: "2",
    word: "architecture",
    meaning: "設計",
    translation: "The design and structure of a system",
    difficulty: "hard" as const,
    sourceUrl: "https://github.com/facebook/react",
    sourceText: "React's component architecture",
    createdAt: new Date("2024-01-14"),
    lastReviewed: new Date("2024-01-19"),
    reviewCount: 5,
    correctCount: 4,
  },
  {
    id: "3",
    word: "deprecated",
    meaning: "非推奨",
    translation: "No longer recommended for use",
    difficulty: "easy" as const,
    sourceUrl: "https://nodejs.org/docs",
    sourceText: "This API is deprecated",
    createdAt: new Date("2024-01-13"),
    lastReviewed: new Date("2024-01-18"),
    reviewCount: 2,
    correctCount: 2,
  },
  {
    id: "4",
    word: "scalable",
    meaning: "拡張可能な",
    translation: "Able to be scaled or expanded",
    difficulty: "medium" as const,
    sourceUrl: "https://aws.amazon.com/docs",
    sourceText: "building scalable applications",
    createdAt: new Date("2024-01-12"),
    lastReviewed: null,
    reviewCount: 0,
    correctCount: 0,
  },
]

export default function WordsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  const filteredWords = mockWords.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = !selectedDifficulty || word.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <WordsHeader />
      
      <WordsFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />

      <div className="grid gap-4">
        {filteredWords.map((word) => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>

      {filteredWords.length === 0 && (
        <WordsEmptyState searchTerm={searchTerm} />
      )}
    </div>
  )
}