const db = require("../config/prismaClient");
const File = require("./queries/File");
const Folder = require("./queries/Folder");

const main = async () => {
  const file = await Folder.getItemsById(22);

  console.log(file);
};

main();
