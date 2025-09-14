//components/CodeBlock.js
import { useState } from "react";

function CodeBlock({ children, className = "" }) {
  const [copied, setCopied] = useState(false);

  // 🔑 Convert MDX children (React nodes) to plain string
  const extractText = (node) => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node?.props?.children) return extractText(node.props.children);
    return "";
  };

  const copyToClipboard = async () => {
    try {
      const text = extractText(children);
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Extract language (like "js" from "language-js")
  const language = className?.replace("language-", "") || "";

  return (
    <div className="relative group my-4">
         {/* Language label (GitHub-like, top-left) */}
      {language && (
        <span className="top-0 left-2 text-xs font-medium 
                         bg-neutral-200 dark:bg-neutral-700 
                         text-neutral-700 dark:text-neutral-200 
                         px-2 py-0.5 rounded-md">
          {language.toUpperCase()}
        </span>
      )}
      {/* Code wrapper */}
      <pre className={`p-4 rounded-lg overflow-x-auto ${className}`}>
        <code>{children}</code>
      </pre>

      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="absolute top-0 right-2 px-2 py-1 text-xs rounded-md 
                   bg-neutral-200 dark:bg-neutral-700 
                   text-neutral-700 dark:text-neutral-200 
                   opacity-0 group-hover:opacity-100 transition cursor-pointer"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

     
    </div>
  );
}

export default CodeBlock;
