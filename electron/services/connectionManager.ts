// electron/services/connectionManager.ts
import mysql from "mysql2/promise";
import type { ConnectionData } from "@/types/connection";

class ConnectionManager {
  private activeConnection: mysql.Connection | null = null;
  private activeConnectionMeta: ConnectionData | null = null;

  async testConnection(
    config: any
  ): Promise<{ success: boolean; message?: string }> {
    const { host, port, username, password, database } = config;

    try {
      const connection = await mysql.createConnection({
        host,
        port: Number(port),
        user: username,
        password,
        database,
      });

      await connection.connect();
      await connection.end();

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async connectToDatabase(
    conn: any
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Close existing connection
      if (this.activeConnection) {
        await this.activeConnection.end();
        this.activeConnection = null;
        this.activeConnectionMeta = null;
      }

      const connection = await mysql.createConnection({
        host: conn.host,
        port: parseInt(conn.port),
        user: conn.username,
        password: conn.password,
        database: conn.database,
      });

      this.activeConnection = connection;
      this.activeConnectionMeta = {
        id: conn.id,
        name: conn.name,
        type: conn.type,
        host: conn.host ?? null,
        port: conn.port ? parseInt(conn.port) : null,
        file: null,
        date: new Date().toISOString(),
      };

      // console.log("✅ activeConnectionMeta SET:", this.activeConnectionMeta);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async disconnect(): Promise<{ success: boolean; message?: string }> {
    try {
      if (this.activeConnection) {
        await this.activeConnection.end();
        this.activeConnection = null;
        this.activeConnectionMeta = null;
      }
      return { success: true };
    } catch (err: any) {
      console.error("Failed to disconnect:", err);
      return { success: false, message: err.message };
    }
  }

  getActiveConnectionMeta(): {
    success: boolean;
    meta?: ConnectionData;
    message?: string;
  } {
    if (this.activeConnectionMeta) {
      return { success: true, meta: this.activeConnectionMeta };
    }
    return { success: false, message: "No active connection" };
  }

  getActiveConnection(): mysql.Connection | null {
    return this.activeConnection;
  }

  async getDatabaseExplorerData(): Promise<{
    success: boolean;
    explorer?: any;
    message?: string;
  }> {
    if (!this.activeConnection) {
      return { success: false, message: "No active connection" };
    }

    try {
      const [dbRows]: [any[], any] = await this.activeConnection.query(
        "SHOW DATABASES"
      );
      const databases: string[] = dbRows.map((row: any) => row.Database);

      const dbData: Record<
        string,
        { tables: string[]; schema: Record<string, any[]> }
      > = {};

      for (const db of databases) {
        await this.activeConnection.query(`USE \`${db}\``);

        const [tableRows]: [any[], any] = await this.activeConnection.query(
          "SHOW TABLES"
        );
        const tableNames: string[] = (tableRows as any[]).map(
          (t) => Object.values(t)[0] as string
        );

        const tableSchemas: Record<string, any[]> = {};

        for (const table of tableNames) {
          const [columns]: [any[], any] = await this.activeConnection.query(
            `DESCRIBE \`${table}\``
          );
          tableSchemas[table] = columns;
        }

        dbData[db] = {
          tables: tableNames,
          schema: tableSchemas,
        };
      }

      return { success: true, explorer: dbData };
    } catch (err: any) {
      console.error("Explorer error:", err);
      return { success: false, message: err.message };
    }
  }
}

export const connectionManager = new ConnectionManager();
