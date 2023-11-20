const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require('body-parser');

var promRouter = require("./routes/prompts");

mongoose
  .connect(process.env.DBURI)
  .then(() => {
    console.log("DB에 연결되었습니다.");
  })
  .catch((err) => {
    console.log("DB 연결중 문제가 발생했습니다.");
    console.log(err);
  });


app.use(bodyParser.urlencoded({ extended: true }))
// 프롬프트 사용
app.use('/prompts',promRouter)

//웹 화면 실행
app.get('/',(req,res) => {
    res.send("hello")
  })

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

module.exports = app;


// sdk 초기화
admin.initializeApp({
  credential: admin.credential.cert('./fcm.json'),
  databaseURL: "https://myfbdb-aa8b7-default-rtdb.firebaseio.com"
});

// fcm 푸시 알림 보내는 함수
async function sendFCMPushNotification(androidFCMToken) {
  try {
    const message = {
      data: {
        title: '작업 완료',
        body: '서버 작업이 완료되었습니다!'
      },
      token: androidFCMToken,
    };

    const response = await admin.messaging().send(message);
    console.log('Push notification sent to', androidFCMToken, response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

app.use(bodyParser.json());

const tokens = [];

app.post('/save-token', (req, res) => {
  const { token } = req.body;

  // 토큰을 배열에 저장
  toekn.push(token);

  console.log('Received token:', token);

  res.status(200).json({ message: 'Token received and saved successfully' });
});


app.post('/send-push-on-story-completion', (req, res)=>{
  const { token } = req.body;

  // 해당 토큰에 푸시알림 보내기
  sendFCMPushNotification(token);

  res.status(200).json({ message: 'Push notification sent on story completion' });
})


// 예제: FCM 토큰과 메시지를 이용하여 푸시 알림 보내기
const androidFCMToken = 'YOUR_ANDROID_FCM_TOKEN';
const message = 'Hello, this is a push notification from your Node.js server!';

sendFCMPushNotification(androidFCMToken, message);



/*
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose").MongoClient;
require("dotenv").config();
var bodyParser = require('body-parser');
var promRouter = require("./routes/prompts");
const admin = require('firebase-admin');

//  const serviceAccount
//  firebase service account key


// 푸시 알림 메시지
const message = {
  notification: {
    title: '알림 제목',
    body: '알림 내용',
  },
 

  // 보낼 대상
  token: '안드로이드 디바이스의 FCM 토큰',
};

// 푸시 알림 보내기
admin.messaging().send(message)
  .then((response) => {
    console.log('푸시 알림이 성공적으로 보내졌습니다:', response);
  })
  .catch((error) => {
    console.error('푸시 알림 보내기 오류:', error);
});

mongoose
  .connect(process.env.DBURI, (err, client) => {
    if(err){
      console.error("MongoDB 연결 실패: " + err);
      return;
    }
    const db = client.db('MongoDB 연결 성공');
  });


app.use(bodyParser.urlencoded({ extended: true }))
// 프롬프트 사용
app.use('/prompts',promRouter)

//웹 화면 실행
app.get('/',(req,res) => {
    res.send("hello")
  })

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

module.exports = app;


app.post('/process-command', (req, res) => {
  // 서버가 이야기를 다 만들었을 때 푸시알림
});


*/