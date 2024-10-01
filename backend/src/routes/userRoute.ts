import { Router } from "express";
import otpController from "../controller/otpController";
import { userSchema, validateRequest } from "../utils/valiator/formValidator";
import authController from "../controller/authController";
import { loginSchema } from "../utils/valiator/ValidateLogin";
import { authMiddleware } from "../middleware/authMiddleware";
import taskcController from "../controller/taskcController";

const router = Router();

router.post("/sendOtp", otpController.sendOtpToUser);
router.post("/verifyOtp", otpController.verifyOtp);
router.post("/resendOtp", otpController.sendOtpToUser);
router.post("/register", validateRequest(userSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);

router.get("/getTasks", authMiddleware, taskcController.getallTask);
router.get('/completeTasks',authMiddleware,taskcController.getCompleteTask)
router.get("/alldetails", authMiddleware,taskcController.getAllItem);
router.post('/search',authMiddleware,taskcController.searchItem)

export default router;
