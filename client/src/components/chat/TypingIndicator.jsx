export default function TypingIndicator() {
  return (
    <article className="chat-message chat-message--assistant">
      <div className="chat-message__avatar" aria-hidden="true">
        AI
      </div>
      <div className="chat-message__body">
        <div className="typing-indicator">
          <span />
          <span />
          <span />
        </div>
      </div>
    </article>
  );
}
