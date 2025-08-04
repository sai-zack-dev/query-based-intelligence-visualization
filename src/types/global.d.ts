// types/global.d.ts
interface Window {
  api: {
    aiGenerateSQL: (prompt: string, schema: string) => Promise<string>;
    getSchema?: () => Promise<string>; // optional, based on your usage
  };
}
