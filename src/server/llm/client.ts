import { Readable } from "stream";
import { GoogleGenAI as GoogleGenAISDK } from "@google/genai";
import { SYSTEM_PROMPT } from "~/lib/system_prompt";
import { sanitizeLLMResponse } from "~/lib/llm-formatter";

// Type definitions for GoogleGenAI SDK to improve type safety
interface ContentPart {
  text: string;
}

interface Content {
  role: "user" | "model";
  parts: ContentPart[];
}

interface GoogleGenAIType {
  models: {
    generateContentStream(params: {
      model: string;
      contents: Content[];
    }): Promise<AsyncIterable<{ text(): Promise<string> }>>;
  };
}

// Helper to properly type the GoogleGenAI instance
function initializeGoogleGenAI(apiKey: string): GoogleGenAIType {
  return new GoogleGenAISDK({ apiKey }) as unknown as GoogleGenAIType;
}

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export interface LLMStreamOptions {
  model: string;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
}

export async function streamLLMResponse(
  options: LLMStreamOptions,
): Promise<Readable> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error("LLM_API_KEY not configured");
  }

  const ai = initializeGoogleGenAI(apiKey);

  // Build "chat‐style" prompt: combine the system prompt as first user turn
  const fullMessages: Content[] = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    ...options.messages.map((m) => {
      const role: "user" | "model" = m.role === "assistant" ? "model" : "user";
      return {
        role,
        parts: [{ text: m.content }],
      };
    }),
  ];

  const stream = await ai.models.generateContentStream({
    model: options.model,
    contents: fullMessages,
  });

  // The SDK returns an async iterable of chunks; we convert to Readable stream
  const passThrough = new Readable({
    read(_size?: number) {
      // Required by Readable interface
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  (async () => {
    try {
      for await (const chunk of stream) {
        let text = "";

        const chunkAny: unknown = chunk;

        // Check if chunk has a text() method
        if (
          chunkAny !== null &&
          typeof chunkAny === "object" &&
          "text" in chunkAny &&
          typeof (chunkAny as Record<string, unknown>).text === "function"
        ) {
          const fn = (chunkAny as Record<string, unknown>)
            .text as () => Promise<string>;
          text = await fn();
        }
        // Check if chunk has candidates array with content
        else if (
          chunkAny !== null &&
          typeof chunkAny === "object" &&
          "candidates" in chunkAny
        ) {
          const candidates = (chunkAny as Record<string, unknown>)
            .candidates as Array<{
            content: { parts: Array<{ text: string }> };
          }>;
          if (candidates?.[0]?.content?.parts?.[0]?.text) {
            text = candidates[0].content.parts[0].text;
          }
        }

        if (text) {
          passThrough.push(text);
        }
      }
      passThrough.push(null);
    } catch (err) {
      passThrough.destroy(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  return passThrough;
}

export async function processLLMStream(
  stream: Readable,
  onChunk: (chunk: string) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer | string) => {
      onChunk(chunk.toString());
    });
    stream.on("end", () => resolve());
    stream.on("error", reject);
  });
}

export async function getLLMResponse(
  messages: Message[],
  model: string,
): Promise<string> {
  const stream = await streamLLMResponse({ model, messages });
  let full = "";
  await processLLMStream(stream, (c) => {
    full += c;
  });
  return sanitizeLLMResponse(full);
}
