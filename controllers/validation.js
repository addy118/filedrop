const { body } = require("express-validator");

exports.validateSignUp = [
  body("fname")
    .trim()
    .isAlpha()
    .withMessage("First name should only contain letters!")
    .isLength({ min: 2, max: 30 })
    .withMessage("First name should be between 2 and 30 characters!"),

  body("lname")
    .trim()
    .isAlpha()
    .withMessage("Last name should only contain letters!")
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name should be between 2 and 30 characters!"),

  body("email").isEmail().withMessage("Please provide a valid email address!"),

  // body("email")
  //   .trim()
  //   .isLength({ min: 3, max: 20 })
  //   .withMessage("Username should be between 3 and 20 characters!")
  //   .matches(/^[a-zA-Z0-9_]+$/)
  //   .withMessage(
  //     "Username should only contain letters, numbers, and underscores!"
  //   ),

  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be at least 3 characters long!"),
  // .matches(/\d/)
  // .withMessage("Password should contain at least one number!")
  // .matches(/[a-zA-Z]/)
  // .withMessage("Password should contain at least one letter!"),
];

exports.validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email address!"),

  // body("email")
  //   .trim()
  //   .isLength({ min: 3, max: 20 })
  //   .withMessage("Username should be between 3 and 20 characters!")
  //   .matches(/^[a-zA-Z0-9_]+$/)
  //   .withMessage(
  //     "Username should only contain letters, numbers, and underscores!"
  //   ),

  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should be at least 3 characters long!"),
  // .matches(/\d/)
  // .withMessage("Password should contain at least one number!")
  // .matches(/[a-zA-Z]/)
  // .withMessage("Password should contain at least one letter!"),
];

exports.validateMember = [
  body("joincode")
    .equals("alohomora")
    .withMessage("Your entered club joining code is incorrect!"),
];

exports.validateAdmin = [
  body("admincode")
    .equals("hermione")
    .withMessage("Your entered admin code is incorrect!"),
];
