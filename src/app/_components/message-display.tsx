import ReactMarkdown from "react-markdown";

interface MessageDisplayProps {
  content: string;
  role: "user" | "assistant";
}

export function MessageDisplay({ content, role }: MessageDisplayProps) {
  if (role === "user") {
    // User messages are plain text
    return (
      <div
        className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div className="max-w-md rounded-lg bg-blue-600 px-4 py-3 text-white">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  // Assistant messages use markdown rendering
  return (
    <div className="flex justify-start">
      <div className="max-w-2xl rounded-lg bg-slate-200/50 px-4 py-3 text-slate-900">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
