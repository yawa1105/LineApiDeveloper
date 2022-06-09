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


var date = new Date();
// formattedDate = [
//         date.getFullYear(),
//         ('0' + (date.getMonth() + 1)).slice(-2),
//         ('0' + date.getDate()).slice(-2)
//     ].join('/');
// console.log(formattedDate);
var year = (date.getFullYear());
console.log(year);

// ↓ここやってる途中！
const tomorrow = (year) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + (date.getDate()+1)).slice(-2);
console.log(tomorrow);

const dayAfterTomorrow = (year) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + (date.getDate()+2)).slice(-2);
console.log(dayAfterTomorrow); 

const twoDaysAfterTomorrow = (year) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + (date.getDate()+3)).slice(-2);
console.log(twoDaysAfterTomorrow);

var formattedDate = new Date().toISOString().split("T")[0].replaceAll("-", "");
console.log(formattedDate);
//
 https://watermargin.net/programming/javascript/javascript-date%EF%BC%88%E6%97%A5%E4%BB%98%EF%BC%89-%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92-yyyy-mm-dd-%E5%BD%A2%E5%BC%8F%E3%81%AB%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88%E3%81%99%E3%82%8B/
//
function handleBot(req, res) {
    res.status(200).end();
    req.body.events.map((event) => {
        console.log('event', event);
        // client.replyMessage(event.replyToken, [
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'テスト中です！' },
        // ])

        if (event.type == 'message') {
            if (event.message.text == '予約') {
                SendPostBackMessage(event.replyToken);
            }
        } else if (event.type == 'postback') {
            if (event.postback.data.includes('date')) {
                const selected_date =event.postback.data.replace('date=','');
                console.log('selected date:', selected_date);
                SendPostBackMessage2(event.replyToken);
   
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