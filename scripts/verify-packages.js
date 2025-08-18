#!/usr/bin/env node

/**
 * パッケージインストール確認スクリプト
 * SETUP-004の設定が正しく完了しているかを確認します
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../frontend/package.json');

console.log('🔍 Supabaseパッケージインストールを確認中...\n');

function verifyPackages() {
  // package.jsonファイルの存在確認
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json ファイルが見つかりません');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};

  const requiredPackages = [
    '@supabase/supabase-js',
    '@supabase/auth-ui-react', 
    '@supabase/auth-ui-shared'
  ];

  let allInstalled = true;

  console.log('📦 必要パッケージの確認:');
  
  requiredPackages.forEach(packageName => {
    if (dependencies[packageName]) {
      console.log(`✅ ${packageName} - v${dependencies[packageName]}`);
    } else {
      console.log(`❌ ${packageName} - インストールされていません`);
      allInstalled = false;
    }
  });

  // node_modulesの実際の存在確認
  console.log('\n📂 実際のインストール確認:');
  
  requiredPackages.forEach(packageName => {
    const modulePath = path.join(__dirname, '../frontend/node_modules', packageName);
    if (fs.existsSync(modulePath)) {
      console.log(`✅ ${packageName} - ファイル確認済み`);
    } else {
      console.log(`❌ ${packageName} - ファイルが見つかりません`);
      allInstalled = false;
    }
  });

  // 基本的なインポートテスト
  console.log('\n🧪 インポートテスト:');
  
  try {
    const supabaseJs = require('@supabase/supabase-js');
    console.log('✅ @supabase/supabase-js - インポート可能');
  } catch (error) {
    console.log('❌ @supabase/supabase-js - インポートエラー');
    allInstalled = false;
  }

  if (allInstalled) {
    console.log('\n🎉 SETUP-004完了: 必要なパッケージが正常にインストールされました！');
    console.log('\n📋 インストール済みパッケージ:');
    requiredPackages.forEach(pkg => {
      console.log(`   - ${pkg}: ${dependencies[pkg]}`);
    });
  } else {
    console.log('\n❌ SETUP-004未完了: パッケージのインストールに問題があります');
    console.log('\n🔧 解決方法:');
    console.log('   cd frontend && npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared');
  }

  return allInstalled;
}

verifyPackages();