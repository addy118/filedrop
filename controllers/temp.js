exports.postUpload = async (req, res, next) => {
  try {
    // wrap multer in a promise for async handling
    await new Promise((resolve, reject) =>
      uploadFiles(req, res, (err) => (err ? reject(err) : resolve()))
    );

    const { folderId } = req.params;

    // extract file details and save them in parallel
    await Promise.all(
      req.files.forEach(({ originalname, size }) =>
        File.create(
          path.parse(originalname).name,
          Number(folderId),
          size,
          req.user.id
        )
      )
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

exports.postUpload = async (req, res, next) => {
  // handle uploaded files using multer middleware callback
  uploadFiles(req, res, (err) => {
    // handle multer errors
    if (err instanceof multer.MulterError) {
      return res.status(400).render("fileForm", {
        title: "Upload File",
        errors: [{ msg: err.message }],
      });
    } else if (err) {
      next(err);
    }

    // route handler
    const { folderId } = req.params;

    console.log("file uploaded");
    const files = [];
    req.files.forEach((file) => {
      const fileName = path.parse(file.originalname).name;
      const fileSize = file.size;
      files.push({ name: fileName, size: fileSize });
    });
    console.log(files);

    // await Promise.all(
    //   files.map(file => File.create(file.name, folderId, file.size, req.user.id))
    // );

    res.redirect(`/${folderId}/folder`);
  });
};
