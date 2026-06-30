# RAG App — Client

React + Vite frontend for the RAG App. It provides the chat UI for uploading documents and asking questions about them.

See the [main project README](../README.md) for full setup, architecture, and API details.

## Quick start

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if your API isn't on http://localhost:5051
npm run dev            # start dev server (http://localhost:5173)
```

## Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the Vite dev server         |
| `npm run build`   | Build for production into `dist/` |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Run Oxlint                        |
