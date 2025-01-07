const Folder = require("../prisma/queries/Folder");
const Supabase = require("../prisma/queries/Supabase");

exports.getFolder = async (req, res, next) => {
  const { folderId } = req.params;

  const folderDetails = await Folder.getItemsById(Number(folderId));
  console.log("folder " + folderId + " rendered!");

  if (!folderDetails) {
    const err = new Error("Folder Not Found");
    err.status = 404;
    return next(err);
  }

  res.render("folder", {
    title: folderDetails.name,
    views: req.session.view,
    root: folderDetails,
    folderId: folderDetails.id,
  });
};

exports.getNewFolder = (req, res) => {
  const { folderId } = req.params;

  res.render("folderForm", {
    title: "New Folder",
    parentId: folderId,
  });
};

exports.postNewFolder = (req, res) => {
  const { folderId } = req.params;
  const { folderName } = req.body;

  Folder.create(folderName, Number(folderId), req.user.id);
  res.redirect(`/${folderId}/folder`);
};

exports.postDeleteFolder = async (req, res) => {
  const folderId = Number(req.params.folderId);
  const userId = Number(req.user.id);

  const parent = await Folder.getParent(folderId);

  try {
    // delete the contents of the folder (files and subfolders)
    await Supabase.removeFolder(folderId, userId);

    // delete the folder metadata itself from db
    await Folder.deleteById(folderId);

    // redirect to the parent folder
    res.redirect(`/${parent.id}/folder`);
  } catch (err) {
    console.error("Error deleting the folder: ", err.message);
    console.error("Stack: ", err.stack);
    res.status(500).send("Failed to remove folder and its files.");
  }
};

exports.appError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("customError", {
    title: "Error",
    file: "Folder Controller",
    error: err.message,
  });
};
