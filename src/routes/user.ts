import express from "express";

// Controller functions
import { login, createUser } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// sign up/create account

// log in
router.post("/login", login);

router.use(authMiddleware)

router.post("/createUser", createUser);

export default router;