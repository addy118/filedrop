const { validationResult } = require("express-validator");
const { validateLogin, validateSignUp } = require("../config/validation");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../prisma/queries/User");

exports.getSignup = (req, res) => res.render("signup", { title: "Sign Up" });

exports.getLogin = (req, res) => res.render("login", { title: "Log In" });

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
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
];

exports.postLogout = (req, res) => {
  req.logout((err) => {
    if (err) next(err);
    res.redirect("/");
  });
};

exports.authError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("customError", {
    title: "Error",
    file: "Authentication",
    error: err.message,
  });
};
