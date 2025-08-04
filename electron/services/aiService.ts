// /electron/services/aiService.ts
import fetch from "node-fetch";

const API_BASE = "http://localhost:3000"; // local proxy for dev

type GroqResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

export async function generateSQLFromPrompt(prompt: string, schema: string): Promise<string> {
  const res = await fetch(`${API_BASE}/generate-sql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, schema }),
  });

  const data = (await res.json()) as GroqResponse;
  console.log(data)

  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

// "http://localhost:3000"