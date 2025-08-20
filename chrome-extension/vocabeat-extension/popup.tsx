import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

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
        <div style={{ marginBottom: 8 }}>📚 Today's Words: 0</div>
        <div>🔄 Total Words: 0</div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
      }}>
        <input 
          onChange={(e) => setData(e.target.value)} 
          value={data} 
          placeholder="Test input..."
          style={{
            width: '100%',
            padding: 8,
            border: 'none',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.2)',
            color: 'white'
          }}
        />
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