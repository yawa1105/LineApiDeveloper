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

//日付の取得
var date = new Date();
//date.getFullYear()だけ↓のtomorrowに入れると表示が変になるのでyearにした。なんで？？
var year = (date.getFullYear());
console.log(year);

//明日の日付
const tomorrow = (year) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + (date.getDate()+1)).slice(-2);
console.log(tomorrow);
//明後日
const dayAfterTomorrow = (year) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + (date.getDate()+2)).slice(-2);
console.log(dayAfterTomorrow); 
//明明後日
const twoDaysAfterTomorrow = (year) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + (date.getDate()+3)).slice(-2);
console.log(twoDaysAfterTomorrow);

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
                const selected_date =event.postback.data.replace('date=','');
                console.log('selected date:', selected_date);
                SendPostBackMessage2(event.replyToken);
            //timeを含むならSendPostBackMessage3送る
            } else if (event.postback.data.includes('time')) {
                const selected_time =event.postback.data.replace('time=','');
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
                { type: "postback", label: (tomorrow), data: "date=" + (tomorrow) },
                { type: "postback", label:(dayAfterTomorrow), data: "date=" +(dayAfterTomorrow) },
                { type: "postback", label: (twoDaysAfterTomorrow), data: "date=" +(twoDaysAfterTomorrow) },
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