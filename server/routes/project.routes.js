import express from "express";
import projectController from "../controller/projectcontroller.js";

const router = express.Router();

router.post("/createproject", projectController.createproject);

router.put("/updateproject/:taskId", projectController.updateproject);

router.get("/getallproject", projectController.getallproject);

router.delete("/:taskId", projectController.deletetask);

router.delete("/deletedproject/:projectId", projectController.deleteproject);

export default router;
