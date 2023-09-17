import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { createSpecies, getAllSpecies } from "../controllers/speciesController";

const router = express.Router();

router.use(authMiddleware);

router.get("/getallspecies", getAllSpecies);

router.post("/createnewspecies", createSpecies);

export default router;
