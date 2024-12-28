const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../prisma/queries/User");
const { validateSignUp, validateLogin } = require("../config/validation");

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

exports.getSignup = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};

exports.getLogin = (req, res) => {
  res.render("login", { title: "Log In" });
};

exports.getLogout = (req, res) => {
  res.render("logout", { title: "Log Out" });
};

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
