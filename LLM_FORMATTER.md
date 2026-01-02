# LLM Response Formatter

## Overview

The LLM response formatter (`src/lib/llm-formatter.ts`) cleans and formats raw responses from the Google Gemini API to be more readable and user-friendly.

## Problem Solved

Raw LLM responses often contain:

- Excessive markdown formatting (multiple asterisks: \***\*, \*\***)
- Missing spaces between paragraphs
- Inconsistent formatting for text emphasis
- Poor spacing between sentences and new sections
- Unformatted lists and headers

## Solution

The formatter implements several cleaning steps:

### 1. **Fix Excessive Markdown**

```
Input:  "This is ****important****"
Output: "This is **important**"
```

Replaces 3+ consecutive asterisks with exactly 2.

### 2. **Add Spaces After Formatting**

```
Input:  "**text**word"
Output: "**text** word"
```

Ensures space after markdown formatting before regular text.

### 3. **Fix Paragraph Breaks**

```
Input:  "Sentence.\n1. List item"
Output: "Sentence.\n\n1. List item"
```

Adds proper spacing before lists and bullet points.

### 4. **Normalize Newlines**

- Replaces 3+ consecutive newlines with 2
- Prevents excessive whitespace in output

### 5. **Smart Asterisk Removal**

Removes asterisks from common words that don't need emphasis:

- possible
- related
- condition/conditions
- symptoms
- patterns

### 6. **Clean Section Headers**

Ensures proper spacing around markdown headers (##, ###, etc.)

## Functions

### `formatLLMResponse(text: string): string`

Main formatter that cleans raw LLM text.

```typescript
import { formatLLMResponse } from "~/lib/llm-formatter";

const raw = "This is ****very important****\n1. First point";
const clean = formatLLMResponse(raw);
// Output: "This is **very important**\n\n1. First point"
```

### `markdownToDisplay(text: string): string`

Converts markdown to HTML-friendly format for display.

```typescript
import { markdownToDisplay } from "~/lib/llm-formatter";

const markdown = "This is **bold** and *italic*";
const html = markdownToDisplay(markdown);
// Output: "<p>This is <strong>bold</strong> and <em>italic</em></p>"
```

### `cleanLLMText(text: string): string`

Removes all markdown and returns plain text.

```typescript
import { cleanLLMText } from "~/lib/llm-formatter";

const text = "This is **bold** text";
const plain = cleanLLMText(text);
// Output: "This is bold text"
```

### `sanitizeLLMResponse(text: string): string`

**Main entry point** - handles security and formatting.

- Validates input
- Removes potentially dangerous HTML/script tags
- Applies full formatting
- Safe for display

```typescript
import { sanitizeLLMResponse } from "~/lib/llm-formatter";

const response = await getLLMResponse(messages, model);
const safe = sanitizeLLMResponse(response);
```

## Integration

The formatter is automatically applied in the LLM client:

```typescript
// src/server/llm/client.ts
export async function getLLMResponse(
  messages: Message[],
  model: string,
): Promise<string> {
  const stream = await streamLLMResponse({ model, messages });
  let full = "";
  await processLLMStream(stream, (c) => {
    full += c;
  });
  return sanitizeLLMResponse(full); // ✅ Automatically formatted
}
```

## Examples

### Before Formatting

```
**Core Principles**

1. **Empathize & Normalize**
   - Begin by validating the user's experience and emotions.
   - Use understanding, ****compassionate**** language.

2. **Inform Without Diagnosing**
   - You may mention potential ***conditions*** or symptom clusters
```

### After Formatting

```
**Core Principles**

1. **Empathize & Normalize**
   - Begin by validating the user's experience and emotions.
   - Use understanding, **compassionate** language.

2. **Inform Without Diagnosing**
   - You may mention potential **conditions** or symptom clusters
```

## Benefits

✅ **Better User Experience**

- Cleaner, more professional output
- Proper spacing and formatting

✅ **Consistency**

- All LLM responses follow same formatting
- Predictable output structure

✅ **Security**

- Sanitizes potentially harmful HTML/scripts
- Safe for direct display

✅ **Performance**

- Lightweight regex-based processing
- No external dependencies

✅ **Maintainability**

- Single source of truth for formatting
- Easy to update rules

## Testing

To test the formatter:

```typescript
import { formatLLMResponse, sanitizeLLMResponse } from "~/lib/llm-formatter";

// Test case 1: Multiple asterisks
const test1 = "This is ****important**** data";
console.log(formatLLMResponse(test1));

// Test case 2: Missing paragraph breaks
const test2 = "First sentence.\n1. Item one";
console.log(formatLLMResponse(test2));

// Test case 3: Full sanitization
const test3 = "Response with <script>alert('xss')</script> content";
console.log(sanitizeLLMResponse(test3));
```

## Future Improvements

- [ ] Custom formatting rules per response type
- [ ] Support for code blocks with syntax highlighting
- [ ] Table formatting
- [ ] Link preservation and validation
- [ ] Emoji handling
- [ ] Language-specific formatting rules

---

**Last Updated:** November 14, 2025
