const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  image:{
    type: Number,
    require: true,
  },
}, { _id : false });

module.exports = mongoose.model("Story",StorySchema);