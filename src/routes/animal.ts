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
  checkIsSafeBreeding,
  getAllAnimalWeightsByAnimalCode,
  addAnimalWeight,
  deleteAnimalWeight,
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
router.get(
  "/checkIsSafeBreeding/:animalCode1/:animalCode2",
  checkIsSafeBreeding,
);

// -- Animal Weight
router.get(
  "/getAllAnimalWeightsByAnimalCode/:animalCode",
  getAllAnimalWeightsByAnimalCode,
);
router.post("/addAnimalWeight", addAnimalWeight);
router.delete("/deleteAnimalWeight/:animalWeightId", deleteAnimalWeight);

export default router;
