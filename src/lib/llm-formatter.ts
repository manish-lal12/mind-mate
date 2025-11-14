/**
 * Formats raw LLM responses to be more readable
 * - Cleans up markdown formatting
 * - Adds proper spacing between paragraphs
 * - Handles text lighting and emphasis
 */

export function formatLLMResponse(text: string): string {
  // Step 1: Fix excessive asterisks and markdown formatting
  // Convert *text* to italics (keep single asterisks)
  let formatted = text.replace(/\*{3,}/g, "**"); // Replace 3+ asterisks with 2

  // Step 2: Add spaces after asterisks when missing
  // e.g., "**text**word" becomes "**text** word"
  formatted = formatted.replace(/\*\*([^*]+)\*\*(?!\s|$|[.,!?;:])/g, "**$1** ");

  // Step 3: Fix missing spaces between paragraphs
  // Add newline before numbered lists
  formatted = formatted.replace(/([.!?])\n(\d+\.)/g, "$1\n\n$2");

  // Add newline before bullet points
  formatted = formatted.replace(/([.!?])\n([-•*]\s)/g, "$1\n\n$2");

  // Step 4: Fix missing spaces between sentences and new paragraphs
  // If text ends with period but next line doesn't start with capital, add paragraph break
  formatted = formatted.replace(/([.!?])(\n)([a-z])/g, "$1\n\n$3");

  // Step 5: Normalize multiple consecutive newlines to max 2
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  // Step 6: Remove unnecessary asterisks around common words (like "*patterns*" to "patterns")
  // But keep them for emphasis where needed
  formatted = formatted.replace(
    /\*([a-z]+)\*/g,
    (match: string, word: string) => {
      // Keep asterisks for important terms, remove for common words
      const commonWords = [
        "possible",
        "related",
        "condition",
        "conditions",
        "symptoms",
        "patterns",
      ];
      return commonWords.includes(word) ? word : match;
    },
  );

  // Step 7: Clean up section headers
  // Ensure headers have proper spacing
  formatted = formatted.replace(/^([#]+\s+.+)$/gm, "\n$1\n");

  // Step 8: Trim leading/trailing whitespace
  formatted = formatted.trim();

  return formatted;
}

/**
 * Converts markdown-style formatting to HTML-friendly format for display
 */
export function markdownToDisplay(text: string): string {
  let result = text;

  // Convert bold markdown to strong tags
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Convert italic markdown to em tags
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Convert headers
  result = result.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  result = result.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  result = result.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Convert line breaks to paragraphs
  result = result.replace(/\n\n+/g, "</p><p>");
  result = `<p>${result}</p>`;
  result = result.replace(/<p><\/p>/g, "");

  return result;
}

/**
 * Cleans response text for plain text display (no HTML)
 */
export function cleanLLMText(text: string): string {
  let cleaned = text;

  // Remove excessive markdown
  cleaned = cleaned.replace(/\*{2,}/g, "");

  // Fix spacing issues
  cleaned = cleaned.replace(/([.!?])([A-Z])/g, "$1 $2");

  // Remove extra spaces
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // Normalize newlines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

/**
 * Validates and sanitizes LLM response
 */
export function sanitizeLLMResponse(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  // Remove any potential HTML/script tags for safety
  let sanitized = text.replace(/<script[^>]*>.*?<\/script>/gi, "");
  sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, "");

  // Format for readability
  sanitized = formatLLMResponse(sanitized);

  return sanitized;
}
