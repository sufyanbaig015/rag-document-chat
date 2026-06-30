import { useRef, useEffect } from "react";

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  loading,
  disabled
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  }

  return (
    <form className="chat-input" onSubmit={onSubmit}>
      <div className="chat-input__box">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Message RAG Assistant..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || disabled}
        />
        <button
          type="submit"
          className="chat-input__send"
          disabled={loading || disabled || !value.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
      <p className="chat-input__hint">
        RAG answers from your uploaded documents only.
      </p>
    </form>
  );
}
