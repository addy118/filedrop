const { validationResult } = require("express-validator");

exports.getRouter = (req, res) => {
  res.send("router works!");
};

exports.postNewRouter = [
  validateForm,
  (req, res) => {
    const { field } = req.body;

    // validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("view", {
        title: "New Router",
        errors: errors.array(),
      });
    }

    // route handler
    console.log(field);
    res.send("form submitted!");
  },
];
