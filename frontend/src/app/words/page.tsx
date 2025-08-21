"use client"

import { useState, useEffect } from "react"
import { WordsHeader } from "@/components/words/words-header"
import { WordsFilters } from "@/components/words/words-filters"
import { WordCard } from "@/components/words/word-card"
import { WordsEmptyState } from "@/components/words/words-empty-state"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { getWords } from "@/lib/words"
import type { Word } from "@/types"

export default function WordsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // APIから単語を取得
  useEffect(() => {
    const fetchWords = async () => {
      try {
        console.log('Starting to fetch words...')
        setLoading(true)
        setError(null)
        
        const difficultyNum = selectedDifficulty === 'easy' ? 1 
                            : selectedDifficulty === 'medium' ? 3 
                            : selectedDifficulty === 'hard' ? 5 
                            : undefined

        console.log('Supabase params:', { 
          limit: 100,
          search: searchTerm || undefined,
          difficulty: difficultyNum
        })

        const words = await getWords({ 
          limit: 100,
          search: searchTerm || undefined,
          difficulty: difficultyNum
        })
        
        console.log('Supabase response:', words)
        setWords(words)
      } catch (err) {
        console.error('Failed to fetch words:', err)
        setError('単語の読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchWords()
  }, [searchTerm, selectedDifficulty])

  const filteredWords = words.filter(word => {
    const matchesSearch = !searchTerm || 
                         word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = !selectedDifficulty || word.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <WordsHeader />
        
        <WordsFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
        />

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">単語を読み込んでいます...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              再試行
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-3 sm:gap-4">
              {filteredWords.map((word) => (
                <WordCard key={word.id} word={word} />
              ))}
            </div>

            {filteredWords.length === 0 && (
              <WordsEmptyState searchTerm={searchTerm} />
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}