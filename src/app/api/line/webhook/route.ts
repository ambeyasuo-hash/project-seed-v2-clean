// src/app/api/line/webhook/route.ts (最終修正版)

import { NextResponse } from 'next/server';
import { TECHNICAL_CONSTANTS } from '@/lib/constants';
// import { createMainClient } from '@/lib/supabase/server'; // ログ記録がないため不要

// LINE Messaging APIからのWebhookリクエストを処理する
export async function POST(request: Request) {
  // LINEのWebhookペイロードは { events: [...] } の形式
  const body = await request.json();
  const events = body.events; // ★ここで events を取得

  // const supabase = createMainClient(); // ログ記録がないため不要

  try {
    // ----------------------------------------------------------------
    // 1. セキュリティチェック (署名検証は省略し、まずは骨格を構築)
    // ----------------------------------------------------------------
    // 運用フェーズでは、ここでLINE_CHANNEL_SECRETを使った署名検証が必須

    // ----------------------------------------------------------------
    // 2. イベントの処理
    // ----------------------------------------------------------------
    for (const event of events) { // ★ここで event を使用
      
      // LIFF起動時の処理 (メッセージイベント)
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text;
        
        // LIFF起動トリガーワードをチェック (例: "シフト希望")
        if (text.includes('シフト希望')) {
          const liffUrl = `https://liff.line.me/${TECHNICAL_CONSTANTS.LIFF_ID}`;
          
          // LINE Messaging APIを通じてLIFF URLを応答する処理をここに記述
          console.log(`LIFF URLを送信: ${liffUrl} (ユーザーID: ${event.source.userId})`);
        }
      }
      
      // 他のイベントタイプ（Follow, Postbackなど）の処理をここに追加
    }

    // 成功応答
    return NextResponse.json({ message: 'Event processed successfully' }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // エラーログの記録は、ai_logsテーブルが準備でき次第、再実装します。
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}