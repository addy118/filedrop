exports.getApp = (req, res) => {
  if (!req.session.view) {
    req.session.view = 1;
  } else {
    req.session.view++;
  }
  res.render("home", { title: "Home", views: req.session.view });
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
