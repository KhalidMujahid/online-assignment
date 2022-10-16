const { Router } = require("express");
const Assignment = require("../models/Assignment");
const path = require("path");
const Notif = require("../models/Notif");
const Question = require("../models/Question");
const Student = require("../models/Student");

const router = Router();

// Admin panel
router.get("/admin/login", (req, res) => {
  res.status(200).render("admin/index", {
    error: null,
  });
});

// Admin logout panel
router.get("/admin/logout", (req, res) => {
  res.status(301).redirect("/admin/login");
});

// POST: Admin panel login
router.post("/admin", (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).render("admin/index", {
        error: "Credentials are required!",
      });
    }

    if (username === "1" && password === "1") {
      res.status(301).redirect("/dashboard/admin");
    } else {
      res.status(401).render("admin/index", {
        error: "Invalid credentials",
      });
    }
  } catch (error) {
    next(error);
  }
});

// Dashboard
router.get("/dashboard/admin", (req, res) => {
  res.status(200).render("admin/dashboard");
});

// Assigment route
router.get("/admin/assignment", async (req, res, next) => {
  try {
    await Assignment.find()
      .populate("user")
      .then((data) => {
        res.status(200).render("admin/assignment", {
          data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    next(error);
  }
});

// download
router.get("/download/:id", async (req, res, next) => {
  try {
    return res
      .status(200)
      .download(path.join(__dirname, "../public/files", req.params.id));
  } catch (error) {
    next(error);
  }
});

// add assignment
router.get("/admin/add/assignment", async (req, res, next) => {
  try {
    return res.status(200).render("admin/add-assignment", {
      error: false,
      message: false,
    });
  } catch (error) {
    next(error);
  }
});

// add assignment POST router
router.post("/add_assignment", async (req, res, next) => {
  try {
    const { title, question } = req.body;

    if (!title || !question) {
      return res.status(400).render("admin/add-assignment", {
        error: true,
        message: false,
      });
    }

    // Save the question in the DB
    await Question.create(req.body)
      .then(() => {
        return res.status(200).render("admin/add-assignment", {
          error: false,
          message: true,
        });
      })
      .catch(() => {
        return res.status(400).send("An error occured!");
      });
  } catch (error) {
    next(error);
  }
});

// All students
router.get("/admin/students", async (req, res, next) => {
  try {
    await Student.find()
      .then((data) => {
        res.status(200).render("admin/students", {
          data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    next(error);
  }
});

// Create notif
router.post("/noti", async (req, res, next) => {
  try {
    await Notif.create({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
