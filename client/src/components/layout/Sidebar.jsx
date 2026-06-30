export default function Sidebar({
  selectedFileName,
  onFileSelect,
  onUpload,
  loadingUpload,
  uploadMessage,
  indexedDocs,
  onNewChat,
  sidebarOpen,
  onCloseSidebar
}) {
  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? "sidebar-overlay--open" : ""}`}
        onClick={onCloseSidebar}
      />

      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__header">
          <button type="button" className="sidebar__new-chat" onClick={onNewChat}>
            + New chat
          </button>
        </div>

        <div className="sidebar__section">
          <h3>Upload document</h3>
          <p className="sidebar__desc">PDF, TXT, MD, CSV, JSON</p>

          <label className="sidebar__upload-btn">
            <input
              type="file"
              accept=".txt,.md,.csv,.json,.pdf"
              onChange={(e) => onFileSelect(e.target.files[0] || null)}
              hidden
            />
            {selectedFileName || "Choose file"}
          </label>

          <button
            type="button"
            className="sidebar__index-btn"
            onClick={onUpload}
            disabled={loadingUpload}
          >
            {loadingUpload ? "Indexing..." : "Index document"}
          </button>

          {uploadMessage && (
            <p className="sidebar__success">{uploadMessage}</p>
          )}
        </div>

        {indexedDocs.length > 0 && (
          <div className="sidebar__section sidebar__docs">
            <h3>Indexed files</h3>
            <ul>
              {indexedDocs.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="sidebar__footer">
          <span>RAG Assistant</span>
          <small>Powered by FAISS + OpenAI</small>
        </div>
      </aside>
    </>
  );
}
