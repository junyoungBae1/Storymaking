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

// sdk 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 푸시 알림 메시지
const message = {
  notification: {
    title: '알림 제목',
    body: '알림 내용',
  },
  data: {
    action: 'open_activity',
    data_key: 'some_data_value',
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

