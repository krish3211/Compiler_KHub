const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
  testcases: {
    type: Array,
    required: true,
  },
  level: {
    type: String,
    enum: {
      values: ["easy", "medium", "hard"],
      message: "{VALUE} is not supported",
    },
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});
const PQuestion = mongoose.model("Codingquestions", QuestionSchema);
module.exports = PQuestion;
