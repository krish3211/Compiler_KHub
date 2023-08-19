const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubmitQSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  pquestion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pquestion",
  },
  passedtestcases: {
    type: String,
    required: true,
  },
  actualtestcases: {
    type: String,
    required: true,
  },
  testpercentage: {
    type: String,
    required: true,
  },
  codes: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const SQuestion = mongoose.model("Submissionquestions", SubmitQSchema);
module.exports = SQuestion;
