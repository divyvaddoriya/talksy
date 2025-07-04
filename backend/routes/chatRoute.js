import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { accessChat , fetchChats , createGroupChats , addToGroup , removeFromGroup , renameGroupChats } from "../controller/chat.controller.js";
const router = Router();

router.route('/').post(protect , accessChat);
router.route('/').get(protect , fetchChats);
router.route('/group').post(protect , createGroupChats);
router.route('/rename').put(protect , renameGroupChats);
router.route('/groupremove').put(protect , removeFromGroup);
router.route('/groupAdd').put(protect , addToGroup);

export default router;