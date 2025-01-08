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

exports.postDownloadFolder = async (req, res) => {
  const folderId = Number(req.params.folderId);
  const userId = Number(req.params.userId);

  try {
    // 1. fetch folder and file metadata from Supabase
    // adjust the path to match your folder structure in Supabase
    const folderPath = `${userId}/${folderId}`;
    const { data: files, error } = await supabase.storage
      .from("files")
      .list(folderPath, { recursive: true });
    if (error) {
      return res.status(500).json({ error: "Failed to fetch folder contents" });
    }
    console.log(files);

    // 2. create a ZIP file in memory
    const zipPath = path.resolve(__dirname, `folder_${folderId}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // pipe archive data to the output file
    archive.pipe(output);

    // 3. add files and folders to the archive
    for (const file of files) {
      const filePath = `/${folderPath}/${file.name}`;
      console.log(`file path: ${filePath}`);
      const { data: fileStream, error: downloadError } = await supabase.storage
        .from("files")
        .download(filePath);

      if (downloadError) {
        console.error(`Error downloading file: ${filePath}`);
        continue;
      }

      console.log("adding files...");
      archive.append(fileStream, {
        name: filePath.replace(`${folderPath}/`, ""),
      }); // preserve hierarchical structure
    }

    // 4. finalize the archive
    console.log("finalizing...");
    await archive.finalize();

    // handle stream events
    output.on("close", () => {
      console.log(`ZIP file created: ${archive.pointer()} total bytes`);
      res.download(zipPath, `folder_${folderId}.zip`, (err) => {
        if (err) {
          console.error(err);
        }
        fs.unlinkSync(zipPath); // delete the ZIP file after download
      });
    });

    archive.on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Error creating ZIP file" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
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
