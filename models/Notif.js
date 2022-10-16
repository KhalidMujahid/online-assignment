const { model, Schema } = require("mongoose");

const NotifSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  },
  { timestamps: true }
);

module.exports = model("Notif", NotifSchema);
