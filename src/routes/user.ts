import express from "express";

// Controller functions
import { login } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// sign up/create account

// log in
router.post("/login", login);

// export default (router: express.Router) => {
//     router.post("/api/login", login);
// }
router.use(authMiddleware)

export default router;