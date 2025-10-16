import React from "react";

interface RichTextDisplayProps {
  content: string | null | undefined;
  className?: string;
  fallbackText?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  content,
  className = "",
  fallbackText = "No content available",
}) => {
  if (!content) {
    return <span className={`text-gray-500 ${className}`}>{fallbackText}</span>;
  }

  // Check if content contains HTML tags
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <>
        <style>{`
          .rich-text-display ul,
          .rich-text-display ol {
            margin: 1em 0;
            padding-left: 2em;
          }
          .rich-text-display li {
            margin: 0.25em 0;
            padding-left: 0.25em;
          }
          .rich-text-display ul {
            list-style-type: disc;
          }
          .rich-text-display ol {
            list-style-type: decimal;
          }
          .rich-text-display ol[style*="lower-alpha"] {
            list-style-type: lower-alpha !important;
          }
          .rich-text-display ol[style*="upper-alpha"] {
            list-style-type: upper-alpha !important;
          }
          .rich-text-display strong {
            font-weight: 600;
          }
          .rich-text-display em {
            font-style: italic;
          }
          .rich-text-display u {
            text-decoration: underline;
          }
        `}</style>
        <div
          className={`rich-text-display prose prose-sm max-w-none ${className}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </>
    );
  } else {
    // Render as plain text with line breaks preserved
    return <div className={`whitespace-pre-line ${className}`}>{content}</div>;
  }
};

export default RichTextDisplay;
