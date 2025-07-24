export type ConnectionMeta = {
  name: string;
  host: string;
  type: string;
  lastUpdate: string;
};

export type ExplorerData = Record<
  string,
  {
    tables: string[];
    schema: Record<string, any[]>;
  }
>;
