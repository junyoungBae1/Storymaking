const StoryController = require("../controllers/storys");
const express = require("express");
const router = express.Router();


//값 받는 router
router.post('/story',StoryController.story);

module.exports = router;