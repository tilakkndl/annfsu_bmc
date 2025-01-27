import express from "express";
import { createNotice, getAllNotices, getNoticeById, updateNotice, deleteNotice } from "../controller/noticeController.js";  
import { protectsAdmin, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protectsAdmin, restrictTo("Admin"), createNotice);  
router.get("/", getAllNotices);  
router.get("/:id", getNoticeById);  
router.put("/:id",protectsAdmin, restrictTo("Admin"), updateNotice);  
router.delete("/:id",protectsAdmin, restrictTo("Admin"), deleteNotice);  

export default router;