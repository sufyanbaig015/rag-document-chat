# RAG App — Document Q&A with Retrieval-Augmented Generation

A full-stack **Retrieval-Augmented Generation (RAG)** application. Upload your documents (PDF, TXT, MD, CSV, JSON), and ask questions about them in a chat interface. The app embeds your documents into a local **FAISS** vector store and uses **OpenAI** models to answer questions grounded strictly in your uploaded content.

> Built with a Node.js/Express API and a React (Vite) client, powered by LangChain.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [License](#license)

---

## Features

- **Document upload** — supports `.pdf`, `.txt`, `.md`, `.csv`, and `.json` (up to 10 MB).
- **Raw text ingestion** — paste text directly without uploading a file.
- **Semantic search** — documents are chunked, embedded, and stored in a FAISS index.
- **Grounded answers** — the assistant answers only from your documents and cites the source chunks it used.
- **Multilingual** — replies in the same language as your question.
- **Persistent index** — the FAISS vector store is saved to disk and reused across restarts.
- **Modern chat UI** — clean React interface with a welcome screen, message list, and typing indicator.

## Architecture

```
┌──────────────┐        HTTP/JSON        ┌──────────────┐
│   React      │  ───────────────────▶   │   Express    │
│   (Vite)     │                          │     API      │
│   client     │  ◀───────────────────   │              │
└──────────────┘                          └──────┬───────┘
                                                 │
                          ┌──────────────────────┼──────────────────────┐
                          ▼                       ▼                       ▼
                   ┌────────────┐         ┌──────────────┐        ┌──────────────┐
                   │  pdf-parse │         │   LangChain  │        │    OpenAI    │
                   │ file parse │         │ text splitter│        │  embeddings  │
                   └────────────┘         └──────┬───────┘        │  + chat LLM  │
                                                 ▼                 └──────────────┘
                                          ┌──────────────┐
                                          │ FAISS vector │
                                          │  store (disk)│
                                          └──────────────┘
```

## Tech Stack

**Backend**
- Node.js + [Express 5](https://expressjs.com/)
- [LangChain](https://js.langchain.com/) (`@langchain/openai`, `@langchain/community`, `@langchain/textsplitters`)
- [faiss-node](https://github.com/ewfian/faiss-node) — local vector store
- [multer](https://github.com/expressjs/multer) — file uploads
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) — PDF text extraction
- OpenAI embeddings (`text-embedding-3-small`) + chat model (`gpt-5` by default)

**Frontend**
- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [axios](https://axios-http.com/)
- [Oxlint](https://oxc.rs/)

## Project Structure

```
RAG APP/
├── api/                        # Express backend
│   ├── src/
│   │   ├── config/env.js       # Environment config loader
│   │   ├── controllers/        # Request handlers (upload, ingest, chat)
│   │   ├── middlewares/        # Multer upload middleware
│   │   ├── routes/             # API routes
│   │   ├── services/           # RAG logic (chunk, embed, search, answer)
│   │   ├── utils/              # File parsing
│   │   └── server.js           # App entry point
│   ├── storage/                # FAISS index (generated, git-ignored)
│   ├── uploads/                # Temp upload dir (git-ignored)
│   └── package.json
│
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/                # axios client + API calls
│   │   ├── components/         # Chat + layout components
│   │   ├── pages/              # HomePage
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- An **OpenAI API key** with access to embeddings and your chosen chat model

## Getting Started

Clone the repository and install dependencies for both apps.

```bash
git clone <your-repo-url>
cd "RAG APP"

# Backend
cd api
npm install

# Frontend
cd ../client
npm install
```

## Environment Variables

Copy the example files and fill in your own values. **Never commit your real `.env` files.**

**`api/.env`** (copy from `api/.env.example`)

| Variable            | Description                                   | Default                  |
| ------------------- | --------------------------------------------- | ------------------------ |
| `PORT`              | Port the API listens on                       | `5051`                   |
| `FRONTEND_URL`      | Allowed CORS origin                           | `http://localhost:5173`  |
| `OPENAI_API_KEY`    | Your OpenAI API key                           | _(required)_             |
| `OPENAI_CHAT_MODEL` | Chat model to use                             | `gpt-5`                  |
| `FAISS_INDEX_PATH`  | Where the FAISS index is stored               | `./storage/faiss_index`  |

**`client/.env`** (copy from `client/.env.example`)

| Variable             | Description           | Default                  |
| -------------------- | --------------------- | ------------------------ |
| `VITE_API_BASE_URL`  | Base URL of the API   | `http://localhost:5051`  |

```bash
cp api/.env.example api/.env
cp client/.env.example client/.env
```

## Running the App

Run the backend and frontend in two separate terminals.

**Terminal 1 — API**

```bash
cd api
npm run dev      # nodemon, auto-reload
# or: npm start  # production-style start
```

The API runs at `http://localhost:5051`.

**Terminal 2 — Client**

```bash
cd client
npm run dev
```

The client runs at `http://localhost:5173` (Vite default).

To build the client for production:

```bash
cd client
npm run build
npm run preview
```

## API Reference

Base URL: `http://localhost:5051`

### `GET /api/health`
Health check.
```json
{ "status": "ok", "message": "Backend server is healthy" }
```

### `POST /api/upload`
Upload a document for ingestion. `multipart/form-data` with a `file` field.
Supported: `.pdf`, `.txt`, `.md`, `.csv`, `.json` (max 10 MB).

**Response**
```json
{ "source": "guide.pdf", "chunks": 42, "message": "Document indexed successfully" }
```

### `POST /api/ingest-text`
Ingest raw text without a file.

**Body**
```json
{ "text": "Your content here...", "source": "manual-text" }
```

### `POST /api/chat`
Ask a question against the indexed documents.

**Body**
```json
{ "question": "What is the refund policy?" }
```

**Response**
```json
{
  "answer": "...",
  "sources": [
    { "source": "guide.pdf", "score": 0.21, "preview": "First 300 chars of the chunk..." }
  ]
}
```

## How It Works

1. **Extract** — uploaded files are parsed to plain text (`pdf-parse` for PDFs, direct read for text formats).
2. **Chunk** — text is split with `RecursiveCharacterTextSplitter` (chunk size 900, overlap 150).
3. **Embed** — chunks are embedded with OpenAI `text-embedding-3-small`.
4. **Store** — embeddings are saved to a local FAISS index on disk and reused on later runs.
5. **Retrieve** — at query time, the top 4 most similar chunks are fetched.
6. **Answer** — the chunks are passed as context to the chat model, which answers strictly from that context (or says it couldn't find the answer).

## Troubleshooting

- **`No FAISS index found. Please upload a document first.`** — Ingest at least one document via `/api/upload` or `/api/ingest-text` before chatting.
- **`Port 5051 is already in use`** — Stop the other process or change `PORT` in `api/.env`.
- **CORS errors** — Make sure `FRONTEND_URL` in `api/.env` matches the client URL.
- **`Only .txt, .md, .csv, .json, and .pdf files are supported`** — Convert the file to a supported format.
- **401 / auth errors from OpenAI** — Verify `OPENAI_API_KEY` is set and valid.

## Security Notes

- The `.gitignore` excludes `.env` files, `node_modules`, build output, uploads, and the FAISS store.
- **Never** commit real API keys. If a key was ever committed, **rotate it immediately**.
- `api/storage/` (vector data derived from your documents) and `api/uploads/` are git-ignored by default.

## License

ISC. See package metadata for details.
