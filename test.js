// localhost:3223 = 192.168.0.13:3223
// インターネット上のアドレスがグローバルIPアドレス
// Wifiルーター内でのネットワークアドレスがローカルIPアドレス
// グローバルIPは誰でもアクセスできる
// ローカルIPは同じwifiに接続している機器だけが接続できる
// node index.js → 192.168.0.xx:3223
// ngrokでグローバルIPを割り当てる
// https://01f3-61-24-228-148.ap.ngrok.io -> http://localhost:3223
// ngrokへのリクエストをそのままローカルIPに転送してくれる

// 次の課題
// テンプレートメッセージとポストバックを使って予約の流れを作る
// ユーザーが「予約」と送信したら、いくつかの日付の選択肢をテンプレートメッセージで出す。
// テンプレートメッセージのボタンには日付が書かれていて、ポストバックの値を type=date&date={選択した日付}（例：type=date&date=20220101） と設定する。
// テンプレートメッセージの例
// 日付を選択してください
// ボタン1: 明日の日付（例：2022年6月3日）, ポストバックのデータ：type=date&date=20220603
// ボタン2: 明後日の日付（例：2022年6月4日）, ポストバックのデータ：type=date&date=20220604
// ボタン3: 明明後日の日付（例：2022年6月5日）, ポストバックのデータ：type=date&date=20220605
// 日付は変数で、毎日変わる
// const date = new Date(); // 今日の日付
// 「javascript 明日の日付」と検索

//ポストバック
// アンケート 犬か猫か
if (event.message.text == '犬') {
    // 犬を保存
} else if (event.message.text == '猫') {
    // 猫を保存
}

// question=animal&answer=dog
// { 
//     question: 'animal',
//     answer: 'dog'
// }
if (data.question == 'animal' && data.answer == 'dog') {
    // 犬を保存
}

// ユーザーが日付を選択したら、ポストバックを受信して、
// ポストバックの文字列をオブジェクトに変換する 「javascript クエリ文字列 オブジェクト　変換」と検索
const dateData = {
    type: 'date',
    date: '日付'
}
// オブジェクトのtypeをif文で分岐。
if (dateData.type == 'date') {
    console.log('date: ', dateData.date);
    // 次のメッセージを送信
    // 予約時間を選択するテンプレートメッセージ

    // 時間を選択してください
    // ボタン1: 10:00, ポストバックのデータ：type=time&time=1000
    // ボタン2: 11:00, ポストバックのデータ：type=time&time=1100
    // ボタン3: 12:00, ポストバックのデータ：type=time&time=1200
}

// ユーザーが日時を選択したら、ポストバックを受信して、
// ポストバックの文字列をオブジェクトに変換する
const timeData = {
    type: 'time',
    time: '時間'
}

if (timeData.type == 'time') {
    console.log('time: ', timeData.time);
    // 予約が完了しました。とテキストメッセージを返す。
}