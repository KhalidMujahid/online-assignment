const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

// session
app.use(
  session({
    secret: "Online assignment",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// db
require("./config/db");

// app.use((req, res, next) => {
//   if (req.session) {
//     next();
//   }
//   res.status(301).redirect("/");
// });

// middlewares
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// routes
app.use("/", require("./routes/student.route"));
app.use("/", require("./routes/admin.route"));

app.listen(PORT, () => console.log("Server running on port... ", PORT));
