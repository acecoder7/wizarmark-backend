import express from "express";
import { summarize } from "../controllers/ai.js";

const router = express.Router();

router.post("/summarize", summarize);

export { router as aiRoute };
