const { model, Schema } = require("mongoose");

const AdminSchema = new Schema(
  {
    username: String,
    password: String,
  },
  { timestamps: true }
);

module.exports = model("Admin", AdminSchema);
