import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { createSpecies } from "../controllers/speciesController";

const router = express.Router();

router.use(authMiddleware);

// router.post("/createnewspecies", processFile, createSpecies)
router.post("/createnewspecies", createSpecies);

export default router;
