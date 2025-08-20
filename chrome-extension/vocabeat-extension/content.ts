import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://translate.google.com/*"],
  all_frames: false,
  run_at: "document_end"
}

console.log("🚀 Vocabeat: Content script loaded on Google Translate")

class GoogleTranslateMonitor {
  private observer: MutationObserver | null = null
  private lastProcessedTranslation = ''
  private lastProcessedTime = 0
  private processingTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.init()
  }

  private async init() {
    console.log('🚀 Vocabeat: Initializing Google Translate monitor')
    
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      console.log('⏳ Vocabeat: Waiting for DOM to load')
      document.addEventListener('DOMContentLoaded', () => this.startMonitoring())
    } else {
      console.log('✅ Vocabeat: DOM already loaded, starting monitoring')
      this.startMonitoring()
    }
  }

  private startMonitoring() {
    console.log('🔍 Vocabeat: Starting Google Translate monitoring')

    // Set up mutation observer to watch for translation changes
    this.observer = new MutationObserver((mutations) => {
      this.handleMutations(mutations)
    })

    // Start observing the document for changes
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })

    // Also listen for specific events
    this.setupEventListeners()

    // Do an initial check
    setTimeout(() => {
      this.checkForNewTranslation()
    }, 2000)
  }

  private setupEventListeners() {
    // Listen for input changes
    document.addEventListener('input', () => {
      console.log('📝 Input detected, scheduling translation check')
      this.scheduleTranslationCheck()
    })

    // Listen for clicks
    document.addEventListener('click', () => {
      console.log('🖱️ Click detected, scheduling translation check')
      this.scheduleTranslationCheck()
    })
  }

  private scheduleTranslationCheck() {
    // Debounce the check to avoid too frequent processing
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout)
    }

    this.processingTimeout = setTimeout(() => {
      this.checkForNewTranslation()
    }, 1000) // Wait 1 second after last change
  }

  private handleMutations(mutations: MutationRecord[]) {
    let hasRelevantChanges = false

    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        const target = mutation.target as Element
        
        // Check if the change might be related to translation
        if (target.textContent && target.textContent.trim()) {
          hasRelevantChanges = true
          break
        }
      }
    }

    if (hasRelevantChanges) {
      console.log('🔄 DOM mutation detected, scheduling translation check')
      this.scheduleTranslationCheck()
    }
  }

  private async checkForNewTranslation() {
    try {
      console.log('🔍 Checking for new translation...')
      
      // Extract current translation
      const sourceText = this.extractSourceText()
      const targetText = this.extractTargetText()
      
      console.log('📝 Source text:', sourceText)
      console.log('📤 Target text:', targetText)

      if (!sourceText || !targetText) {
        console.log('❌ Missing source or target text')
        return
      }

      // Check if this is a valid single word
      if (!this.isValidSingleWord(sourceText)) {
        console.log('❌ Not a valid single word:', sourceText)
        return
      }

      // Avoid processing the same translation multiple times (with 5 second cooldown)
      const translationKey = `${sourceText}->${targetText}`
      const now = Date.now()
      
      if (translationKey === this.lastProcessedTranslation) {
        // Allow reprocessing after 5 seconds for testing
        if (!this.lastProcessedTime || (now - this.lastProcessedTime) < 5000) {
          console.log('⏭️ Already processed this translation recently (within 5 seconds)')
          return
        }
      }
      
      this.lastProcessedTranslation = translationKey
      this.lastProcessedTime = now

      console.log('✅ Processing translation:', translationKey)

      // Create word object
      const word = {
        english_word: sourceText.toLowerCase(),
        japanese_meaning: targetText,
        translation_source: 'google_translate',
        confidence_level: 0.8,
        review_count: 0,
        difficulty: this.determineDifficulty(sourceText),
        context: window.location.href
      }

      console.log('📚 Word object:', word)

      // Send to background script
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        try {
          chrome.runtime.sendMessage({
            type: 'WORD_EXTRACTED',
            payload: word
          }, (response) => {
            if (chrome.runtime.lastError) {
              // Check if it's a context invalidation error
              if (chrome.runtime.lastError.message?.includes('Extension context invalidated') ||
                  chrome.runtime.lastError.message?.includes('message port closed')) {
                console.warn('⚠️ Extension context invalidated. Please refresh the page.')
                this.showContextInvalidatedNotification()
              } else {
                console.error('❌ Failed to send message:', chrome.runtime.lastError)
              }
            } else {
              console.log('✅ Message sent successfully:', response)
              this.showNotification(word)
            }
          })
        } catch (error) {
          console.error('❌ Error sending message to background:', error)
          // Save locally as fallback
          this.saveLocally(word)
        }
      } else {
        console.error('❌ Chrome extension API not available')
        // Save locally as fallback
        this.saveLocally(word)
      }

    } catch (error) {
      console.error('❌ Error checking translation:', error)
    }
  }

  private extractSourceText(): string | null {
    console.log('🔍 Extracting source text...')
    
    // Try multiple selectors for source text input
    const selectors = [
      'textarea[data-placeholder="Enter text"]',
      'textarea[aria-label*="Source text"]',
      'textarea[placeholder*="text"]',
      'div[contenteditable="true"]',
      'textarea[spellcheck]',
      'textarea',
      '.er8xn'
    ]

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLTextAreaElement | HTMLDivElement
      if (element) {
        const text = ('value' in element ? element.value : element.textContent)?.trim()
        if (text && text.length > 0) {
          console.log(`✅ Found source text with selector "${selector}":`, text)
          return text
        }
      }
    }

    console.log('❌ No source text found')
    return null
  }

  private extractTargetText(): string | null {
    console.log('🔍 Extracting target text...')
    
    // Try multiple selectors for translation result
    const selectors = [
      '[data-language-for-alternatives] span[lang="ja"]',
      'span[lang="ja"]',
      '[data-language-for-alternatives] span',
      '[role="region"][aria-live="polite"] span',
      'div[lang="ja"]',
      '.HwtZe',
      '.ryNqvb', 
      '.Q4iAWc'
    ]

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector)
      
      for (const element of Array.from(elements)) {
        if (element && element.textContent?.trim()) {
          const text = element.textContent.trim()
          
          // Filter out unwanted text
          if (text.length > 0 && 
              text.length < 50 && // Reasonable length for single word translation
              !text.includes('翻訳') &&
              !text.includes('候補') &&
              !text.includes('読み込め') &&
              !text.includes('再試行') &&
              !text.includes('...') &&
              !text.includes('Error') &&
              !text.includes('Loading')) {
            
            console.log(`✅ Found target text with selector "${selector}":`, text)
            
            // If text is duplicated (like "サーバントサーバント"), take only the first part
            const words = text.split(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/) // Split on non-Japanese characters
            const cleanText = words.find((word: string) => word.length > 0) || text
            
            if (cleanText !== text) {
              console.log(`🧹 Cleaned text: "${text}" -> "${cleanText}"`)
            }
            
            return cleanText
          }
        }
      }
    }

    console.log('❌ No target text found')
    return null
  }

  private isValidSingleWord(text: string): boolean {
    const trimmed = text.trim()
    const isValid = /^[a-zA-Z]+$/.test(trimmed) && 
           trimmed.length >= 2 && 
           trimmed.length <= 30 &&
           !trimmed.includes(' ')
    
    console.log(`🔍 Word validation for "${trimmed}": ${isValid}`)
    return isValid
  }

  private determineDifficulty(word: string): 'easy' | 'medium' | 'hard' {
    const length = word.length
    if (length <= 4) return 'easy'
    if (length <= 8) return 'medium'
    return 'hard'
  }

  private showNotification(word: any) {
    console.log('🔔 Showing notification for word:', word.english_word)
    this.createNotification(`✅ Added "${word.english_word}" to Vocabeat`, '#6636eb')
  }

  private showContextInvalidatedNotification() {
    console.log('⚠️ Showing context invalidated notification')
    this.createNotification('⚠️ Extension updated. Please refresh the page.', '#f59e0b')
  }

  private createNotification(message: string, color: string) {
    // Create a notification element
    const notification = document.createElement('div')
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>${message}</span>
        </div>
      </div>
    `

    document.body.appendChild(notification)

    // Remove notification after 3 seconds (or 5 seconds for warnings)
    const timeout = color === '#f59e0b' ? 5000 : 3000
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, timeout)
  }

  private saveLocally(word: any) {
    console.log('💾 Saving word locally as fallback:', word.english_word)
    
    try {
      // Use localStorage as fallback when Chrome Extension API is not available
      const existingWords = JSON.parse(localStorage.getItem('vocabeat_words_fallback') || '[]')
      existingWords.push({
        ...word,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        saved_locally: true
      })
      
      // Keep only last 20 words
      const wordsToSave = existingWords.slice(-20)
      localStorage.setItem('vocabeat_words_fallback', JSON.stringify(wordsToSave))
      
      this.createNotification(`💾 Saved "${word.english_word}" locally (extension updating)`, '#6366f1')
      
    } catch (error) {
      console.error('❌ Failed to save locally:', error)
    }
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout)
    }
  }

  public forceProcessTranslation() {
    this.checkForNewTranslation()
  }

  public clearCache() {
    this.lastProcessedTranslation = ''
    this.lastProcessedTime = 0
    console.log('🧹 Cache cleared')
  }
}

// Initialize the monitor when script loads
console.log('🎯 Vocabeat: Creating Google Translate monitor')
const monitor = new GoogleTranslateMonitor()

// Add global debug function for testing
;(window as any).vocabeatDebug = {
  forceProcessTranslation: () => {
    console.log('🧪 Forcing translation processing...')
    monitor.forceProcessTranslation()
  },
  clearCache: () => {
    console.log('🧹 Clearing translation cache...')
    monitor.clearCache()
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  console.log('👋 Vocabeat: Cleaning up monitor')
  monitor.destroy()
})