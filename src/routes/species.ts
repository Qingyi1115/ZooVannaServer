import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createSpecies,
  getAllSpecies,
  getSpeciesByCode,
  deleteSpeciesByCode,
  updateSpecies,
  updateSpeciesEduDesc,
} from "../controllers/speciesController";

const router = express.Router();

router.use(authMiddleware);

router.get("/getallspecies", getAllSpecies);
router.get("/getspecies/:speciesCode", getSpeciesByCode);
router.post("/createnewspecies", createSpecies);
router.put("/updatespecies", updateSpecies);
router.put("/updatespeciesedu", updateSpeciesEduDesc);
router.delete("/deletespecies/:speciesCode", deleteSpeciesByCode);

export default router;
