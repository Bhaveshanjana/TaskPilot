import express from "express";
import projectController from "../controller/project.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/createproject",
  authMiddleware.authUser,
  projectController.createproject,
);

router.post(
  "/:projectId/tasks/:taskId/comment",
  authMiddleware.authUser,
  projectController.addComment,
);

router.put(
  "/updateproject/:taskId",
  authMiddleware.authUser,
  projectController.updateproject,
);

router.get(
  "/getallproject/:orgId",
  authMiddleware.authUser,
  projectController.getallproject,
);

router.delete("/:taskId", projectController.deletetask);

router.delete("/deletedproject/:projectId", projectController.deleteproject);

router.post(
  "/:projectId/columns",
  authMiddleware.authUser,
  projectController.addColumn,
);

router.put(
  "/:projectId/columns/:columnId",
  authMiddleware.authUser,
  projectController.updateColumn,
);

router.delete(
  "/:projectId/columns/:columnId",
  authMiddleware.authUser,
  projectController.deleteColumn,
);

export default router;
