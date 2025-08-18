#!/usr/bin/env node

/**
 * Supabaseインポートテスト (ES Module)
 */

try {
  console.log('🧪 ES Module形式でのSupabaseインポートテスト...\n');
  
  const { createClient } = await import('@supabase/supabase-js');
  console.log('✅ @supabase/supabase-js - createClient関数のインポート成功');
  
  // 基本的な関数の存在確認
  if (typeof createClient === 'function') {
    console.log('✅ createClient関数が正しく利用可能');
  } else {
    console.log('❌ createClient関数が関数ではありません');
  }

  console.log('\n🎉 SETUP-004完了: Supabaseパッケージが正常にインストールされ、インポート可能です！');
  
} catch (error) {
  console.log('❌ インポートエラー:', error.message);
  console.log('\n🔧 Node.jsのバージョンを確認してください:');
  console.log('   node --version');
}