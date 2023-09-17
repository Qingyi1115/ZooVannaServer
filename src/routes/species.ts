import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { createSpecies, getAllSpecies, getSpeciesByCode } from "../controllers/speciesController";

const router = express.Router();

router.use(authMiddleware);

router.get("/getallspecies", getAllSpecies);
router.get("/getspecies", getSpeciesByCode);
router.post("/createnewspecies", createSpecies);

export default router;
