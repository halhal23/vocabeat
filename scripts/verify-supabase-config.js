#!/usr/bin/env node

/**
 * Supabase設定確認スクリプト
 * SETUP-001の設定が正しく完了しているかを確認します
 */

const https = require('https');

// Supabase設定値（実際の値に置き換えてください）
const SUPABASE_PROJECT_REF = 'your-project-ref'; // 実際のproject-refに置き換え
const EXPECTED_SITE_URL = 'http://localhost:3000';
const EXPECTED_REDIRECT_URL = 'http://localhost:3000/auth/callback';

console.log('🔍 Supabase認証設定を確認中...\n');

function checkSupabaseConfig() {
  console.log('✅ 手動確認が必要な項目:');
  console.log(`   1. Site URL: ${EXPECTED_SITE_URL}`);
  console.log(`   2. Redirect URL: ${EXPECTED_REDIRECT_URL}`);
  console.log('\n📋 確認手順:');
  console.log('   1. https://supabase.com/dashboard にアクセス');
  console.log('   2. vocabaseプロジェクトを選択');
  console.log('   3. Authentication > Settings に移動');
  console.log('   4. Site URLとRedirect URLsが正しく設定されているか確認');
  
  console.log('\n🔧 設定が完了したら以下のファイルを確認してください:');
  console.log('   - Project Reference URL: https://supabase.com/dashboard/project/[PROJECT_REF]');
  console.log('   - API Settings: https://supabase.com/dashboard/project/[PROJECT_REF]/settings/api');
  
  console.log('\n✨ SETUP-001完了条件:');
  console.log('   ✓ Site URLが設定済み');
  console.log('   ✓ Redirect URLが設定済み');
  console.log('   ✓ プロジェクトのURLとAPIキーが取得可能');
}

checkSupabaseConfig();