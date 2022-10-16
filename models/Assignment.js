const { model, Schema } = require("mongoose");

const AssignmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    question_id: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    title: String,
    file: String,
  },
  { timestamps: true }
);

module.exports = model("Assignment", AssignmentSchema);
