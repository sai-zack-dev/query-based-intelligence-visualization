import { connectionManager } from "./connectionManager";
import {
  addQuery,
  getAllQueries,
  getQueryById,
  deleteQueryById,
} from "../db/queries";

export const queryService = {
  async runSQL(payload: { database: string; query: string }) {
    try {
      const conn = connectionManager.getActiveConnection();
      if (!conn) return { success: false, message: "No DB connected" };

      await conn.query(`USE \`${payload.database}\``);
      const [rows] = await conn.query(payload.query);

      return { success: true, data: rows };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async saveQuery(query: {
    name: string;
    description: string;
    sql: string;
  }): Promise<{ success: boolean; uuid?: string, message?: string }> {
    try {
      if (!query.name || !query.sql) {
        return { success: false };
      }

      const connection = await connectionManager.getActiveConnectionMeta();
      console.log("Active connection meta:", connection);
      const connectionId = connection?.meta?.id;
      console.log("ID being inserted into queries:", connection?.meta?.id);

      const uuid = addQuery({
        name: query.name,
        description: query.description,
        sql: query.sql,
        connection_id: Number(connectionId),
      });

      return { success: true, uuid };
    } catch (err: any) {
      console.error("Failed to save query:", err);
      return { success: false, message: err.message};
    }
  },

  getAllQueries() {
    try {
      return getAllQueries();
    } catch (err: any) {
      console.error("Failed to get saved queries:", err);
      return [];
    }
  },

  getQueryById(id: number) {
    try {
      return getQueryById(id);
    } catch (err: any) {
      console.error("Failed to get query:", err);
      return null;
    }
  },

  deleteQueryById(id: number): { success: boolean } {
    try {
      const success = deleteQueryById(id);
      return { success };
    } catch (err: any) {
      console.error("Failed to delete query:", err);
      return { success: false };
    }
  },
};
