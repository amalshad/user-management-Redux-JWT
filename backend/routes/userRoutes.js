import express from "express";
import { registerUser, loginUser, getUserProfile, getAllUsers, deleteUser, updateUser, uploadProfileImage, updateUserProfile, createUser } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { validateRegister, validateLogin, validateUpdateUser } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, validateUpdateUser, updateUserProfile);
router.get("/", protect, admin, getAllUsers);
router.post("/", protect, admin, validateRegister, createUser);
router.delete("/:id", protect, admin, deleteUser);
router.put("/:id", protect, admin, validateUpdateUser, updateUser);

router.post("/upload", protect, (req, res, next) => {
  upload.single("profileImage")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadProfileImage);

export default router;