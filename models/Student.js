const { model, Schema } = require("mongoose");

const StudentSchema = new Schema(
  {
    fname: String,
    lname: String,
    level: String,
    dept: String,
    matnumber: String,
    password: String,
  },
  { timestamps: true }
);

module.exports = model("Student", StudentSchema);
