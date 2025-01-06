const db = require("../../config/prismaClient");

class Folder {
  static async create(name, parentId, userId) {
    await db.folder.create({
      data: {
        name,
        parentId,
        userId,
      },
    });
  }

  static async createRoot(userId) {
    await db.folder.create({
      data: {
        name: "Root",
        userId: userId,
      },
    });
  }

  static async getRoot(userId) {
    return await db.folder.findFirst({
      where: {
        userId: userId,
        parentId: null,
      },
      include: {
        subFolders: true,
        files: true,
      },
    });
  }

  static async getParent(childId) {
    const childFolder = await Folder.getItemsById(childId);
    return await Folder.getItemsById(childFolder.parentId);
  }

  static async getItemsById(folderId) {
    return await db.folder.findFirst({
      where: {
        id: folderId,
      },
      include: {
        subFolders: true,
        files: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  static async deleteById(folderId) {
    await db.folder.delete({
      where: { id: folderId },
    });
  }
}

module.exports = Folder;
