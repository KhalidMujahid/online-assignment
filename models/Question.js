const { model, Schema } = require("mongoose");

const QuestionSchema = new Schema(
  {
    title: String,
    question: String,
  },
  { timestamps: true }
);

module.exports = model("Question", QuestionSchema);
