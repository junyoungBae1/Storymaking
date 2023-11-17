const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  id:{
    type : String,
    required: true,
    unique : true,
  },
  title: {
    type: String,
    required: false,
    unique : false,
  },
  content: {
    type: String,
    required: false,
  }
},{ __v : false });

module.exports = mongoose.model("Story",StorySchema);