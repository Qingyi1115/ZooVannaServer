import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getAllEnclosures,
  getEnclosuresById,
  createNewEnclosure,
  updateEnclosure,
  updateEnclosureStatus,
  deleteEnclosure,
  assignAnimalToEnclosure,
  getAnimalsOfEnclosure,
} from "../controllers/enclosureController";

const router = express.Router();

router.use(authMiddleware);

//species basic
router.get("/getAllEnclosures", getAllEnclosures);
router.get("/getEnclosuresById/:enclosureId", getEnclosuresById);
router.post("/createNewEnclosure", createNewEnclosure);
router.put("/updateEnclosure", updateEnclosure);
router.put("/updateEnclosureStatus", updateEnclosureStatus);
router.delete("/deleteEnclosure/:enclosureId", deleteEnclosure);

router.get("/getanimalsofenclosure/:enclosureId", getAnimalsOfEnclosure)
router.put("/assignAnimalToEnclosure", assignAnimalToEnclosure);

export default router;
