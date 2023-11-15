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
  getClimateDesignRecommendation,
  getAllPlantations,
  addPlantationToEnclosure,
  removePlantationFromEnclosure,
} from "../controllers/enclosureController";

const router = express.Router();

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
router.get(
  "/getClimateDesignRecommendation/:enclosureId",
  getClimateDesignRecommendation,
);

//Plantation
router.get("/getAllPlantations", getAllPlantations);
router.put("/addPlantationToEnclosure", addPlantationToEnclosure);
router.put("/removePlantationFromEnclosure", removePlantationFromEnclosure);

export default router;
