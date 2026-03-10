import projectModel from "../models/project.model.js";
import projectService from "../services/project.service.js";

const createproject = async (req, res) => {
  const {
    projectTitle,
    organizationId,
    task: {
      title,
      description,
      dateOfcreation,
      datOfcompletion,
      status,
      assignee,
      priority,
      dueDate,
    } = {},
  } = req.body;
  const ownerId = req.user._id;

  try {
    if (!organizationId) {
      return res.status(400).json({ message: "Organization id is required" });
    }
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
      organization: organizationId,
      owner: ownerId,
      members: [ownerId],
      task: {
        title,
        description,
        dateOfcreation,
        datOfcompletion,
        status,
        assignee,
        priority,
        dueDate,
      },
    });
    return res.status(201).json({ newProject });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while creating tasks" });
  }
};

const updateproject = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user?._id;
  const { dueDate } = req.body;

  const { title, description, dateOfcompletion, status, priority, assignee } =
    req.body;

  // get old Taskdata
  const projectDoc = await projectModel.findOne({ "tasks._id": taskId });
  if (!projectDoc)
    return res.status(404).json({
      message: "Task not found",
    });
  const oldTask = projectDoc.tasks.id(taskId);

  let historyLog = "Updated task details"; //default fallback
  if (status && status !== oldTask.status) {
    historyLog = `Moved from ${oldTask.status} to ${status}`;
  } else if (priority && priority !== oldTask.priority) {
    historyLog = `Changed priority to ${priority}`;
  }

  try {
    const project = await projectModel.findOneAndUpdate(
      {
        "tasks._id": taskId,
      },
      {
        $set: {
          "tasks.$.assignee": userId || assignee,
          "tasks.$.priority": priority,
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.status": status,
          "tasks.$.dateOfCompletion": dateOfcompletion,
          "tasks.$.dueDate": dueDate,
        },
        $push: {
          "tasks.$.history": {
            action: historyLog,
            user: userId || req.user._id,
          },
        },
      },
      { new: true }, // return updated doc
    );
    if (!project) {
      return res.status(404).json({ message: "Task not found in any project" });
    }
    return res.status(200).json({ message: "Project updated successfullly" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error while updating project", error });
  }
};

const getallproject = async (req, res) => {
  const { orgId } = req.params;
  if (!orgId) {
    return res.status(400).json({ message: "Organization id is required" });
  }
  try {
    const project = await projectModel
      .find({ organization: orgId })
      .populate("tasks.assignee tasks.comments.author tasks.history.user", "username email");
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
      { new: true },
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

const addComment = async (req, res) => {
  const { projectId, taskId } = req.params;
  const { text } = req.body;
  const authorId = req.user._id;
  try {
    const project = await projectModel
      .findOneAndUpdate(
        {
          _id: projectId,
          "tasks._id": taskId,
        },
        {
          $push: {
            "tasks.$.comments": {
              text,
              author: authorId,
            },
          },
        },
        { new: true },
      )
      .populate("tasks.comments.author", "username email");
    if (!project) {
      return res.status(404).json({ message: "Faild to add comments" });
    }
    return res
      .status(200)
      .json({ message: "Comment added successfully", project });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error while adding comment" });
  }
};

export default {
  createproject,
  updateproject,
  getallproject,
  deletetask,
  deleteproject,
  addComment,
};
