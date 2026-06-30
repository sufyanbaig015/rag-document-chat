import { Router } from "express";

import upload from "../middlewares/upload.middleware.js";
import {
  uploadDocument,
  ingestText,
  chat
} from "../controllers/rag.controller.js";

const router = Router();

router.post("/upload", upload.single("file"), uploadDocument);
router.post("/ingest-text", ingestText);
router.post("/chat", chat);

export default router;
