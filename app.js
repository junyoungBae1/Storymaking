const express = require("express");
const app = express();
const port = 3000;
//const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require('body-parser');

var promRouter = require("./routes/prompts");
/*
mongoose
  .connect(process.env.DBURI)
  .then(() => {
    console.log("DB에 연결되었습니다.");
  })
  .catch((err) => {
    console.log("DB 연결중 문제가 발생했습니다.");
    console.log(err);
  });
*/

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