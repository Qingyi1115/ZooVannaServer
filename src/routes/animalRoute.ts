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
  createAnimalFeedingLog,
  getAnimalFeedingLogById,
  getAnimalFeedingLogsByAnimalCode,
  getAnimalFeedingLogsBySpeciesCode,
  updateAnimalFeedingLog,
  deleteAnimalFeedingLogById,
  getAnimalActivityLogsByAnimalCode,
  getFeedingPlanByFeedingPlanId,
  getAllFeedingPlans,
  getFeedingPlansBySpeciesCode,
  getFeedingPlansByAnimalCode,
  deleteFeedingPlanById,
  updateFeedingPlan,
  createFeedingPlan,
  getAllFeedingPlanSessionDetails,
  getAllFeedingPlanSessionDetailsByPlanId,
  getFeedingItemAmtRecoAllAnimalsOfSpecies,
  getFeedingPlanSessionDetailById,
  createFeedingPlanSessionDetail,
  updateFeedingPlanSessionDetail,
  deleteFeedingPlanSessionDetailById,
  getAllFeedingItemsByPlanSessionId,
  createFeedingItem,
  updateFeedingItem,
  deleteFeedingItemById,
  getFeedingItemAmtReco,
  getAnimalActivityLogsByAnimalActivityId,
  getAnimalFeedingLogByFeedingPlanId,
  getAnimalObservationLogsByAnimalActivityId,
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
// router.put("/makeAnimalActivityPublic", makeAnimalActivityPublic);
// router.get(
//   "/makeAnimalActivityPrivate/:animalActivityId",
//   makeAnimalActivityPrivate,
// );
router.delete("/deleteAnimalActivity/:animalActivityId", deleteAnimalActivity);

router.put("/assignAnimalsToActivity", assignAnimalsToActivity);
router.put("/removeAnimalFromActivity", removeAnimalFromActivity);
router.put("/assignItemToActivity", assignItemToActivity);
router.put("/removeItemFromActivity", removeItemFromActivity);

// -- Animal Observation Logs
router.post("/createAnimalObservationLog", createAnimalObservationLog);
router.get("/getAllAnimalObservationLogs", getAllAnimalObservationLogs);
router.get("/getAnimalObservationLogsByAnimalActivityId/:animalActivityId", getAnimalObservationLogsByAnimalActivityId);
router.get(
  "/getAnimalObservationLogById/:animalObservationLogId",
  getAnimalObservationLogById,
);
router.get(
  "/getAnimalObservationLogsByAnimalCode/:animalCode",
  getAnimalObservationLogsByAnimalCode,
);
router.get(
  "/getAnimalObservationLogsBySpeciesCode/:speciesCode",
  getAnimalObservationLogsBySpeciesCode,
);
router.put(
  "/updateAnimalObservationLog/:animalObservationLogId",
  updateAnimalObservationLog,
);
router.delete(
  "/deleteAnimalObservationLogById/:animalObservationLogsId",
  deleteAnimalObservationLogById,
);

// -- Animal Activity Logs
router.post("/createAnimalActivityLog", createAnimalActivityLog);
router.get(
  "/getAnimalActivityLogById/:animalActivityLogId",
  getAnimalActivityLogById,
);
router.get(
  "/getAnimalActivityLogsByAnimalActivityId/:animalActivityId",
  getAnimalActivityLogsByAnimalActivityId,
);
router.get(
  "/getAnimalActivityLogsByAnimalCode/:animalCode",
  getAnimalActivityLogsByAnimalCode,
);
router.get(
  "/getAnimalActivityLogsBySpeciesCode/:speciesCode",
  getAnimalActivityLogsBySpeciesCode,
);
router.put(
  "/updateAnimalActivityLog/:animalActivityLogId",
  updateAnimalActivityLog,
);
router.delete(
  "/deleteAnimalActivityLogById/:animalActivityLogId",
  deleteAnimalActivityLogById,
);

// -- Animal Feeding Logs
router.post("/createAnimalFeedingLog", createAnimalFeedingLog);
router.get(
  "/getAnimalFeedingLogById/:animalFeedingLogId",
  getAnimalFeedingLogById,
);
router.get(
  "/getAnimalFeedingLogByFeedingPlanId/:feedingPlanId",
  getAnimalFeedingLogByFeedingPlanId,
);
router.get(
  "/getAnimalFeedingLogsByAnimalCode/:animalCode",
  getAnimalFeedingLogsByAnimalCode,
);
router.get(
  "/getAnimalFeedingLogsBySpeciesCode/:speciesCode",
  getAnimalFeedingLogsBySpeciesCode,
);
router.put(
  "/updateAnimalFeedingLog/:animalFeedingLogId",
  updateAnimalFeedingLog,
);
router.delete(
  "/deleteAnimalFeedingLogById/:animalFeedingLogId",
  deleteAnimalFeedingLogById,
);

updateAnimalObservationLog;

// -- Animal Feeding Plan
router.get("/getFeedingPlanById/:feedingPlanId", getFeedingPlanByFeedingPlanId)
router.get("/getAllFeedingPlans", getAllFeedingPlans);
router.get(
  "/getFeedingPlansBySpeciesCode/:speciesCode",
  getFeedingPlansBySpeciesCode,
);
router.get(
  "/getFeedingPlansByAnimalCode/:animalCode",
  getFeedingPlansByAnimalCode,
);
router.post("/createFeedingPlan", createFeedingPlan);
router.put("/updateFeedingPlan", updateFeedingPlan);
router.delete(
  "/deleteFeedingPlanById/:feedingPlanSessionDetailId",
  deleteFeedingPlanById,
);

//-- Animal Feeding Plan Session
router.get("/getAllFeedingPlanSessionDetails", getAllFeedingPlanSessionDetails);
router.get(
  "/getAllFeedingPlanSessionDetailsByPlanId/:feedingPlanSessionDetailId",
  getAllFeedingPlanSessionDetailsByPlanId,
);
router.get(
  "/getFeedingPlanSessionDetailById/:feedingPlanDetailId",
  getFeedingPlanSessionDetailById,
);
router.post("/createFeedingPlanSessionDetail", createFeedingPlanSessionDetail);
router.put("/updateFeedingPlanSessionDetail", updateFeedingPlanSessionDetail);
router.delete(
  "/deleteFeedingPlanSessionDetailById/:feedingPlanDetailId",
  deleteFeedingPlanSessionDetailById,
);

//-- Animal Feeding Plan Food Item
router.get(
  "/getAllFeedingItemsByPlanSessionId/:feedingPlanDetailId",
  getAllFeedingItemsByPlanSessionId,
);
router.post("/createFeedingItem", createFeedingItem);
router.put("/updateFeedingItem", updateFeedingItem);
router.delete("/deleteFeedingItemById/:feedingItemId", deleteFeedingItemById);
router.post("/getFeedingItemAmtRecoAllAnimalsOfSpecies", getFeedingItemAmtRecoAllAnimalsOfSpecies);
router.post("/getFeedingItemAmtReco", getFeedingItemAmtReco);
export default router;
