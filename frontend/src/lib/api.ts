const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiWord {
  id: string
  word: string
  meaning: string
  difficulty_level: number
  created_at: string
  updated_at: string
  user_id: string
  pronunciation?: string
  example_sentence?: string
}

export interface GetWordsParams {
  limit?: number
  offset?: number
  difficulty?: number
  search?: string
}

/**
 * APIから単語一覧を取得
 */
export async function getWords(params: GetWordsParams = {}): Promise<ApiWord[]> {
  const searchParams = new URLSearchParams()
  
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.offset) searchParams.set('offset', params.offset.toString())
  if (params.difficulty) searchParams.set('difficulty', params.difficulty.toString())
  if (params.search) searchParams.set('search', params.search)

  const url = `${API_BASE_URL}/api/v1/mock-words/?${searchParams.toString()}`
  
  try {
    console.log('Fetching from URL:', url)
    console.log('API_BASE_URL:', API_BASE_URL)
    
    const response = await fetch(url)
    
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response error:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const words = await response.json()
    console.log('Received words:', words)
    return words
  } catch (error) {
    console.error('Error fetching words:', error)
    throw error
  }
}

/**
 * APIから特定の単語を取得
 */
export async function getWord(wordId: string): Promise<ApiWord> {
  const url = `${API_BASE_URL}/words/${wordId}`
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const word = await response.json()
    return word
  } catch (error) {
    console.error('Error fetching word:', error)
    throw error
  }
}

/**
 * API Wordを Wordに変換
 */
export function transformApiWordToWord(apiWord: ApiWord): import('../types/index').Word {
  // difficulty_level を 1-5 の数値から easy/medium/hard に変換
  const difficultyMap = {
    1: 'easy' as const,
    2: 'easy' as const,
    3: 'medium' as const,
    4: 'hard' as const,
    5: 'hard' as const,
  }

  return {
    id: apiWord.id,
    word: apiWord.word,
    meaning: apiWord.meaning,
    translation: apiWord.meaning, // 同じ値を使用
    difficulty: difficultyMap[apiWord.difficulty_level as keyof typeof difficultyMap] || 'medium',
    sourceUrl: undefined, // mock data doesn't have source URL
    sourceText: apiWord.example_sentence || undefined,
    createdAt: new Date(apiWord.created_at),
    lastReviewed: null, // mock data doesn't have last reviewed
    reviewCount: 0, // mock data doesn't have review count
    correctCount: 0 // mock data doesn't have correct count
  }
}