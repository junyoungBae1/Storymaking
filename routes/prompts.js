const PromController = require("../controllers/prompts");
const express = require("express");
const router = express.Router();


//prompt받기
router.post('/getPrompt',PromController.prompt);

//이야기 list 조회
router.get('/getList',PromController.list);

//이야기 특정 조회
router.post('/getStory',PromController.story);

//fcm 알림
router.post('/save-token',PromController.fcm);


module.exports = router;