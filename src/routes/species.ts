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
router.get("/getallspecies", getAllSpecies);
router.get("/getspecies/:speciesCode", getSpeciesByCode);
router.post("/createnewspecies", createSpecies);
router.put("/updatespecies", updateSpecies);
router.delete("/deletespecies/:speciesCode", deleteSpeciesByCode);

//species edu content
router.put("/updatespeciesedu", updateSpeciesEduDesc);

//species enclosure requirements
router.get(
  "/getenclosureneeds/:speciesCode",
  getSpeciesEnclosureNeedsBySpeciesCode,
);
router.post("/createenclosureneeds", createSpeciesEnclosureNeeds);
router.put("/updateenclosureneeds", updateSpeciesEnclosureNeeds);
router.delete(
  "/deleteenclosureneeds/:speciesEnclosureNeedId",
  deleteSpeciesEnclosureNeeds,
);

export default router;
