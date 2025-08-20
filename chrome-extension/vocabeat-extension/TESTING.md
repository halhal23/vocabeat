# 🧪 Vocabeat Chrome Extension Testing Guide

## 📋 テスト手順

### 1. Chrome拡張機能の読み込み

1. **Chromeブラウザを開く**
2. **アドレスバーに入力**: `chrome://extensions/`
3. **「デベロッパーモード」を有効にする** (右上のトグル)
4. **「パッケージ化されていない拡張機能を読み込む」をクリック**
5. **フォルダを選択**: `/Users/harayouharuka/workspace/vocabeat/chrome-extension/vocabeat-extension/build/chrome-mv3-dev/`

### 2. 拡張機能の基本動作確認

#### ✅ 拡張機能アイコンの確認
- Chromeツールバーに紫色のVocabeatアイコンが表示される
- アイコンをクリックしてポップアップが開く
- 3つのタブ（Dashboard, Words, Settings）が表示される

#### ✅ ポップアップ機能テスト
- **Dashboard**: 今日の単語数、合計単語数の表示
- **Words**: 最近取得した単語一覧
- **Settings**: 自動取得ON/OFF、接続状態の確認

### 3. Google翻訳での単語抽出テスト

#### 📖 準備
1. **Google翻訳を開く**: https://translate.google.com/?sl=en&tl=ja
2. **ブラウザの開発者ツールを開く** (F12)
3. **Consoleタブを選択**

#### 🧪 単語翻訳テスト
1. **英単語を入力**: `hello`
2. **日本語翻訳を確認**: `こんにちは`
3. **Consoleログを確認**:
   ```
   🚀 Vocabeat: Initializing Google Translate monitor
   ✅ Vocabeat: Extension is enabled, starting monitoring
   Vocabeat: Found source text with selector: textarea[...]
   Vocabeat: Found target text with selector: [...]
   ```

#### 📝 テスト用単語リスト
- **簡単**: `cat`, `dog`, `run`, `big`
- **中程度**: `computer`, `translate`, `language`
- **難しい**: `sophisticated`, `implementation`

### 4. データベース連携テスト

#### 🔗 Supabase接続確認
1. **拡張機能ポップアップを開く**
2. **Settings タブをクリック**
3. **Database欄で「Connected」表示を確認**

#### 💾 データ保存テスト
1. **Google翻訳で単語を翻訳**
2. **通知が表示される**: "Added 'word' to Vocabeat"
3. **ポップアップのWordsタブで単語確認**
4. **Vocabeatアプリ（localhost:3000）で確認**

### 5. テストページでのデバッグ

#### 🖥️ テストページアクセス
1. **ファイルを開く**: `/Users/harayouharuka/workspace/vocabeat/chrome-extension/vocabeat-extension/test.html`
2. **各種テスト機能を実行**:
   - Extension Status Check
   - Word Extraction Test
   - Storage Test
   - Supabase Test

### 6. トラブルシューティング

#### ❌ 拡張機能が動作しない場合

**症状**: アイコンが表示されない
**解決策**:
```bash
# 1. 開発サーバーが動作しているか確認
cd /Users/harayouharuka/workspace/vocabeat/chrome-extension/vocabeat-extension
npm run dev

# 2. ビルドフォルダの存在確認
ls -la build/chrome-mv3-dev/

# 3. 拡張機能の再読み込み
# chrome://extensions/ で「更新」ボタンをクリック
```

**症状**: Google翻訳で単語が抽出されない
**解決策**:
1. **開発者ツールでConsoleエラー確認**
2. **Content Scriptの読み込み確認**:
   ```javascript
   // Google翻訳ページのConsoleで実行
   console.log('Vocabeat extension loaded:', !!window.vocabeatExtension);
   ```

**症状**: Supabaseに保存されない
**解決策**:
1. **認証状態確認**: Vocabeatアプリでログイン済みか
2. **ネットワーク接続確認**: インターネット接続
3. **API key確認**: background/index.tsの設定値

#### 🔧 デバッグコマンド

```bash
# ログレベルを詳細に変更
# 開発者ツールのConsoleで実行
chrome.storage.sync.set({
  settings: { 
    logLevel: 'debug',
    isEnabled: true,
    autoCapture: true 
  }
});

# ストレージデータ確認
chrome.storage.local.get(null, console.log);
chrome.storage.sync.get(null, console.log);

# 手動で単語抽出テスト
chrome.runtime.sendMessage({
  type: 'WORD_EXTRACTED',
  payload: {
    english_word: 'test',
    japanese_meaning: 'テスト',
    translation_source: 'google_translate',
    confidence_level: 0.9,
    review_count: 0,
    difficulty: 'easy'
  }
});
```

### 7. 期待される動作

#### ✅ 正常動作の確認項目

1. **拡張機能アイコン**: 紫色のアイコンが表示
2. **バッジ表示**: 今日取得した単語数がアイコンに表示
3. **ポップアップ**: 3タブ構成で情報表示
4. **単語抽出**: Google翻訳で自動的に単語を抽出
5. **通知表示**: 単語抽出時に右上に通知
6. **データ保存**: ローカルストレージとSupabaseに保存
7. **フロントエンド連携**: Vocabeatアプリで単語確認可能

#### 📊 パフォーマンス指標

- **単語抽出速度**: 翻訳後500ms以内
- **通知表示**: 3秒間表示後自動消去
- **ポップアップ表示**: 200ms以内
- **データ同期**: 2秒以内でSupabaseに保存

### 8. 手動テストケース

#### テストケース1: 基本的な単語抽出
1. Google翻訳で「hello」→「こんにちは」
2. 通知が表示される
3. ポップアップのWordsタブに表示される
4. Vocabeatアプリのダッシュボードに反映される

#### テストケース2: 除外単語の確認
1. Google翻訳で「the」→「その」
2. 通知が表示されない（除外単語のため）
3. ポップアップのWordsタブに追加されない

#### テストケース3: 複数語の除外
1. Google翻訳で「hello world」→「こんにちは世界」
2. 通知が表示されない（複数語のため）
3. 単語として登録されない

#### テストケース4: 設定変更
1. ポップアップのSettingsで「Auto Capture」をOFF
2. Google翻訳で単語翻訳
3. 単語が抽出されない
4. 「Auto Capture」をONに戻すと抽出再開

---

## 🚀 本番環境デプロイ準備

### Chrome Web Store申請前チェックリスト

- [ ] 全機能の動作確認完了
- [ ] プライバシーポリシーの作成
- [ ] アイコン・スクリーンショットの準備
- [ ] マニフェストの最終確認
- [ ] セキュリティレビュー完了
- [ ] ユーザードキュメント作成

### 必要なファイル準備

```bash
# 本番ビルド作成
npm run build

# パッケージ作成
npm run package

# アイコンファイル確認
ls -la assets/icon*.png

# マニフェスト確認
cat build/chrome-mv3-prod/manifest.json
```

---

**最終更新**: 2025年8月20日  
**テスト環境**: Chrome拡張機能開発版  
**対象**: Vocabeat Chrome Extension v0.1.0