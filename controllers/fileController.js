const multer = require("multer");
const path = require("path");
const File = require("../prisma/queries/File");



exports.getUpload = (req, res) => {
  const { folderId } = req.params;
  res.render("fileForm", { title: "Upload Files", folderId: folderId });
};

exports.postUpload = async (req, res, next) => {
  try {
    // wrap multer in a promise for async handling
    await new Promise((resolve, reject) =>
      uploadFiles(req, res, (err) => (err ? reject(err) : resolve()))
    );

    const { folderId } = req.params;
    console.log("file uploaded");

    // extract file details and save them in parallel

    const files = [];
    req.files.forEach((file) => {
      const fileName = path.parse(file.originalname).name;
      files.push({
        name: fileName,
        size: file.size,
      });
    });

    await Promise.all(
      files.map((file) => {
        File.create(file.name, Number(folderId), file.size, req.user.id);
      })
    );

    res.redirect(`/${folderId}/folder`);
  } catch (err) {
    // handle multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).render("fileForm", {
        title: "Upload File",
        errors: [{ msg: err.message }],
      });
    }
    // handle other errors
    next(err);
  }
};

exports.postDeleteFile = async (req, res) => {
  const { fileId } = req.params;
  const folderId = await File.getFolderId(Number(fileId));
  await File.deleteById(Number(fileId));
  res.redirect(`/${folderId}/folder`);
};
