import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
  dateOfCompletion: {
    type: Date,
  },
});

const projectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  tasks: [taskSchema],
});

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;
