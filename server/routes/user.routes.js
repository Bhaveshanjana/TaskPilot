import express from "express";
import userController from "../controller/user.controller.js";
import { body } from "express-validator";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("invalid email address"),
    body("username")
      .isLength({ min: 3 })
      .withMessage("username must be 3 characters long"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be 5 characters long"),
  ],
  userController.registerUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("invalid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("password must be 5 characters long"),
  ],
  userController.loginUser,
);

router.put(
  "/notifications/:notificationId/read",
  authMiddleware.authUser,
  userController.markNotificationAsRead,
);

router.delete(
  "/notifications",
  authMiddleware.authUser,
  userController.clearAllNotifications,
);

router.get(
  "/notifications",
  authMiddleware.authUser,
  userController.getNotifications,
);
router.get("/logout", userController.logOutUser);

export default router;
