const db = require("../../config/prismaClient");

class File {
  static async create(name, folderId, type, size, userId, url = null) {
    try {
      await db.file.create({
        data: { name, folderId, type, size, userId, url },
      });
    } catch (error) {
      // check if the error is a P2002 unique constraint violation
      if (error.code === "P2002" && error.meta?.target?.includes("name")) {
        throw new Error(
          "File with the same name already exists in this folder for the user."
        );
      }
      // rethrow other errors
      throw error;
    }
  }

  static async getById(fileId) {
    try {
      const file = await db.file.findFirst({
        where: {
          id: fileId,
        },
      });
      if (!file) {
        throw new Error(`File with ID ${fileId} not found.`);
      }
      return file;
    } catch (error) {
      throw new Error(
        `Error retrieving file with ID ${fileId}: ${error.message}`
      );
    }
  }

  // static async getById(fileId) {
  //   return await db.file.findFirst({
  //     where: {
  //       id: fileId,
  //     },
  //   });
  // }

  static async deleteById(fileId) {
    try {
      const file = await this.getById(fileId);
      await db.file.delete({
        where: { id: fileId },
      });
      return `File with ID ${fileId} deleted successfully.`;
    } catch (error) {
      if (error.message.includes("not found")) {
        throw new Error(`Cannot delete: ${error.message}`);
      }
      throw new Error(
        `Error deleting file with ID ${fileId}: ${error.message}`
      );
    }
  }

  static async getFolderId(fileId) {
    try {
      const file = await this.getById(fileId);
      return file.folderId;
    } catch (error) {
      throw new Error(
        `Error retrieving folder ID for file with ID ${fileId}: ${error.message}`
      );
    }
  }
}

module.exports = File;
