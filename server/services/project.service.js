import projectModel from "../models/project.model.js";

const createProject = async ({ projectTitle, task, creatorId}) => {  
  if (
    !projectTitle ||
    !task.title ||
    !task.description ||
    !task.status 
  )
  throw new Error("Please provide all filds");

  const project = await projectModel.create({
    projectTitle,
    tasks: [task],
    creatorId,
  });
  return project;
};
export default { createProject };
