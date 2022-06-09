// npm install express @line/bot-sdk dotenv
const line = require("@line/bot-sdk");
const express = require("express");
//　ローカル→開発環境(ステージング)→本番環境(プロダクション)
// .env ファイルの中身を読み込む　process.env.xxxx　で呼び出す。
require("dotenv").config();

const CONFIG = {
    // .env の ACCESS_TOKENに置き換わる
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_KEY
}
// ポート番号
// 例え：
// IPアドレス→目的地のインターネット上の住所
// ポート番号→目的地についてから、どの窓から入るか？
const PORT = 3223;

// オブジェクトの初期化（LINEモジュールを使える状態にする）
// 呼び出す時は client.xxxxx でメソッドを呼び出せる。
const client = new line.Client(CONFIG);

// ここは express 特有の書き方
// メソッド GET POST DELETE PATCH
// GET→取得
// POST→保存
// DELETE→削除
// PATCH→変更
express()
    // POST で受信する設定
    // "/webhook"　→ {IPアドレス}/webhook
    // line.middleware(CONFIG)→ LINEからの通信かどうかを判別する
    // LINEからの通信の場合、(req, res) => handleBot(req, res)　
    // コールバック関数：関数の引数に関数を渡す。
    // expressから受け取ったreq, resをそのままhandleBotに渡す。
    // req→リクエスト：LINEから受け取った通信（リクエストを受ける）
    // res→レスポンス：LINEに返すもの（レスポンスを返す）
    .post("/webhook", line.middleware(CONFIG), (req, res) => handleBot(req, res))
    // サーバーを立てる
    // ポート番号を指定（通信の窓口）
    // コールバック関数：() => {console.log(`Listening on ${PORT}}`)
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

//　functionの命名は自由
function handleBot(req, res) {
    // 200: ステータスコード
    // 200番台: 通信の成功を示す 400番台: 失敗してる
    // レスポンスを返す
    res.status(200).end();
    // httpはヘッダーとボディーを送信する
    // body
    // const req = {
    //     body: {
    //         events: [
    //             {
    //                 // event
    //             },
    //             ...
    //         ]
    //     }
    // }
    // mapはforのようなもの。event１つ１つを取り出してループする。
    req.body.events.map((event) => {
        console.log('event', event);
        // 返信をするメソッド
        // event.replyToken（リプライトークン）を第一引数に設定。
        // 第二引数にメッセージの内容
        // https://developers.line.biz/ja/reference/messaging-api/#sticker-message
        // replyMessage（リプライメッセージ）は通数を使わない無料のメッセージ。
        // 0通数
        client.replyMessage(event.replyToken, [
            { type: 'text', text: 'こんにちは！' },
            { type: 'text', text: 'こんにちは！' },
            { type: 'text', text: 'こんにちは！' },
            { type: 'text', text: 'こんにちは！' },
            { type: 'text', text: 'テスト中です！' },
        ])

        // 1通数
        // client.pushMessage(/* ユーザーID */, [
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        // ])

        // 2通数
        // client.pushMessage(/* ユーザーID */, [
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        // ])
        // client.pushMessage(/* ユーザーID */, [
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        // ])

        // ユーザーID: event.source.userId
        // client.pushMessage(event.source.userId, []);
        // client.pushMessage('U80696558e1aa831', []);
        // const userId = // データベースから取り出したID
        // client.pushMessage(userId, []);
        if (event.type == 'message') {
            if (event.message.text == 'こんにちは') {
                SendPostBackMessage(event.replyToken);
            }
        } else if (event.type == 'postback') {
            if (event.postback.data.includes('animal')) {
                const selected_animal =event.postback.data.replace('animal=','');
                console.log('selected animal:', selected_animal);

                // if (selected_animal == 'dog') {
                //     client.replyMessage(event.replyToken, {type: "text", text: '犬好きの方におすすめの商品'});
                //     client.linkRichMenuToUser(event.source.userID, '<犬を選んだ人用のリッチメニュー');
                // } else if (selected_animal == 'cat') {
                //     client.replyMessage(event.replyToken, {type: "text", text: '猫好きの方におすすめの商品'});
                //     client.linkRichMenuToUser(event.source.userID, '<猫を選んだ人用のリッチメニュー');
                // }
            }
        }
    })
}

function SendPostBackMessage(replyToken) {
    client.replyMessage(replyToken, {
        type: "template",
        altText: "ボタンメッセージ",
        template: {
            type: "buttons",
            text:"好きな動物を教えてください！",
            actions: [
                { type: "postback", label: "犬", data: "animal=dog" },
                { type: "postback", label: "猫", data: "animal=cat" },
            ]
        }
    })
}
// {
//     "destination": "xxxxxxxxxx",
//     "events": [
//         {
//             "type": "message",
//             "message": {
//                 "type": "text",
//                 "id": "14353798921116",
//                 "text": "Hello, world"
//             },
//             "timestamp": 1625665242211,
//             "source": {
//                 "type": "user",
//                 "userId": "U80696558e1aa831..."
//             },
//             "replyToken": "757913772c4646b784d4b7ce46d12671",
//             "mode": "active",
//             "webhookEventId": "01FZ74A0TDDPYRVKNK77XKC3ZR",
//             "deliveryContext": {
//                 "isRedelivery": false
//             }
//         },
//         {
//             "type": "follow",
//             "timestamp": 1625665242214,
//             "source": {
//                 "type": "user",
//                 "userId": "Ufc729a925b3abef..."
//             },
//             "replyToken": "bb173f4d9cf64aed9d408ab4e36339ad",
//             "mode": "active",
//             "webhookEventId": "01FZ74ASS536FW97EX38NKCZQK",
//             "deliveryContext": {
//                 "isRedelivery": false
//             }
//         },
//         {
//             "type": "unfollow",
//             "timestamp": 1625665242215,
//             "source": {
//                 "type": "user",
//                 "userId": "Ubbd4f124aee5113..."
//             },
//             "mode": "active",
//             "webhookEventId": "01FZ74B5Y0F4TNKA5SCAVKPEDM",
//             "deliveryContext": {
//                 "isRedelivery": false
//             }
//         }
//     ]
// }


// 関数の書き方
// function test(引数) {

// }

// const test = (引数) => {

// }
// (引数) => {}