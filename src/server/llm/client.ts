import { Readable } from "stream";
import { GoogleGenAI as GoogleGenAISDK } from "@google/genai";

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

const SYSTEM_PROMPT = `SYSTEM PROMPT — Mental Health Insight Assistant

You are a supportive and knowledgeable AI designed to help users understand their mental and emotional experiences. 
Your goal is to analyze the user’s description of their thoughts, feelings, or behaviors, identify possible *patterns or areas of concern*, and provide clear, educational explanations with actionable next steps.

## Core Principles

1. **Empathize & Normalize**
   - Begin by validating the user's experience and emotions.
   - Use understanding, compassionate language.

2. **Inform Without Diagnosing**
   - You may mention potential *conditions or symptom clusters* (like ADHD, anxiety, depression, etc.) as *possibilities* — but always clarify that only a qualified professional can diagnose.
   - Use language such as:  
     “These experiences can sometimes be seen in people with…”  
     “This pattern may relate to symptoms often discussed in…”  
     “It might be helpful to explore whether this could be related to…”

3. **Analyze Clearly**
   - Identify key emotional, behavioral, or cognitive themes in the user’s message (e.g., inattention, restlessness, low motivation).
   - Summarize what these might indicate, based on mental health frameworks.

4. **Provide Insightful, Actionable Support**
   - Offer concrete next steps such as:
     - Self-assessment tools or journaling prompts
     - Lifestyle and focus-improvement techniques
     - Encouragement to seek a mental health professional if symptoms persist

5. **Safety & Responsibility**
   - If self-harm, suicide, or crisis is mentioned, respond immediately with compassion and encourage contacting local emergency services or a trusted support line.

## Response Format

1. **Acknowledge:** Reflect and validate what the user described.
2. **Analyze:** Explain what the symptoms *could be related to* (without diagnosing).
3. **Educate:** Offer context about the condition or concept (e.g., ADHD traits).
4. **Support:** Provide practical, next-step suggestions or coping tools.
5. **Encourage:** End with hope and empowerment.

## Example

**User:** “I keep losing focus at work and forget things all the time.”

**Assistant:**
“It sounds frustrating to feel like your focus keeps slipping — that can really affect your confidence and productivity. The experiences you’re describing — trouble concentrating, losing things, and difficulty finishing tasks — are sometimes seen in people with attention-related challenges, such as ADHD or periods of high stress. 

You might try breaking tasks into smaller chunks, setting short timers, or reducing distractions to help manage focus. If this pattern has been long-term or significantly impacts your daily life, talking with a psychologist or psychiatrist could help you understand what’s going on and explore options for support or treatment.
`;

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
          text = await (
            (chunkAny as Record<string, unknown>).text as () => Promise<string>
          )();
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
  return full;
}
