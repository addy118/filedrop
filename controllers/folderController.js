const Folder = require("../prisma/queries/Folder");

exports.getFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const folderDetails = await Folder.getItemsById(
    req.user.id,
    Number(folderId)
  );
  console.log(folderDetails);

  if (!folderDetails) {
    const err = new Error("Folder Not Found");
    err.status = 404;
    return next(err);
  }

  res.render("home", {
    title: folderDetails.name,
    views: req.session.view,
    root: folderDetails,
  });
};

exports.postDeleteFolder = async (req, res) => {
  const { folderId } = req.params;

  await Folder.deleteById(Number(folderId));
  res.redirect("/");
};

exports.appError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("customError", {
    title: "Error",
    file: "Folder Controller",
    error: err.message,
  });
};
