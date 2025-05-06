import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  changeAvatar,
  changeCoverImage,
  changeDetails,
  changePassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login", loginUser);

// Secure Routes
router.use(verifyJwt);

router.post("/logout", logoutUser);
router.post("/refreshToken", refreshAccessToken);
router.put("/changePassword", changePassword);
router.put("/changeDetails", changeDetails);
router.put("/changeAvatar", upload.single("avatar"), changeAvatar);
router.put("/changeCover", upload.single("coverImage"), changeCoverImage);

export default router;
