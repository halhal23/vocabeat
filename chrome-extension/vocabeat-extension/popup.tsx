import { useState, useEffect } from "react"

function IndexPopup() {
  const [userId, setUserId] = useState("")
  const [savedUserId, setSavedUserId] = useState("")

  useEffect(() => {
    // Load saved user ID
    chrome.storage.local.get('vocabeat_user_id').then(result => {
      if (result.vocabeat_user_id) {
        setSavedUserId(result.vocabeat_user_id)
      }
    })
  }, [])

  const handleSaveUserId = async () => {
    if (userId.trim()) {
      await chrome.storage.local.set({ vocabeat_user_id: userId.trim() })
      setSavedUserId(userId.trim())
      setUserId("")
    }
  }

  const handleClearUserId = async () => {
    await chrome.storage.local.remove('vocabeat_user_id')
    setSavedUserId("")
  }

  return (
    <div
      style={{
        padding: 16,
        minWidth: 320,
        minHeight: 400,
        background: 'linear-gradient(135deg, #6636eb 0%, #8b5cf6 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
      <h2 style={{ margin: 0, marginBottom: 16, textAlign: 'center' }}>
        🎯 Vocabeat Extension
      </h2>
      <p style={{ textAlign: 'center', margin: '0 0 20px' }}>
        Google翻訳の単語を自動抽出してVocabeatデータベースに登録
      </p>
      
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16
      }}>
        <div style={{ marginBottom: 8 }}>📊 Status: Active</div>
        <div style={{ marginBottom: 8 }}>👤 User ID: {savedUserId ? '✅ Set' : '❌ Not Set'}</div>
        <div>🔄 Supabase: {savedUserId ? 'Enabled' : 'Local Only'}</div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
      }}>
        <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>User ID Settings</div>
        {savedUserId ? (
          <div>
            <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.8 }}>
              Current ID: {savedUserId.substring(0, 8)}...
            </div>
            <button 
              onClick={handleClearUserId}
              style={{
                width: '100%',
                padding: 8,
                background: 'rgba(255,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 4,
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Clear User ID
            </button>
          </div>
        ) : (
          <div>
            <input 
              onChange={(e) => setUserId(e.target.value)} 
              value={userId} 
              placeholder="Paste your User ID here..."
              style={{
                width: '100%',
                padding: 8,
                border: 'none',
                borderRadius: 4,
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                marginBottom: 8
              }}
            />
            <button 
              onClick={handleSaveUserId}
              disabled={!userId.trim()}
              style={{
                width: '100%',
                padding: 8,
                background: userId.trim() ? 'rgba(0,255,0,0.3)' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 4,
                color: 'white',
                cursor: userId.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Save User ID
            </button>
          </div>
        )}
      </div>

      <button 
        style={{
          width: '100%',
          padding: 12,
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 8,
          color: 'white',
          cursor: 'pointer'
        }}
        onClick={() => window.open('https://translate.google.com/?sl=en&tl=ja', '_blank')}
      >
        🔗 Open Google Translate
      </button>
    </div>
  )
}

export default IndexPopup