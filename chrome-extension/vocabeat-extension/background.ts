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
    return true as any
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
      
      const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase configuration missing')
        console.error('- PLASMO_PUBLIC_SUPABASE_URL:', supabaseUrl)
        console.error('- PLASMO_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '[REDACTED]' : 'undefined')
        return
      }
      
      // Get authenticated user ID first
      const userId = await this.getCurrentUserId()
      console.log('🔍 User ID result:', userId)

      // If no user ID found, skip Supabase save (save locally only)
      if (!userId) {
        console.log('ℹ️ No authenticated user found, skipping Supabase save')
        return
      }

      // Check if word already exists for this user
      console.log('🔍 Checking if word already exists for this user in Supabase...')
      const checkResponse = await fetch(`${supabaseUrl}/rest/v1/words?word=eq.${encodeURIComponent(word.english_word)}&user_id=eq.${encodeURIComponent(userId)}&select=id`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        }
      })

      if (checkResponse.ok) {
        const existingWords = await checkResponse.json()
        if (existingWords && existingWords.length > 0) {
          console.log('ℹ️ Vocabeat: Word already exists for this user in Supabase:', word.english_word)
          this.showNotification('success', `"${word.english_word}" is already in your vocabulary`)
          return
        }
      } else {
        console.log('⚠️ Failed to check existing words:', checkResponse.status, checkResponse.statusText)
      }

      // Prepare the word data for Supabase
      const wordData = {
        word: word.english_word,
        meaning: word.japanese_meaning,
        user_id: userId,
        created_at: new Date().toISOString()
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
      // ヘッダーのログ出力を簡略化
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      console.log('📡 Response headers:', headers)

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

  private async getCurrentUserId(): Promise<string | null> {
    try {
      console.log('🔍 Getting current user ID...')
      
      // Method 1: Check for manually stored user ID
      console.log('👤 Checking for manually stored user ID...')
      const manualUserId = await chrome.storage.local.get('vocabeat_user_id')
      if (manualUserId.vocabeat_user_id) {
        console.log('✅ Found manually stored user ID:', manualUserId.vocabeat_user_id)
        return manualUserId.vocabeat_user_id
      }

      // Method 2: Try to get user ID from Vocabeat frontend tab
      console.log('🌐 Checking Vocabeat frontend tabs...')
      const userId = await this.getUserIdFromVocabeatTab()
      if (userId) {
        console.log('✅ Found user ID from Vocabeat frontend:', userId)
        // Store it for future use
        await chrome.storage.local.set({ vocabeat_user_id: userId })
        return userId
      }

      // Method 3: Check Chrome storage for Supabase session
      console.log('📁 Checking Chrome storage...')
      const storageResult = chrome.storage.local.get(null)
      const storage = await storageResult
      if (storage) {
        console.log('📁 Chrome storage contents:', Object.keys(storage))
        
        for (const [key, value] of Object.entries(storage)) {
          console.log(`📁 Checking key: ${key}`)
          if (key.includes('supabase') || key.includes('auth') || key.includes('sb-') || key.includes('session')) {
            console.log(`📁 Found auth-related key: ${key}`, value)
            const userIdFromSession = this.extractUserIdFromSession(value)
            if (userIdFromSession) {
              console.log('✅ User ID from Chrome storage:', userIdFromSession)
              return userIdFromSession
            }
          }
        }
      }
      
      // Method 2: Try to get session from localhost
      console.log('🌐 Checking localhost session...')
      try {
        const response = await fetch('http://localhost:3000/api/auth/session', {
          credentials: 'include',
          mode: 'cors'
        })
        
        if (response.ok) {
          const session = await response.json()
          console.log('🌐 Session from localhost:', session)
          const userId = this.extractUserIdFromSession(session)
          if (userId) {
            console.log('✅ User ID from localhost:', userId)
            return userId
          }
        } else {
          console.log('🌐 Localhost auth API not available:', response.status)
        }
      } catch (error) {
        console.log('🌐 Could not connect to localhost:', error.message)
      }
      
      // Method 3: Check cookies from multiple domains
      console.log('🍪 Checking cookies...')
      const cookieDomains = ['.supabase.co', 'kwuzzirstoqjnxpdjkan.supabase.co', 'localhost']
      
      for (const domain of cookieDomains) {
        try {
          console.log(`🍪 Checking cookies for domain: ${domain}`)
          const cookies = await chrome.cookies.getAll({ domain })
          console.log(`🍪 ${domain} cookies:`, cookies.map(c => c.name))
          
          for (const cookie of cookies) {
            if (cookie.name.includes('auth') || cookie.name.includes('session') || cookie.name.includes('sb-')) {
              console.log(`🍪 Found auth cookie: ${cookie.name}`, cookie.value)
              const userId = this.extractUserIdFromSession(cookie.value)
              if (userId) {
                console.log('✅ User ID from cookies:', userId)
                return userId
              }
            }
          }
        } catch (error) {
          console.log(`🍪 Cookie access not available for ${domain}:`, error.message)
        }
      }
      
      // No authentication found
      console.log('❌ No authenticated user found')
      return null
      
    } catch (error) {
      console.error('❌ Error getting user ID:', error)
      return null
    }
  }


  private extractUserIdFromSession(session: any): string | null {
    try {
      console.log('🔍 Extracting user ID from session:', typeof session, session)
      
      // Direct user object
      if (session?.user?.id) {
        console.log('✅ Found user.id:', session.user.id)
        return session.user.id
      }
      
      // Supabase auth token format
      if (session?.['supabase.auth.token']?.user?.id) {
        console.log('✅ Found supabase.auth.token.user.id:', session['supabase.auth.token'].user.id)
        return session['supabase.auth.token'].user.id
      }
      
      // String format (JSON encoded)
      if (typeof session === 'string') {
        try {
          const parsed = JSON.parse(session)
          console.log('🔍 Parsed string session:', parsed)
          
          if (parsed?.user?.id) {
            console.log('✅ Found parsed user.id:', parsed.user.id)
            return parsed.user.id
          }
          
          if (parsed?.access_token) {
            // Try to decode JWT payload
            const payload = this.decodeJWTPayload(parsed.access_token)
            if (payload?.sub) {
              console.log('✅ Found JWT sub:', payload.sub)
              return payload.sub
            }
          }
        } catch (parseError) {
          console.log('❌ Failed to parse session string:', parseError.message)
        }
      }
      
      // Check if it might be a JWT token directly
      if (typeof session === 'string' && session.startsWith('eyJ')) {
        const payload = this.decodeJWTPayload(session)
        if (payload?.sub) {
          console.log('✅ Found direct JWT sub:', payload.sub)
          return payload.sub
        }
      }
      
      console.log('❌ No user ID found in session')
      return null
    } catch (error) {
      console.error('❌ Error extracting user ID:', error)
      return null
    }
  }

  private decodeJWTPayload(token: string): any {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      
      const payload = parts[1]
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decoded)
    } catch (error) {
      console.log('❌ Failed to decode JWT:', error.message)
      return null
    }
  }

  private async getUserIdFromVocabeatTab(): Promise<string | null> {
    try {
      // Get all tabs that might be running Vocabeat frontend
      const tabs = await chrome.tabs.query({ url: ['http://localhost:3000/*', 'https://*.vercel.app/*'] })
      
      for (const tab of tabs) {
        if (tab.id) {
          try {
            console.log(`🔍 Checking tab: ${tab.url}`)
            
            // Inject script to get localStorage
            const results = await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: () => {
                // Get Supabase session from localStorage
                const keys = Object.keys(localStorage)
                for (const key of keys) {
                  if (key.includes('supabase') || key.includes('sb-')) {
                    try {
                      const value = localStorage.getItem(key)
                      if (value) {
                        const parsed = JSON.parse(value)
                        if (parsed?.user?.id) {
                          return parsed.user.id
                        }
                        if (parsed?.access_token) {
                          // Decode JWT
                          const parts = parsed.access_token.split('.')
                          if (parts.length === 3) {
                            const payload = parts[1]
                            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
                            const jwtPayload = JSON.parse(decoded)
                            if (jwtPayload?.sub) {
                              return jwtPayload.sub
                            }
                          }
                        }
                      }
                    } catch (error) {
                      console.log('Error parsing localStorage item:', error)
                    }
                  }
                }
                return null
              }
            })
            
            if (results && results[0]?.result) {
              console.log('✅ Found user ID from tab localStorage:', results[0].result)
              return results[0].result
            }
          } catch (error) {
            console.log(`❌ Failed to access tab ${tab.id}:`, error.message)
          }
        }
      }
      
      return null
    } catch (error) {
      console.log('❌ Error getting user ID from Vocabeat tabs:', error.message)
      return null
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