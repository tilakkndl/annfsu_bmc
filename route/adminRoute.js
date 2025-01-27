import express from "express";
import { adminRegister, adminLogin,  adminLogout } from "../controller/adminController.js"; 


const router = express.Router();
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/logout", adminLogout);

export default router;