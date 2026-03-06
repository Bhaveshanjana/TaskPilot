import projectModel from "../models/project.model.js";

const createProject = async ({
  projectTitle,
  task,
  organization,
  owner,
  members,
}) => {
  if (
    !projectTitle ||
    !task.title ||
    !task.description ||
    !task.status ||
    !organization ||
    !owner ||
    !members
  )
    throw new Error("Please provide all filds");

  const project = await projectModel.create({
    projectTitle,
    tasks: [task],
    organization,
    owner,
    members,
  });
  return project;
};
export default { createProject };
