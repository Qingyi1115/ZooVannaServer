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
  updateDesignDiagram
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

router.get("/getanimalsofenclosure/:enclosureId", getAnimalsOfEnclosure)
router.put("/assignAnimalToEnclosure", assignAnimalToEnclosure);
router.put("/removeAnimalFromEnclosure", removeAnimalFromEnclosure);

router.get("/getSpeciesCompatibilityInEnclosure/:enclosureId/:speciesCode", getSpeciesCompatibilityInEnclosure)

router.put("/updateDesignDiagram/:enclosureId", updateDesignDiagram)

export default router;
