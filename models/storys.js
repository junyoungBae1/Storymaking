const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    unique : false,
  },
  content: {
    type: String,
    required: false,
  }
},{ versionKey: false });

module.exports = mongoose.model("Story",StorySchema);