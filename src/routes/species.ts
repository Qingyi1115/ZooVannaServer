import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createSpecies,
  getAllSpecies,
  getSpeciesByCode,
  deleteSpeciesByCode,
  updateSpecies,
  updateSpeciesEduDesc,
  getSpeciesEnclosureNeedsBySpeciesCode,
  createSpeciesEnclosureNeeds,
  updateSpeciesEnclosureNeeds,
  deleteSpeciesEnclosureNeeds,
} from "../controllers/speciesController";

const router = express.Router();

router.use(authMiddleware);

//species basic
router.get("/getAllSpecies", getAllSpecies);
router.get("/getSpecies/:speciesCode", getSpeciesByCode);
router.post("/createNewSpecies", createSpecies);
router.put("/updateSpecies", updateSpecies);
router.delete("/deleteSpecies/:speciesCode", deleteSpeciesByCode);

//species edu content
router.put("/updateSpeciesEdu", updateSpeciesEduDesc);

//species enclosure requirements
router.get(
  "/getEnclosureNeeds/:speciesCode",
  getSpeciesEnclosureNeedsBySpeciesCode,
);
router.post("/createEnclosureNeeds", createSpeciesEnclosureNeeds);
router.put("/updateEnclosureNeeds", updateSpeciesEnclosureNeeds);
router.delete(
  "/deleteEnclosureNeeds/:speciesEnclosureNeedId",
  deleteSpeciesEnclosureNeeds,
);

export default router;
