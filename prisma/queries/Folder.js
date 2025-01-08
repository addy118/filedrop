const db = require("../../config/prismaClient");

class Folder {
  static async create(name, parentId, userId) {
    try {
      await db.folder.create({
        data: {
          name,
          parentId,
          userId,
        },
      });
    } catch (error) {
      // handle unique constraint error
      if (error.code === "P2002" && error.meta?.target?.includes("name")) {
        throw new Error(
          `A folder with the name '${name}' already exists in this parent folder for user ID ${userId}.`
        );
      }
      // rethrow other errors
      throw new Error(`Error creating folder '${name}': ${error.message}`);
    }
  }

  static async createRoot(userId) {
    try {
      await db.folder.create({
        data: {
          name: "Root",
          userId: userId,
        },
      });
    } catch (error) {
      throw new Error(
        `Error creating root folder for user ID ${userId}: ${error.message}`
      );
    }
  }

  static async getRoot(userId) {
    try {
      const rootFolder = await db.folder.findFirst({
        where: {
          userId: userId,
          parentId: null,
        },
        include: {
          subFolders: true,
          files: true,
        },
      });
      if (!rootFolder) {
        throw new Error(`Root folder not found for user ID ${userId}.`);
      }
      return rootFolder;
    } catch (error) {
      throw new Error(
        `Error retrieving root folder for user ID ${userId}: ${error.message}`
      );
    }
  }

  static async getParent(childId) {
    try {
      const childFolder = await this.getItemsById(childId);
      if (!childFolder) {
        throw new Error(`Child folder with ID ${childId} not found.`);
      }
      const parentFolder = await this.getItemsById(childFolder.parentId);
      if (!parentFolder) {
        throw new Error(`Parent folder for child ID ${childId} not found.`);
      }
      return parentFolder;
    } catch (error) {
      throw new Error(
        `Error retrieving parent folder for child ID ${childId}: ${error.message}`
      );
    }
  }

  static async getItemsById(folderId) {
    try {
      const folder = await db.folder.findFirst({
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
      if (!folder) {
        throw new Error(`Folder with ID ${folderId} not found.`);
      }
      return folder;
    } catch (error) {
      throw new Error(
        `Error retrieving folder with ID ${folderId}: ${error.message}`
      );
    }
  }

  static async deleteById(folderId) {
    try {
      const folder = await this.getItemsById(folderId);
      await db.folder.delete({
        where: { id: folderId },
      });
      return `Folder with ID ${folderId} deleted successfully.`;
    } catch (error) {
      if (error.message.includes("not found")) {
        throw new Error(`Cannot delete: ${error.message}`);
      }
      throw new Error(
        `Error deleting folder with ID ${folderId}: ${error.message}`
      );
    }
  }
}

module.exports = Folder;
