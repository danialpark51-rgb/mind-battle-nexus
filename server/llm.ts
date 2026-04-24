import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export const PRIMARY_MODEL = "gpt-5.4";
export const FAST_MODEL = "gpt-5-mini";

export async function jsonChat<T>(args: {
  system: string;
  user: string;
  model?: string;
}): Promise<T> {
  const res = await openai.chat.completions.create({
    model: args.model ?? PRIMARY_MODEL,
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 8192,
  });
  const raw = res.choices[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(`LLM returned non-JSON content: ${raw.slice(0, 200)}`);
  }
}

export async function textChat(args: {
  system: string;
  user: string;
  model?: string;
}): Promise<string> {
  const res = await openai.chat.completions.create({
    model: args.model ?? PRIMARY_MODEL,
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
    max_completion_tokens: 8192,
  });
  return res.choices[0]?.message?.content ?? "";
}
