#!/usr/bin/env node

/**
 * 環境変数設定確認スクリプト
 * SETUP-003の設定が正しく完了しているかを確認します
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../frontend/.env.local');

console.log('🔍 環境変数設定を確認中...\n');

function verifyEnvConfig() {
  // .env.localファイルの存在確認
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local ファイルが見つかりません');
    console.log(`   期待場所: ${envPath}`);
    return false;
  }

  console.log('✅ .env.local ファイルが見つかりました');

  // ファイル内容の読み込み
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  let allValid = true;

  requiredVars.forEach(varName => {
    const line = lines.find(l => l.startsWith(`${varName}=`));
    if (!line) {
      console.log(`❌ ${varName} が設定されていません`);
      allValid = false;
    } else {
      const value = line.split('=')[1];
      if (!value || value.includes('your_') || value.includes('here')) {
        console.log(`❌ ${varName} の値がプレースホルダーのままです`);
        allValid = false;
      } else {
        console.log(`✅ ${varName} が設定されています`);
        
        // URLの簡単な検証
        if (varName === 'NEXT_PUBLIC_SUPABASE_URL') {
          if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
            console.log(`⚠️  ${varName} の形式が正しくない可能性があります`);
          }
        }
        
        // APIキーの簡単な検証
        if (varName === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
          if (!value.startsWith('eyJ')) {
            console.log(`⚠️  ${varName} がJWTトークンの形式ではありません`);
          }
        }
      }
    }
  });

  console.log('\n📋 設定内容:');
  lines.forEach(line => {
    if (line.includes('SUPABASE_URL')) {
      console.log(`   ${line.split('=')[0]}=${line.split('=')[1].substring(0, 30)}...`);
    } else if (line.includes('SUPABASE_ANON_KEY')) {
      console.log(`   ${line.split('=')[0]}=${line.split('=')[1].substring(0, 30)}...`);
    }
  });

  if (allValid) {
    console.log('\n🎉 SETUP-003完了: 環境変数設定が正常に完了しました！');
  } else {
    console.log('\n❌ SETUP-003未完了: 環境変数の設定に問題があります');
  }

  return allValid;
}

verifyEnvConfig();