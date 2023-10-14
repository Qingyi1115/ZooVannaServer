import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createAnimal,
  getAllAnimals,
  getAllAnimalsBySpeciesCode,
  getAnimalByAnimalCode,
  updateAnimal,
  deleteAnimal,
  updateAnimalStatus,
  addAnimalLineage,
  updateAnimalLineage,
  deleteAnimalLineage,
  getLineageByAnimalCode,
  checkInbreeding,
  getAllAnimalWeightsByAnimalCode,
  addAnimalWeight,
  deleteAnimalWeight,
  getAllAnimalActivities,
  getAnimalActivityById,
  createAnimalActivity,
  updateAnimalActivity,
  deleteAnimalActivity,
  getAnimalActivityByAnimalCode,
  assignAnimalsToActivity,
  removeAnimalFromActivity,
  assignItemToActivity,
  removeItemFromActivity,
  checkIfAbnormalWeight,
  getAllAbnormalWeights,
  createAnimalObservationLog,
  getAllAnimalObservationLogs,
  getAnimalObservationLogById,
  getAnimalObservationLogsByAnimalCode,
  getAnimalObservationLogsBySpeciesCode,
  updateAnimalObservationLog,
  deleteAnimalObservationLogById,
  createAnimalActivityLog,
  getAnimalActivityLogsBySpeciesCode,
  getAnimalActivityLogById,
  deleteAnimalActivityLogById,
  updateAnimalActivityLog,
} from "../controllers/animalController";

const router = express.Router();

router.use(authMiddleware);

// -- Animal Basic Info
router.get("/getAllAnimals", getAllAnimals);
router.get(
  "/getAllAnimalsBySpeciesCode/:speciesCode",
  getAllAnimalsBySpeciesCode,
);
router.get("/getAnimalByAnimalCode/:animalCode", getAnimalByAnimalCode);
router.post("/createNewAnimal", createAnimal);
router.put("/updateAnimal", updateAnimal);
router.delete("/deleteAnimal/:animalCode", deleteAnimal);
router.put("/updateAnimalStatus", updateAnimalStatus);

// -- Animal Lineage
router.get("/getLineageByAnimalCode/:animalCode", getLineageByAnimalCode);
router.post("/addAnimalLineage", addAnimalLineage);
router.put("/updateAnimalLineage", updateAnimalLineage);
router.put("/deleteAnimalLineage", deleteAnimalLineage);
router.get("/checkInbreeding/:animalCode1/:animalCode2", checkInbreeding);

// -- Animal Weight
router.get(
  "/getAllAnimalWeightsByAnimalCode/:animalCode",
  getAllAnimalWeightsByAnimalCode,
);
router.post("/addAnimalWeight", addAnimalWeight);
router.delete("/deleteAnimalWeight/:animalWeightId", deleteAnimalWeight);
router.get("/getAllAbnormalWeights/", getAllAbnormalWeights);
router.get("/checkIfAbnormalWeight/:animalCode", checkIfAbnormalWeight);

// -- Animal Activity
router.get("/getAllAnimalActivities", getAllAnimalActivities);
router.get("/getAnimalActivityById/:animalActivityId", getAnimalActivityById);
router.get(
  "/getAnimalActivityByAnimalCode/:animalCode",
  getAnimalActivityByAnimalCode,
);
router.post("/createAnimalActivity", createAnimalActivity);
router.put("/updateAnimalActivity", updateAnimalActivity);
router.delete("/deleteAnimalActivity/:animalActivityId", deleteAnimalActivity);

router.put("/assignAnimalsToActivity", assignAnimalsToActivity);
router.put("/removeAnimalFromActivity", removeAnimalFromActivity);
router.put("/assignItemToActivity", assignItemToActivity);
router.put("/removeItemFromActivity", removeItemFromActivity);

// -- Animal Logs
router.post("/createAnimalObservationLog", createAnimalObservationLog);
router.get("/getAllAnimalObservationLogs", getAllAnimalObservationLogs);
router.get("/getAnimalObservationLogById/:animalObservationLogId", getAnimalObservationLogById);
router.get("/getAnimalObservationLogsByAnimalCode/:animalCode", getAnimalObservationLogsByAnimalCode);
router.get("/getAnimalObservationLogsBySpeciesCode/:speciesCode", getAnimalObservationLogsBySpeciesCode);
router.put("/updateAnimalObservationLog/:animalObservationLogId", updateAnimalObservationLog);
router.delete("/deleteAnimalObservationLogById/:animalObservationLogsId", deleteAnimalObservationLogById);

// -- Animal Activity Logs
router.post("/createAnimalActivityLog", createAnimalActivityLog);
router.get("/getAnimalActivityLogById/:animalActivityLogId", getAnimalActivityLogById);
router.get("/getAnimalActivityLogsBySpeciesCode/:speciesCode", getAnimalActivityLogsBySpeciesCode);
router.put("/updateAnimalActivityLog/:animalActivityLogId", updateAnimalActivityLog);
router.delete("/deleteAnimalActivityLogById/:animalActivityLogId", deleteAnimalActivityLogById);

updateAnimalObservationLog
export default router;
