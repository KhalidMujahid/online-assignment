const { connect } = require("mongoose");

connect("mongodb://localhost/Online-assignment")
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));
