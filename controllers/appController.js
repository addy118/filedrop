const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../prisma/queries/User");
const multer = require("multer");
const path = require("path");
const { validateSignUp, validateLogin } = require("../config/validation");

const diskStorage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, done) => {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    done(null, file.fieldname + "-" + uniqueSuffix + fileExt);
  },
});

const uploadFiles = multer({
  storage: diskStorage,
  limits: {
    fileSize: 20 * 1000,
    files: 10,
  },
}).array("files", 10);

exports.getApp = (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    next();
  }

  if (!req.session.view) {
    req.session.view = 1;
  } else {
    req.session.view++;
  }
  res.render("home", { title: "Home", views: req.session.view });
};

exports.getSignup = (req, res) => res.render("signup", { title: "Sign Up" });

exports.getLogin = (req, res) => res.render("login", { title: "Log In" });

exports.getFiles = (req, res) => res.render("files", { title: "Upload Files" });

exports.getLogout = (req, res) => res.render("logout", { title: "Log Out" });

exports.postSignup = [
  validateSignUp,
  async (req, res) => {
    const { uname, pass } = req.body;

    // handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        title: "Sign Up",
        errors: errors.array(),
      });
    }

    // route handler
    const hashedPass = await bcrypt.hash(pass, 10);
    const user = await User.createUser(uname, hashedPass);
    console.log(user.uname, user.pass);
    res.redirect("/");
  },
];

exports.postLogin = [
  validateLogin,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        title: "Log In",
        errors: errors.array(),
      });
    }
    next();
  },
];

exports.postFiles = (req, res, next) => {
  // handle uploaded files using multer middleware
  uploadFiles(req, res, (err) => {
    // handle multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).render("files", {
        title: "Upload File",
        errors: [{ msg: err.message }],
      });
    } else if (err) {
      next(err);
    }

    // route handler
    console.log("file uploaded");
    res.status(200).send(req.files);
  });
};

exports.postLogout = (req, res) => {
  req.logout((err) => {
    if (err) next(err);
    res.redirect("/");
  });
};

exports.routeError = (req, res) => {
  res.status(500).render("notFound");
};

exports.appError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("customError", {
    title: "Error",
    file: "Application",
    error: err.message,
  });
};
