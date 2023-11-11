const PromController = require("../controllers/prompts");
const express = require("express");
const router = express.Router();


//값 받는 router
router.post('/getPrompt',PromController.prompt);

module.exports = router;