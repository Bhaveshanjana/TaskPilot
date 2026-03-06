import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import orgController from "../controller/organization.controller.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware.authUser,
  orgController.createOrganization,
);
router.get("/", authMiddleware.authUser, orgController.getUserOrganization);

export default router;
