const multer = require("multer");
const path = require("path");

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

exports.getUpload = (req, res) =>
  res.render("files", { title: "Upload Files" });

exports.postUpload = (req, res, next) => {
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
