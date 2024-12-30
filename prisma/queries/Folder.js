const db = require("../../config/prismaClient");

class Folder {
  static async getRoot(userId) {
    const root = await prisma.folder.findFirst({
      where: {
        userId: userId,
        parentId: null,
      },
      include: {
        subFolders: true,
        files: true,
      },
    });

    return root;
  }

  static async getFolderItems(folderId) {
    const folder = await db.folder.findFirst({
      where: {
        userId: 1,
        id: folderId,
      },
      include: {
        subFolders: true,
        files: true,
      },
    });

    return folder;
  }
}

module.exports = Folder;
