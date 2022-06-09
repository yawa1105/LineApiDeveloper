const line = require("@line/bot-sdk");
const express = require("express");
require("dotenv").config();

const CONFIG = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_KEY
}

const PORT = 3223;
const client = new line.Client(CONFIG);

express()
    .post("/webhook", line.middleware(CONFIG), (req, res) => handleBot(req, res))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

function handleBot(req, res) {
    res.status(200).end();
    req.body.events.map((event) => {
        console.log('event', event);
        //「予約」ならSendPostBackMessage送る
        if (event.type == 'message') {
            if (event.message.text == '予約') {
                SendPostBackMessage(event.replyToken);
            }
        //dateを含むならSendPostBackMessage2送る   
        } else if (event.type == 'postback') {
            if (event.postback.data.includes('date')) {
                const selected_date = event.postback.data.replace('date=','');
                console.log('selected date:', selected_date);
                SendPostBackMessage2(event.replyToken);
            //timeを含むならSendPostBackMessage3送る
            } else if (event.postback.data.includes('time')) {
                const selected_time = event.postback.data.replace('time=','');
                console.log('selected time:', selected_time);
                SendPostBackMessage3(event.replyToken);
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
            text:"日付を選択してください",
            actions: [
                { type: "postback", label: (GetDateAfter(1)), data: "date=" + (GetDateAfter(1, 'data')) },
                { type: "postback", label:(GetDateAfter(2)), data: "date=" + (GetDateAfter(2, 'data')) },
                { type: "postback", label: (GetDateAfter(3)), data: "date=" +(GetDateAfter(3, 'data')) },
            ]
        }
    })
}

function SendPostBackMessage2(replyToken) {
    client.replyMessage(replyToken, {
        type: "template",
        altText: "ボタンメッセージ",
        template: {
            type: "buttons",
            text:"時間を選択してください",
            actions: [
                { type: "postback", label: "10時" , data: "time=" + 1000 },
                { type: "postback", label: "11時", data: "time=" + 1100 },
                { type: "postback", label: "12時", data: "time=" + 1200 },
            ]
        }
    })
}

function SendPostBackMessage3(replyToken) {
    client.replyMessage(replyToken, [
        { type: 'text', text: 'ご予約ありがとうございます！' },
    ])
}

function GetDateAfter(diff, type='label') {
    let date = new Date();
    let label = `${date.getFullYear()}年${('0' + (date.getMonth() + 1)).slice(-2)}月${('0' + (date.getDate() + diff)).slice(-2)}日`;

    console.log(label);

    if (type == 'label') return label;
    else if (type == 'data') return label.replace(/[年月日]/g, '');
    else return '';
}




console.log('テスト');
