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
        <ReactMarkdown
          components={{
            p: (props) => (
              <p className="mb-3 text-sm leading-relaxed" {...props} />
            ),
            strong: (props) => (
              <strong className="font-semibold text-slate-900" {...props} />
            ),
            em: (props) => <em className="text-slate-800 italic" {...props} />,
            ul: (props) => (
              <ul
                className="mb-3 ml-4 space-y-1 text-sm"
                style={{ listStyleType: "disc" }}
                {...props}
              />
            ),
            ol: (props) => (
              <ol
                className="mb-3 ml-4 space-y-1 text-sm"
                style={{ listStyleType: "decimal" }}
                {...props}
              />
            ),
            li: (props) => <li className="text-sm" {...props} />,
            h1: (props) => (
              <h1
                className="mb-2 text-lg font-bold text-slate-900"
                {...props}
              />
            ),
            h2: (props) => (
              <h2
                className="mb-2 text-base font-bold text-slate-900"
                {...props}
              />
            ),
            h3: (props) => (
              <h3
                className="mb-2 text-sm font-semibold text-slate-900"
                {...props}
              />
            ),
            blockquote: (props) => (
              <blockquote
                className="border-l-4 border-blue-300 bg-blue-50/50 px-4 py-2 text-slate-700 italic"
                {...props}
              />
            ),
            code: (props) => (
              <code
                className="rounded bg-slate-300/30 px-1.5 py-0.5 font-mono text-xs text-slate-800"
                {...props}
              />
            ),
            pre: (props) => (
              <pre
                className="mb-3 overflow-x-auto rounded-lg bg-slate-800 p-3"
                {...props}
              />
            ),
            a: (props) => (
              <a
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
