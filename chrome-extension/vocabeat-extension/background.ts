console.log('🚀 Vocabeat: Background script loaded')

class BackgroundService {
  constructor() {
    this.init()
  }

  private async init() {
    console.log('🚀 Vocabeat Background Service: Initializing')

    // Set up message listeners
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this))

    console.log('✅ Vocabeat Background Service: Ready')
  }

  private async handleMessage(
    message: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): Promise<void> {
    console.log('📨 Vocabeat: Received message:', message.type, message)

    try {
      switch (message.type) {
        case 'WORD_EXTRACTED':
          console.log('📚 Vocabeat: Handling WORD_EXTRACTED message')
          await this.handleWordExtracted(message.payload)
          sendResponse({ success: true })
          break

        default:
          console.warn('⚠️ Vocabeat: Unknown message type:', message.type)
          sendResponse({ success: false, error: 'Unknown message type' })
      }
    } catch (error) {
      console.error('❌ Vocabeat: Error handling message:', error)
      sendResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }

    // Return true to indicate we will send a response asynchronously
    return true
  }

  private async handleWordExtracted(word: any) {
    try {
      console.log('📚 Vocabeat: Processing extracted word:', word.english_word)

      // Save to Chrome storage first (fast)
      const result = await chrome.storage.local.get(['vocabeat_words'])
      const existingWords = result.vocabeat_words || []
      
      // Add new word
      const newWord = {
        ...word,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        user_id: 'chrome_extension' // Placeholder until we have proper auth
      }
      
      existingWords.push(newWord)
      
      // Keep only last 50 words
      const wordsToSave = existingWords.slice(-50)
      
      await chrome.storage.local.set({ vocabeat_words: wordsToSave })
      
      console.log('✅ Vocabeat: Word saved to local storage:', word.english_word)

      // Try to save to Supabase
      await this.saveToSupabase(newWord)

      // Update badge
      await this.updateBadge(wordsToSave.length)

      // Show success notification
      this.showNotification('success', `Added "${word.english_word}" to your vocabulary!`)

    } catch (error) {
      console.error('❌ Vocabeat: Error processing word:', error)
      this.showNotification('error', 'Failed to save word. Please try again.')
    }
  }

  private async saveToSupabase(word: any) {
    try {
      console.log('🔗 Vocabeat: Attempting to save to Supabase...')
      console.log('📝 Word data received:', word)
      
      const supabaseUrl = 'https://kwuzzirstoqjnxpdjkan.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3dXp6aXJzdG9xam54cGRqa2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTcyMjQsImV4cCI6MjA3MTA5MzIyNH0.U-yxHbJNz--K5mR0IBRdxvl3FZ4wJVVZ1M2eUTvNsk0'
      
      // Check if word already exists
      console.log('🔍 Checking if word already exists in Supabase...')
      const checkResponse = await fetch(`${supabaseUrl}/rest/v1/words?english_word=eq.${encodeURIComponent(word.english_word)}&select=id`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      })

      if (checkResponse.ok) {
        const existingWords = await checkResponse.json()
        if (existingWords && existingWords.length > 0) {
          console.log('ℹ️ Vocabeat: Word already exists in Supabase:', word.english_word)
          return
        }
      }

      // Prepare the word data for Supabase
      const wordData = {
        word: word.english_word,
        meaning: word.japanese_meaning,
        // translation_source: word.translation_source || 'google_translate',
        // confidence_level: word.confidence_level || 0.8,
        // review_count: word.review_count || 0,
        // difficulty: word.difficulty || 'medium',
        // context: word.context || '',
        created_at: new Date().toISOString()
        // Note: user_id will be null for now, until we implement proper authentication
      }

      console.log('📤 Vocabeat: Sending to Supabase:', JSON.stringify(wordData, null, 2))

      const response = await fetch(`${supabaseUrl}/rest/v1/words`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(wordData)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        console.log('✅ Vocabeat: Successfully saved to Supabase')
        
        // Also log the response body if available
        const responseText = await response.text()
        if (responseText) {
          console.log('📄 Response body:', responseText)
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Vocabeat: Supabase save failed:', response.status, response.statusText)
        console.error('📄 Error response body:', errorText)
        
        // Try to parse error details
        try {
          const errorData = JSON.parse(errorText)
          console.error('🔍 Parsed error:', errorData)
        } catch (parseError) {
          console.error('🔍 Raw error text:', errorText)
        }
        
        // If it's an auth error, just log it but don't show error to user
        if (response.status === 401 || response.status === 403) {
          console.log('ℹ️ Vocabeat: Authentication required for Supabase. Word saved locally only.')
        }
      }
    } catch (error) {
      console.error('❌ Vocabeat: Network error saving to Supabase:', error)
      console.error('🔍 Error details:', error.message, error.stack)
      console.log('ℹ️ Vocabeat: Word saved locally only.')
    }
  }

  private async updateBadge(wordCount: number) {
    try {
      chrome.action.setBadgeText({ text: wordCount > 0 ? wordCount.toString() : '' })
      chrome.action.setBadgeBackgroundColor({ color: '#8b5cf6' })
    } catch (error) {
      console.error('❌ Vocabeat: Error updating badge:', error)
    }
  }

  private showNotification(type: 'success' | 'error', message: string) {
    try {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.plasmo.a78c509e.png',
        title: 'Vocabeat',
        message,
        silent: type === 'success'
      })
    } catch (error) {
      console.error('❌ Vocabeat: Error showing notification:', error)
    }
  }
}

// Initialize the background service
new BackgroundService()

console.log('✅ Vocabeat: Background script initialization complete')