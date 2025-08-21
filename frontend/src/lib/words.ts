import { supabase } from './supabase'
import type { Word } from '@/types'

export interface SupabaseWord {
  id: string
  word: string
  meaning: string
  pronunciation?: string
  example_sentence?: string
  difficulty_level: number
  created_at: string
  updated_at: string
  user_id: string
}

export interface GetWordsParams {
  limit?: number
  offset?: number
  difficulty?: number
  search?: string
}

/**
 * Supabaseから単語一覧を取得
 */
export async function getWords(params: GetWordsParams = {}): Promise<Word[]> {
  try {
    let query = supabase
      .from('words')
      .select('*')
      .order('created_at', { ascending: false })

    // 難易度フィルタ
    if (params.difficulty) {
      query = query.eq('difficulty_level', params.difficulty)
    }

    // 検索フィルタ
    if (params.search) {
      query = query.or(`word.ilike.%${params.search}%,meaning.ilike.%${params.search}%`)
    }

    // ページング
    if (params.offset) {
      query = query.range(params.offset, (params.offset + (params.limit || 20)) - 1)
    } else if (params.limit) {
      query = query.limit(params.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Failed to fetch words: ${error.message}`)
    }

    if (!data) {
      return []
    }

    return data.map(transformSupabaseWordToWord)
  } catch (error) {
    console.error('Error fetching words from Supabase:', error)
    throw error
  }
}

/**
 * Supabaseから特定の単語を取得
 */
export async function getWordFromSupabase(wordId: string): Promise<Word | null> {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('id', wordId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Supabase error:', error)
      throw new Error(`Failed to fetch word: ${error.message}`)
    }

    return transformSupabaseWordToWord(data)
  } catch (error) {
    console.error('Error fetching word from Supabase:', error)
    throw error
  }
}

/**
 * 新しい単語をSupabaseに作成
 */
export async function createWordInSupabase(wordData: {
  word: string
  meaning: string
  pronunciation?: string
  example_sentence?: string
  difficulty_level: number
}): Promise<Word> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated to create words')
    }

    const { data, error } = await supabase
      .from('words')
      .insert([
        {
          ...wordData,
          user_id: user.id
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Failed to create word: ${error.message}`)
    }

    return transformSupabaseWordToWord(data)
  } catch (error) {
    console.error('Error creating word in Supabase:', error)
    throw error
  }
}

/**
 * 単語統計を取得
 */
export async function getWordsStatsFromSupabase(): Promise<{
  total_words: number
  difficulty_distribution: Record<number, number>
  latest_word?: string
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated to get stats')
    }

    // 総単語数を取得
    const { count: totalWords, error: countError } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      throw new Error(`Failed to get word count: ${countError.message}`)
    }

    // 難易度別分布を取得
    const { data: difficultyData, error: diffError } = await supabase
      .from('words')
      .select('difficulty_level')
      .eq('user_id', user.id)

    if (diffError) {
      throw new Error(`Failed to get difficulty distribution: ${diffError.message}`)
    }

    const difficultyDistribution: Record<number, number> = {}
    difficultyData?.forEach(item => {
      const level = item.difficulty_level
      difficultyDistribution[level] = (difficultyDistribution[level] || 0) + 1
    })

    // 最新の単語を取得
    const { data: latestWord, error: latestError } = await supabase
      .from('words')
      .select('word')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (latestError && latestError.code !== 'PGRST116') {
      throw new Error(`Failed to get latest word: ${latestError.message}`)
    }

    return {
      total_words: totalWords || 0,
      difficulty_distribution: difficultyDistribution,
      latest_word: latestWord?.word
    }
  } catch (error) {
    console.error('Error fetching words stats from Supabase:', error)
    throw error
  }
}

/**
 * Supabase Wordを Wordに変換
 */
function transformSupabaseWordToWord(supabaseWord: SupabaseWord): Word {
  // difficulty_level を 1-5 の数値から easy/medium/hard に変換
  const difficultyMap = {
    1: 'easy' as const,
    2: 'easy' as const,
    3: 'medium' as const,
    4: 'hard' as const,
    5: 'hard' as const,
  }

  return {
    id: supabaseWord.id,
    word: supabaseWord.word,
    meaning: supabaseWord.meaning,
    translation: supabaseWord.meaning, // 同じ値を使用
    difficulty: difficultyMap[supabaseWord.difficulty_level as keyof typeof difficultyMap] || 'medium',
    sourceUrl: undefined, // 必要に応じて追加
    sourceText: supabaseWord.example_sentence || undefined,
    createdAt: new Date(supabaseWord.created_at),
    lastReviewed: null, // learning_recordsテーブルから取得する場合は別途実装
    reviewCount: 0, // learning_recordsテーブルから計算する場合は別途実装
    correctCount: 0 // learning_recordsテーブルから計算する場合は別途実装
  }
}