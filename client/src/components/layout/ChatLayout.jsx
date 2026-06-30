import Sidebar from "./Sidebar.jsx";
import MessageList from "../chat/MessageList.jsx";
import ChatInput from "../chat/ChatInput.jsx";

export default function ChatLayout({
  sidebarOpen,
  onToggleSidebar,
  onCloseSidebar,
  sidebarProps,
  messages,
  loadingChat,
  question,
  onQuestionChange,
  onSubmit,
  onSuggestionClick,
  error
}) {
  return (
    <div className="chat-layout">
      <Sidebar {...sidebarProps} sidebarOpen={sidebarOpen} onCloseSidebar={onCloseSidebar} />

      <div className="chat-main">
        <header className="chat-header">
          <button
            type="button"
            className="chat-header__menu"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="chat-header__title">
            <span className="chat-header__logo">✦</span>
            <h1>RAG Chat</h1>
          </div>
        </header>

        {error && <div className="chat-error">{error}</div>}

        <MessageList
          messages={messages}
          loading={loadingChat}
          onSuggestionClick={onSuggestionClick}
        />

        <ChatInput
          value={question}
          onChange={onQuestionChange}
          onSubmit={onSubmit}
          loading={loadingChat}
        />
      </div>
    </div>
  );
}
