import express from 'express';
import {registerUser ,Auth, loginUser,userLogout,getOneUser, jwtAuth, addRemovefollower, changePassword} from '../controllers/user.js';


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/auth", jwtAuth, Auth);
router.get("/logout",jwtAuth, userLogout)
router.get("/:userId", jwtAuth, getOneUser)
router.put("/followers", jwtAuth, addRemovefollower);
router.put("/change-password/:id", jwtAuth , changePassword);
export default router;