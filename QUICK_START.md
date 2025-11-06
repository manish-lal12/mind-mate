# Quick Start: LLM Integration Setup

## 🚀 Get Started in 5 Minutes

### Step 1: Set Environment Variables (1 min)

Add to `.env.local`:

```env
# Choose your LLM provider
LLM_PROVIDER="openai"                                    # or: anthropic, openai-compatible
LLM_API_ENDPOINT="https://api.openai.com/v1/chat/completions"
LLM_API_KEY="sk-..."                                     # Get from provider dashboard
LLM_MODEL="gpt-4-turbo"                                  # Optional, has default
```

#### LLM Provider Setup

**OpenAI**:

1. Go to https://platform.openai.com/api-keys
2. Create API key
3. Add to `.env.local`

**Google Gemini** (Free tier available!):

```env
LLM_PROVIDER="google-gemini"
LLM_API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent"
LLM_API_KEY="your-api-key"
LLM_MODEL="gemini-2.0-flash"
```

1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create new API key for free
4. Add to `.env.local`

**Anthropic (Claude)**:

```env
LLM_PROVIDER="anthropic"
LLM_API_ENDPOINT="https://api.anthropic.com/v1/messages"
LLM_API_KEY="sk-ant-..."
LLM_MODEL="claude-3-sonnet-20240229"
```

**Local (Ollama)**:

```env
LLM_PROVIDER="openai-compatible"
LLM_API_ENDPOINT="http://localhost:11434/v1/chat/completions"
LLM_API_KEY="ollama"
LLM_MODEL="llama2"
```

### Step 2: Database Migration (1 min)

```bash
npm run prisma migrate dev
```

This creates Chat and Message tables.

### Step 3: Test the API (1 min)

```bash
npm run dev
```

Open another terminal and test:

```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "test-123",
    "message": "I am feeling anxious about work"
  }'
```

Expected response:

```json
{
  "response": "I understand work anxiety is common..."
}
```

### Step 4: Integrate Frontend (2 min)

Create `src/app/c/[chatId]/use-chat-stream.ts`:

```typescript
"use client";
import { useCallback, useState } from "react";

export function useChatStream(chatId: string) {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, message }),
        });
        const data = await res.json();
        return data.response;
      } finally {
        setIsLoading(false);
      }
    },
    [chatId],
  );

  return { sendMessage, isLoading };
}
```

Use in your chat component:

```typescript
const { sendMessage, isLoading } = useChatStream(chatId);

async function handleSend() {
  const response = await sendMessage(userMessage);
  // Add response to chat UI
}
```

## ✅ Verification Checklist

- [ ] Environment variables set in `.env.local`
- [ ] Database migration completed
- [ ] Can start dev server: `npm run dev`
- [ ] API endpoint responds to POST requests
- [ ] LLM response is not an error message
- [ ] Messages appear in database
- [ ] Frontend can call API and display response

## 🐛 Troubleshooting

**API returns "LLM_API_KEY not configured"**

- Check `.env.local` has all 3 variables
- Restart dev server after saving env file

**API returns 401 Unauthorized**

- Must be signed in before making API calls
- Sign in via Google on login page

**API returns 404 Chat not found**

- chatId must be a valid chat UUID
- Create a chat first from the chat page

**Slow or no response**

- Check LLM_API_KEY is valid
- Check internet connection to LLM provider
- Check LLM provider status/dashboard

## 📚 Full Documentation

- `LLM_INTEGRATION.md` - Complete reference (400+ lines)
- `CHAT_INTEGRATION_GUIDE.md` - Frontend patterns (350+ lines)
- `LLM_IMPLEMENTATION_SUMMARY.md` - Implementation details (300+ lines)

## 💡 Pro Tips

1. **Test Locally First**: Use Ollama to test without API costs
2. **Rate Limit**: Add debouncing to send button to avoid spam
3. **Stream UI**: Implement real-time chunk display for better UX
4. **Error Boundary**: Wrap chat component in error boundary
5. **Monitor Costs**: Track LLM API usage and costs

## 🎯 Common Tasks

### Change LLM Model

Edit `.env.local`:

```env
LLM_MODEL="gpt-3.5-turbo"  # Faster, cheaper
```

### Use Different Provider

Edit `.env.local`:

```env
LLM_PROVIDER="anthropic"
LLM_API_ENDPOINT="https://api.anthropic.com/v1/messages"
LLM_API_KEY="sk-ant-..."
LLM_MODEL="claude-3-sonnet-20240229"
```

### Customize System Prompt

Edit `src/server/llm/system-prompt.md` to change AI behavior.

### Add Retry Logic

```typescript
async function sendWithRetry(message: string) {
  for (let i = 0; i < 3; i++) {
    try {
      return await sendMessage(message);
    } catch (err) {
      if (i === 2) throw err;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
```

## 📊 What Happens Behind the Scenes

1. User sends message in chat UI
2. Frontend calls `POST /api/chat/stream`
3. Server authenticates user
4. Server saves user message to database
5. Server retrieves conversation history
6. Server sends to LLM with system prompt
7. LLM returns response
8. Server saves assistant message to database
9. Response sent back to frontend
10. Frontend displays in chat UI

## 📊 Provider Comparison

| Provider          | Cost/1000    | Speed      | Best For                                     | Free Tier        |
| ----------------- | ------------ | ---------- | -------------------------------------------- | ---------------- |
| **Google Gemini** | **$0.75** ⭐ | ⭐⭐⭐⭐⭐ | Budget-conscious, fast mental health support | ✅ Yes           |
| Claude 3.5 Sonnet | $3           | ⭐⭐⭐⭐   | Safety-focused, nuanced responses            | ✅ Yes (limited) |
| GPT-4 Turbo       | $15          | ⭐⭐⭐⭐⭐ | Maximum capability, research-grade           | ❌ Paid          |
| Ollama (Local)    | $0           | ⭐⭐⭐     | Privacy-focused, zero API costs              | ✅ Yes (local)   |
| OpenAI GPT-4o     | $10          | ⭐⭐⭐⭐⭐ | Balanced quality/cost                        | ❌ Paid          |

**Recommendation**: Start with **Google Gemini** (free tier + $0.75 per 1000 requests) and upgrade to Claude Sonnet only if you need more nuanced safety features.

### Provider Switching (Zero Code Changes)

Switch providers by editing `.env.local`:

```env
# Option 1: Google Gemini (Recommended - Free tier available)
LLM_PROVIDER="google-gemini"
LLM_MODEL="gemini-2.0-flash"
LLM_API_ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent"

# Option 2: Anthropic Claude
LLM_PROVIDER="anthropic"
LLM_MODEL="claude-3-5-sonnet-20241022"
LLM_API_ENDPOINT="https://api.anthropic.com/v1/messages"

# Option 3: OpenAI GPT-4
LLM_PROVIDER="openai"
LLM_MODEL="gpt-4-turbo"
LLM_API_ENDPOINT="https://api.openai.com/v1/chat/completions"

# Option 4: Ollama (Local, Free)
LLM_PROVIDER="openai-compatible"
LLM_MODEL="llama2"
LLM_API_ENDPOINT="http://localhost:11434/v1/chat/completions"
```

Then restart: `npm run dev` — **That's it!** No code changes needed.

## 🎓 Next Steps

1. ✅ Get it working locally
2. Test different LLM models
3. Customize system prompt for your use case
4. Implement streaming UI for better UX
5. Add monitoring and cost tracking
6. Deploy to production

## 🔗 Resources

- **Vendor-Agnostic Architecture**: See `VENDOR_AGNOSTIC_LLM.md` for deep dive on provider adapters and extensibility
- **OpenAI**: https://platform.openai.com/docs
- **Google Gemini**: https://ai.google.dev
- **Anthropic**: https://docs.anthropic.com
- **Ollama**: https://ollama.ai
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs

---

**Status**: Ready to use
**Time to Setup**: ~5 minutes
**Support**: See full documentation files
