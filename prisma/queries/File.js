const db = require("../../config/prismaClient");

class File {
  static async getById(fileId) {
    return await db.file.findFirst({
      where: {
        id: fileId,
      },
    });
  }

  static async deleteById(fileId) {
    await db.file.delete({
      where: { id: fileId },
    });
  }

  static async getFolderId(fileId) {
    const file = await File.getById(fileId);
    return file.folderId;
  }
}

module.exports = File;
