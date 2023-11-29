const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  image:{
    type: String,
    required: true
  },
  detail:{
    type: String,
    required: true
  },
  music:{
    type: String,
    requried: true
  }
},{_id: false},{ versionKey: false })

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique : false,
  },
  representative_image:{
    type: String,
    required: true,
  },
  contents: [pageSchema]
},{ versionKey: false });

module.exports = mongoose.model("Story",StorySchema);