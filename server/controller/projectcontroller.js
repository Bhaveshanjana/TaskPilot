import projectModel from "../models/project.model.js";
import projectService from "../services/project.service.js";

const createproject = async (req, res) => {
  const {
    projectTitle,
    title,
    description,
    dateOfcreation,
    datOfcompletion,
    status,
  } = req.body;
  try {
    const existProject = await projectModel.findOne({
      projectTitle,
      "tasks.title": title,
      "tasks.description": description,
    });
    if (existProject) {
      return res.status(400).json({
        message: "Project with same title and description already exist",
      });
    }
    const newProject = await projectService.createProject({
      projectTitle,
      task: {
        title,
        description,
        dateOfcreation,
        datOfcompletion,
        status,
      },
    });
   return res.status(201).json({ newProject });
  } catch (error) {
   return res.status(500).json({ message: "error while creating tasks" });
    console.log(error);
  }
};

const updateproject = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dateOfcompletion, status } = req.body;
  try {
    const project = await projectModel.findOneAndUpdate(
      {
        "tasks._id": taskId,
      },
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.status": status,
          "tasks.$.dateOfCompletion": dateOfcompletion,
        },
      },
      { new: true } // return updated doc
    );

   return res.status(200).json({ message: "Project updated successfullly" });
  } catch (error) {
   return res
      .status(500)
      .json({ message: "Internal server error while updating project" });
  }
};

const getallproject = async (req, res) => {
  try {
    const project = await projectModel.find({});
    res.status(200).json({ project });
  } catch (error) {
   return res
      .status(500)
      .json({ message: "Internal sever error while getting all projects" });
  }
};

const deletetask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await projectModel.findOneAndUpdate(
      { "tasks._id": taskId },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
   return res.status(500).json({ message: "Error while deleting task" });
  }
};

const deleteproject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findOneAndDelete({ _id: projectId });
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
   return res.status(500).json({ message: "Error while deleting project" });
  }
};
export default {
  createproject,
  updateproject,
  getallproject,
  deletetask,
  deleteproject,
};
