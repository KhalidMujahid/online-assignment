const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const Assignment = require("../models/Assignment");
const Question = require("../models/Question");
const Notif = require("../models/Notif");

const router = require("express").Router();

// multer
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
  destination: (req, file, cb) => {
    cb(null, "./public/files");
  },
});

const upload = multer({ storage });

// Home page Login
router.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).render("dashboard", {
      name: req.session.name,
      error: null,
    });
  } else {
    res.status(200).render("index", {
      error: null,
    });
  }
});

// POST: Home page Login
router.post("/login", async (req, res, next) => {
  try {
    const { matnumber, password } = req.body;

    if (!matnumber || !password) {
      res.status(400).render("index", {
        error: "Credentials are required!",
      });
    }

    // check if matnumber exits
    const checkMat = await Student.findOne({ matnumber });
    if (checkMat) {
      // verify the password
      const verifyPassword = await bcrypt.compare(password, checkMat.password);
      if (verifyPassword) {
        req.session.isLoggedIn = true;
        req.session.name = checkMat;
        res.status(301).redirect("/dashboard");
      } else {
        res.status(401).render("index", {
          error: "Invalid credentials",
        });
      }
    } else {
      res.status(401).render("index", {
        error: "Invalid credentials ",
      });
    }
  } catch (error) {
    next(error);
  }
});

// Student dashboard
router.get("/dashboard", (req, res, next) => {
  try {
    res.status(200).render("dashboard", {
      name: req.session.name,
      error: null,
      query: null,
    });
  } catch (error) {
    next(error);
  }
});

// Student query dashboard
router.get("/query", async (req, res, next) => {
  try {
    const data = await Question.find({ title: req.query.title });

    res.status(200).render("dashboard", {
      name: req.session.name,
      error: null,
      query: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// View query dashboard
router.get("/view/:id", async (req, res, next) => {
  try {
    const data = await Question.findById(req.params.id);

    res.status(200).render("view", {
      name: req.session.name,
      data,
      error: false,
      message: false,
    });
  } catch (error) {
    next(error);
  }
});

// Registe page
router.get("/register", (req, res) => {
  res.status(200).render("register", {
    error: null,
  });
});

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(301).redirect("/");
});

// Registe page routes POST
router.post("/register", async (req, res, next) => {
  try {
    const { fname, lname, matnumber, level, dept, password } = req.body;

    if (!fname || !lname || !matnumber || !level || !dept || !password) {
      res.status(400).render("register", {
        error: "Credentials are required!",
      });
    }
    if (Number(fname) && Number(lname)) {
      return res.status(400).render("register", {
        error: "Name can't be a number",
      });
    }

    // check if matnumber already exit
    const alreadyMa = await Student.findOne({ matnumber });
    if (!alreadyMa) {
      // hashpassword
      const hashpassword = await bcrypt.hash(password, 13);

      await Student.create({
        fname,
        lname,
        level,
        dept,
        matnumber,
        password: hashpassword,
      })
        .then(() => {
          res.status(200).render("register", {
            error: "Account created",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      res.status(401).render("register", {
        error: "Account already exits",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/submit", upload.single("image"), async (req, res, next) => {
  try {
    const data = await Question.findById(req.body.id);
    if (!req.file && !req.file.image) {
      res.status(400).render("view", {
        name: req.session.name,
        error: "File is required",
        data,
        message: false,
      });
    }

    // check mat
    const mat = await Student.findOne({ matnumber: req.body.matnumber });
    if (!mat) {
      return;
    }

    await Assignment.create({
      user: mat._id,
      question_id: req.body.id,
      title: req.body.title,
      file: req.file.filename,
    })
      .then(async (data) => {
        await Notif.create({
          user: mat._id,
          course: req.body.id,
        });
        res.status(200).render("view", {
          name: req.session.name,
          error: false,
          data,
          message: "Assignment submitted!",
        });
      })
      .catch(async (error) => {
        const data = await Question.findById(req.body.id);

        res.status(400).render("view", {
          name: req.session.name,
          error: "An error occured please try again later",
          data,
          message: false,
        });
      });
  } catch (error) {
    const data = await Question.findById(req.body.id);

    return res.status(400).render("view", {
      name: req.session.name,
      error: "File is required!",
      data,
      message: false,
    });
  }
});

// Bell page
router.get("/bell/:id", async (req, res, next) => {
  try {
    const bells = await Notif.find({ user: req.params.id }).populate("course");
    res.status(200).render("bell", { bells });
  } catch (error) {
    next(error);
  }
});

// Noti
router.get("/noti/:id", async (req, res, next) => {
  try {
    // await
  } catch (error) {
    next(error);
  }
});

module.exports = router;
