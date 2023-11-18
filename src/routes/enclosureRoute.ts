import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllEnclosures,
  getEnclosureById,
  createNewEnclosure,
  updateEnclosure,
  updateEnclosureStatus,
  deleteEnclosure,
  assignAnimalToEnclosure,
  getAnimalsOfEnclosure,
  removeAnimalFromEnclosure,
  getSpeciesCompatibilityInEnclosure,
  updateDesignDiagram,
  assignKeepersToEnclosure,
  removeKeepersFromEnclosure,
  updateEnclosureTerrainDistribution,
  deleteEnclosureTerrainDistribution,
  getEnclosureTerrainDistributionRecommendation,
  updateEnclosureClimateDesign,
  deleteEnclosureClimateDesign,
  getAllPlantations,
  addPlantationToEnclosure,
  removePlantationFromEnclosure,
  getEnvironmentSensorsData,
  createNewEnclosureBarrier,
  getEnclosureBarrier,
  updateEnclosureBarrier,
  deleteEnclosureBarrier,
  getEnclosureAccessPoints,
  getEnclosureAccessPointById,
  createNewEnclosureAccessPoint,
  updateEnclosureAccessPoint,
  deleteEnclosureAccessPoint,
  getAllPlantationsByEnclosureId,
  getEnclosureEnrichmentItems,
  removeEnrichmentItemFromEnclosure,
  addEnrichmentItemToEnclosure,
  getAllEnclosuresFacility,
} from "../controllers/enclosureController";

const router = express.Router();

router.get("/getAllEnclosuresFacility", getAllEnclosuresFacility);

router.use(authMiddleware);

//species basic
router.get("/getAllEnclosures", getAllEnclosures);
router.get("/getEnclosureById/:enclosureId", getEnclosureById);
router.post("/createNewEnclosure", createNewEnclosure);
router.put("/updateEnclosure", updateEnclosure);
router.put("/updateEnclosureStatus", updateEnclosureStatus);
router.delete("/deleteEnclosure/:enclosureId", deleteEnclosure);

router.get("/getanimalsofenclosure/:enclosureId", getAnimalsOfEnclosure);
router.put("/assignAnimalToEnclosure", assignAnimalToEnclosure);
router.put("/removeAnimalFromEnclosure", removeAnimalFromEnclosure);

router.get(
  "/getSpeciesCompatibilityInEnclosure/:enclosureId/:speciesCode",
  getSpeciesCompatibilityInEnclosure,
);

router.put("/updateDesignDiagram/:enclosureId", updateDesignDiagram);

router.put("/assignKeepersToEnclosure/", assignKeepersToEnclosure);
router.put("/removeKeepersFromEnclosure/", removeKeepersFromEnclosure);

router.put(
  "/updateEnclosureTerrainDistribution",
  updateEnclosureTerrainDistribution,
);
router.put(
  "/deleteEnclosureTerrainDistribution/:enclosureId",
  deleteEnclosureTerrainDistribution,
);
router.get(
  "/getEnclosureTerrainDistributionRecommendation/:enclosureId",
  getEnclosureTerrainDistributionRecommendation,
);

router.put("/updateEnclosureClimateDesign", updateEnclosureClimateDesign);
router.put(
  "/deleteEnclosureClimateDesign/:enclosureId",
  deleteEnclosureClimateDesign,
);
// router.get(
//   "/getClimateDesignRecommendation/:enclosureId",
//   getClimateDesignRecommendation,
// );

//Plantation
router.get(
  "/getAllPlantationsByEnclosureId/:enclosureId",
  getAllPlantationsByEnclosureId,
);
router.get("/getAllPlantations", getAllPlantations);
router.put("/addPlantationToEnclosure", addPlantationToEnclosure);
router.put("/removePlantationFromEnclosure", removePlantationFromEnclosure);

//Sensors
router.get(
  "/getEnvironmentSensorsData/:enclosureId",
  getEnvironmentSensorsData,
);

// barrier
router.get("/getEnclosureBarrier/:enclosureId", getEnclosureBarrier);
router.put("/createNewEnclosureBarrier", createNewEnclosureBarrier);
router.put("/updateEnclosureBarrier", updateEnclosureBarrier);
router.delete(
  "/deleteEnclosureBarrier/:enclosureBarrierId",
  deleteEnclosureBarrier,
);

// access point
router.get("/getEnclosureAccessPoints/:enclosureId", getEnclosureAccessPoints);
router.get(
  "/getEnclosureAccessPointById/:accessPointId",
  getEnclosureAccessPointById,
);
router.put("/createNewEnclosureAccessPoint", createNewEnclosureAccessPoint);
router.put("/updateEnclosureAccessPoint", updateEnclosureAccessPoint);
router.delete(
  "/deleteEnclosureAccessPoint/:accessPointId",
  deleteEnclosureAccessPoint,
);

// enrichment items
router.get(
  "/getEnclosureEnrichmentItems/:enclosureId",
  getEnclosureEnrichmentItems,
);
router.put("/addEnrichmentItemToEnclosure", addEnrichmentItemToEnclosure);
router.put(
  "/removeEnrichmentItemFromEnclosure",
  removeEnrichmentItemFromEnclosure,
);

export default router;
