import { Router } from "express";
import { addToHistory, getUserHistory, login,register } from "../controllers/userController.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/get_all_activity").get(getUserHistory);
router.route("/add_to_activity").post(addToHistory);

export default router;