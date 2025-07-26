// electron/services/connectionService.ts - Connection CRUD operations
import {
  addConnection,
  getAllConnections,
  updateConnectionByName,
  updateConnectionNameByConfig,
  findConnectionByName,
  findConnectionByConfig,
} from "../db/connections";

export class ConnectionService {
  private validateConnection(conn: any): { isValid: boolean; missingFields?: string[] } {
    const missingFields = [];
    if (!conn?.name) missingFields.push("Name");
    if (!conn?.host) missingFields.push("Host");
    if (!conn?.port) missingFields.push("Port");
    if (!conn?.username) missingFields.push("Username");

    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields.length > 0 ? missingFields : undefined,
    };
  }

  async saveConnection(conn: any): Promise<any> {
    try {
      const validation = this.validateConnection(conn);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Missing required fields: ${validation.missingFields!.join(", ")}`,
          missingFields: validation.missingFields,
        };
      }

      const nameMatch = findConnectionByName(conn.name);
      const configMatch = findConnectionByConfig(conn.host, conn.port, conn.username);

      if (nameMatch) {
        return { conflict: "name", existing: nameMatch };
      } else if (configMatch) {
        return { conflict: "config", existing: configMatch };
      }

      addConnection(conn);
      return { success: true };
    } catch (err: any) {
      console.error("Failed to save connection:", err);
      return { success: false, message: err.message || "Unknown error" };
    }
  }

  async updateConnectionByName(conn: any): Promise<any> {
    try {
      const validation = this.validateConnection(conn);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Missing required fields: ${validation.missingFields!.join(", ")}`,
          missingFields: validation.missingFields,
        };
      }

      updateConnectionByName(conn);
      return { success: true };
    } catch (err: any) {
      console.error("Failed to update connection:", err);
      return { success: false, message: err.message || "Update failed" };
    }
  }

  async updateConnectionNameByConfig(payload: any): Promise<any> {
    try {
      const validation = this.validateConnection(payload);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Missing required fields: ${validation.missingFields!.join(", ")}`,
          missingFields: validation.missingFields,
        };
      }

      updateConnectionNameByConfig(
        payload.name,
        payload.host,
        payload.port,
        payload.username
      );
      return { success: true };
    } catch (err: any) {
      console.error("Failed to update connection name:", err);
      return { success: false, message: err.message || "Rename failed" };
    }
  }

  async forceCreateConnection(conn: any): Promise<any> {
    try {
      const validation = this.validateConnection(conn);
      if (!validation.isValid) {
        return {
          success: false,
          message: `Missing required fields: ${validation.missingFields!.join(", ")}`,
          missingFields: validation.missingFields,
        };
      }

      // Generate a unique name if needed
      let uniqueName = conn.name;
      let counter = 1;
      while (findConnectionByName(uniqueName)) {
        uniqueName = `${conn.name}_${counter}`;
        counter++;
      }

      const connectionWithUniqueName = {
        ...conn,
        name: uniqueName,
      };

      addConnection(connectionWithUniqueName);
      return { success: true, savedName: uniqueName };
    } catch (err: any) {
      console.error("Failed to force create connection:", err);
      return { success: false, message: err.message || "Unknown error" };
    }
  }

  getConnections(): any {
    try {
      return getAllConnections();
    } catch (err: any) {
      console.error("Failed to get connections:", err);
      return {
        success: false,
        message: err.message || "Failed to retrieve connections",
      };
    }
  }
}

export const connectionService = new ConnectionService();