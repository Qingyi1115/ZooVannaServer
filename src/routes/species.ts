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
  createPhysiologicalReferenceNorms,
  getPhysiologicalReferenceNormsById,
  getAllPhysiologicalReferenceNormsbySpeciesCode,
  updatePhysiologicalReferenceNorms,
  deletePhysiologicalReferenceNorms,
  getAllDietNeedbySpeciesCode,
  createDietNeed,
  getDietNeedById,
  updateDietNeed,
  deleteDietNeed,
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

//species Physiological Reference Norms
router.get(
  "/getAllPhysiologicalReferenceNormsByCode/:speciesCode",
  getAllPhysiologicalReferenceNormsbySpeciesCode,
);

router.get(
  "/getPhysiologicalReferenceNormsById/:physiologicalRefId",
  getPhysiologicalReferenceNormsById,
);

router.post(
  "/createPhysiologicalReferenceNorms",
  createPhysiologicalReferenceNorms,
);

router.put(
  "/updatePhysiologicalReferenceNorms",
  updatePhysiologicalReferenceNorms,
);

router.delete(
  "/deletePhysiologicalReferenceNorms/:physiologicalRefId",
  deletePhysiologicalReferenceNorms,
);

//species diet need
router.get(
  "/getAllDietNeedbySpeciesCode/:speciesCode",
  getAllDietNeedbySpeciesCode,
);
router.get("/getDietNeedById/:speciesDietNeedId", getDietNeedById);
router.post("/createDietNeed", createDietNeed);
router.put("/updateDietNeed", updateDietNeed);
router.delete("/deleteDietNeed/:speciesDietNeedId", deleteDietNeed);

export default router;
