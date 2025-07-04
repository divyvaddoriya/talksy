import { Router } from "express";
import { login, logout, register , allUsers} from "../controller/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route('/').post(register).get(protect,allUsers);
router.route('/login').post(login)
router.route('/logout').post(logout)

export default router;