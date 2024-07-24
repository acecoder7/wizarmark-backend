import express from "express";
import { summarize, ensureSummarizerInitialized } from "../controllers/ai.js";

const router = express.Router();

router.post("/summarize", ensureSummarizerInitialized, summarize);

export { router as aiRoute };
