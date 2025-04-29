import projectModel from "../models/project.model.js";

const createProject = async ({ projectTitle, task }) => {
  if (
    !projectTitle ||
    !task.title ||
    !task.description ||
    !task.status ||
    task.datOfcompletion ||
    task.dateOfcreation
  )
    throw new Error("Please provide all filds");

  const project = await projectModel.create({
    projectTitle,
    tasks: [task],
  });
  return project;
};
export default { createProject };
