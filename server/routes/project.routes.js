import express from "express";
import projectController from "../controller/projectcontroller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/createproject",
  authMiddleware.authUser,
  projectController.createproject
);

router.put("/updateproject/:taskId", projectController.updateproject);

router.get(
  "/getallproject",
  authMiddleware.authUser,
  projectController.getallproject
);

router.delete("/:taskId", projectController.deletetask);

router.delete("/deletedproject/:projectId", projectController.deleteproject);

export default router;
