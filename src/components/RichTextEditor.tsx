import React, { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  label,
  description,
  error,
  className = "",
}) => {
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    onChange(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle auto-list creation
    if (e.key === " ") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        if (textNode.nodeType === Node.TEXT_NODE) {
          const textContent = textNode.textContent || "";
          const cursorPosition = range.startOffset;

          // Get the text from the beginning of the line to cursor
          const lineStart =
            textContent.lastIndexOf("\n", cursorPosition - 1) + 1;
          const lineText = textContent.substring(lineStart, cursorPosition);

          // Check for bullet point pattern: "- " or "* "
          if (lineText === "-" || lineText === "*") {
            e.preventDefault();

            // Remove the typed character and create bullet list
            const newRange = document.createRange();
            newRange.setStart(textNode, lineStart);
            newRange.setEnd(textNode, cursorPosition);
            newRange.deleteContents();

            // Execute bullet list command
            document.execCommand("insertUnorderedList");
            return;
          }

          // Check for numbered list pattern: "1. " or any number followed by dot
          const numberedListMatch = lineText.match(/^(\d+)\.$/);
          if (numberedListMatch) {
            e.preventDefault();

            // Remove the typed character and create numbered list
            const newRange = document.createRange();
            newRange.setStart(textNode, lineStart);
            newRange.setEnd(textNode, cursorPosition);
            newRange.deleteContents();

            // Execute numbered list command
            document.execCommand("insertOrderedList");
            return;
          }

          // Check for alphabetical list pattern: "a. " or "A. "
          const alphaListMatch = lineText.match(/^([a-zA-Z])\.$/);
          if (alphaListMatch) {
            e.preventDefault();

            // Remove the typed character and create numbered list (we'll style it as alphabetical)
            const newRange = document.createRange();
            newRange.setStart(textNode, lineStart);
            newRange.setEnd(textNode, cursorPosition);
            newRange.deleteContents();

            // Execute numbered list command and then modify the style
            document.execCommand("insertOrderedList");

            // Find the created list and modify its style to be alphabetical
            setTimeout(() => {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const currentElement =
                  selection.getRangeAt(0).commonAncestorContainer;
                let listElement: Node | null = currentElement;

                // Find the parent ol element
                while (
                  listElement &&
                  (listElement.nodeType !== Node.ELEMENT_NODE ||
                    (listElement as Element).tagName !== "OL")
                ) {
                  listElement = listElement.parentNode;
                  if (!listElement) break;
                }

                if (listElement && (listElement as Element).tagName === "OL") {
                  const isUppercase =
                    alphaListMatch[1] === alphaListMatch[1].toUpperCase();
                  (listElement as HTMLElement).style.listStyleType = isUppercase
                    ? "upper-alpha"
                    : "lower-alpha";
                }
              }
            }, 0);
            return;
          }
        }
      }
    }

    // Handle Enter key in lists to continue or exit list
    if (e.key === "Enter") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const currentElement = range.commonAncestorContainer;

        // Check if we're in a list item
        let listItem: Node | null = currentElement;
        while (
          listItem &&
          (listItem.nodeType !== Node.ELEMENT_NODE ||
            (listItem as Element).tagName !== "LI")
        ) {
          listItem = listItem.parentNode;
          if (!listItem) break;
        }

        if (listItem && (listItem as Element).tagName === "LI") {
          const liElement = listItem as HTMLLIElement;

          // If the list item is empty, exit the list
          if (liElement.textContent?.trim() === "") {
            e.preventDefault();
            document.execCommand("outdent");
            return;
          }
        }
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    onChange(content);
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      e.currentTarget.textContent === placeholder ||
      e.currentTarget.innerHTML === placeholder
    ) {
      e.currentTarget.innerHTML = "";
    }
  };

  const executeCommand = (command: string) => {
    document.execCommand(command);
  };

  const editorRef = useRef<HTMLDivElement>(null);

  // Only update contentEditable content if value changes externally
  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== value &&
      document.activeElement !== editorRef.current
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className="border rounded-md relative">
        {/* Toolbar */}
        <div className="border-b p-2 flex flex-wrap gap-2 bg-gray-50 rounded-t-md">
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Bold"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Italic"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="4" x2="10" y2="4" />
              <line x1="14" y1="20" x2="5" y2="20" />
              <line x1="15" y1="4" x2="9" y2="20" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Underline"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 4v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4" />
              <line x1="4" y1="20" x2="20" y2="20" />
            </svg>
          </button>
          <div className="w-px bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Bullet List"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Numbered List"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="10" y1="6" x2="21" y2="6" />
              <line x1="10" y1="12" x2="21" y2="12" />
              <line x1="10" y1="18" x2="21" y2="18" />
              <path d="M4 6h1v4" />
              <path d="M4 10h2" />
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1.5S2 14 2 15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              executeCommand("insertOrderedList");
              // Set alphabetical style after creation
              setTimeout(() => {
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const currentElement =
                    selection.getRangeAt(0).commonAncestorContainer;
                  let listElement: Node | null = currentElement;

                  while (
                    listElement &&
                    (listElement.nodeType !== Node.ELEMENT_NODE ||
                      (listElement as Element).tagName !== "OL")
                  ) {
                    listElement = listElement.parentNode;
                    if (!listElement) break;
                  }

                  if (
                    listElement &&
                    (listElement as Element).tagName === "OL"
                  ) {
                    (listElement as HTMLElement).style.listStyleType =
                      "lower-alpha";
                  }
                }
              }, 0);
            }}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Alphabetical List (a, b, c)"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="10" y1="6" x2="21" y2="6" />
              <line x1="10" y1="12" x2="21" y2="12" />
              <line x1="10" y1="18" x2="21" y2="18" />
              <text x="4" y="9" fontSize="8" fill="currentColor">
                a
              </text>
              <text x="4" y="15" fontSize="8" fill="currentColor">
                b
              </text>
              <text x="4" y="21" fontSize="8" fill="currentColor">
                c
              </text>
            </svg>
          </button>
          <div className="w-px bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => executeCommand("justifyLeft")}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Align Left"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="17" y1="10" x2="3" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="17" y1="18" x2="3" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyCenter")}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Align Center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="10" x2="6" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="18" y1="18" x2="6" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyRight")}
            className="p-2 rounded hover:bg-gray-200 border"
            title="Align Right"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="21" y1="10" x2="7" y2="10" />
              <line x1="21" y1="6" x2="3" y2="6" />
              <line x1="21" y1="14" x2="3" y2="14" />
              <line x1="21" y1="18" x2="7" y2="18" />
            </svg>
          </button>
        </div>

        {/* Rich Text Editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          className="min-h-[120px] p-3 focus:outline-none rich-text-editor"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            direction: "ltr",
            textAlign: "left",
          }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        <style>{`
          .rich-text-editor ul,
          .rich-text-editor ol {
            margin: 1em 0;
            padding-left: 2em;
          }
          .rich-text-editor li {
            margin: 0.25em 0;
            padding-left: 0.25em;
          }
          .rich-text-editor ul {
            list-style-type: disc;
          }
          .rich-text-editor ol {
            list-style-type: decimal;
          }
          .rich-text-editor ol[style*="lower-alpha"] {
            list-style-type: lower-alpha !important;
          }
          .rich-text-editor ol[style*="upper-alpha"] {
            list-style-type: upper-alpha !important;
          }
        `}</style>
        {(!value || value === placeholder) && (
          <div
            className="absolute top-[65px] left-3 text-gray-400 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {placeholder}
          </div>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <p className="text-xs text-gray-500">
        <strong>Quick formatting:</strong> Type "- " for bullets, "1. " for
        numbers, "a. " for lowercase letters, or "A. " for uppercase letters
      </p>
      {error && <div className="text-sm text-red-500 font-normal">{error}</div>}
    </div>
  );
};

export default RichTextEditor;
