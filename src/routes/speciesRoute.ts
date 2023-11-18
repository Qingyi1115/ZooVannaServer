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
  createCompatibility,
  getAllCompatibilitiesbySpeciesCode,
  checkIsCompatible,
  deleteCompatibility,
  getSpeciesEduDescBySpeciesCode,
  updateSpeciesFoodRemark,
  getSpeciesFoodRemarkBySpeciesCode,
  findIsLoved,
  setCustomerWithSpecies,
  unSetCustomerWithSpecies,
  getSpeciesLovedByCustomer,
  getSpeciesNotLovedByCustomer,
  getFacilityForSpeciesLovedByCustomer,
  getSpeciesLovedByAllCustomer,
} from "../controllers/speciesController";

const router = express.Router();

router.get("/getAllSpeciesCustomer", getAllSpecies);
router.get("/getSpeciesCustomer/:speciesCode", getSpeciesByCode);
router.get(
  "/getSpeciesEduDescBySpeciesCodeCustomer/:speciesCode",
  getSpeciesEduDescBySpeciesCode,
);

router.use(authMiddleware);

//species basic
router.get("/getAllSpecies", getAllSpecies);
router.get("/getSpecies/:speciesCode", getSpeciesByCode);
router.post("/createNewSpecies", createSpecies);
router.put("/updateSpecies", updateSpecies);
router.delete("/deleteSpecies/:speciesCode", deleteSpeciesByCode);

//species edu content
router.put("/updateSpeciesEdu", updateSpeciesEduDesc);
router.get(
  "/getSpeciesEduDescBySpeciesCode/:speciesCode",
  getSpeciesEduDescBySpeciesCode,
);

//species food remark
router.put("/updateSpeciesFoodRemark", updateSpeciesFoodRemark);
router.get(
  "/getSpeciesFoodRemarkBySpeciesCode/:speciesCode",
  getSpeciesFoodRemarkBySpeciesCode,
);

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

//species competebility
router.get(
  "/getAllCompatibilitiesbySpeciesCode/:speciesCode",
  getAllCompatibilitiesbySpeciesCode,
);
router.get("/getCompatibility/:speciesCode1/:speciesCode2", checkIsCompatible);
router.post("/createCompatibility", createCompatibility);
// router.delete("/deleteCompatibility/:compatibilityId", deleteCompatibility);
router.delete(
  "/deleteCompatibility/:speciesCode1/:speciesCode2",
  deleteCompatibility,
);

//species customer favourite
router.get("/isThisLovedByCustomer/:speciesCode", findIsLoved);
router.put("/setCustomer/:speciesCode", setCustomerWithSpecies);
router.put("/unSetCustomer/:speciesCode", unSetCustomerWithSpecies);
router.get("/getSpeciesLovedByCustomer", getSpeciesLovedByCustomer);
router.get("/getSpeciesNotLovedByCustomer", getSpeciesNotLovedByCustomer);
router.get(
  "/getFacilityForSpeciesLovedByCustomer",
  getFacilityForSpeciesLovedByCustomer,
);
router.get("/getSpeciesLovedByAllCustomer", getSpeciesLovedByAllCustomer);

export default router;
