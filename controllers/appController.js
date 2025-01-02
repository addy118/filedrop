const Folder = require("../prisma/queries/Folder");

exports.getApp = async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
    // next();
  }

  const rootFolder = await Folder.getRoot(req.user.id);
  console.log(rootFolder);

  // increment the view count
  if (!req.session.view) {
    req.session.view = 1;
  } else {
    req.session.view++;
  }

  res.render("home", {
    title: "Home",
    views: req.session.view,
    root: rootFolder,
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
