import express from "express";

// Controller functions
import { login } from "../controllers/userController";

const router = express.Router();

// sign up/create account

// log in
router.post("/login", login);

// export default (router: express.Router) => {
//     router.post("/api/login", login);
// }

export default router;