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
        // console.log('event', event);
        // client.replyMessage(event.replyToken, [
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'こんにちは！' },
        //     { type: 'text', text: 'テスト中です！' },
        // ])

        if (event.type == 'message') {
            if (event.message.text == 'こんにちは') {
                SendPostBackMessage(event.replyToken);
            }
        } else if (event.type == 'postback') {
            if (event.postback.data.includes('animal')) {
                const selected_animal =event.postback.data.replace('animal=','');
                console.log('selected animal:', selected_animal);
   
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
