import { connectionManager } from "./connectionManager";

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
};
