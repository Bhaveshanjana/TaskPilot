import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Medium",
  },
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
    default: "To Do",
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
  dateOfCompletion: {
    type: Date,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  comments: [
    {
      text: {
        type: String,
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  history: [
    {
      action: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      timestamps: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: true,
    },
    tasks: [taskSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    organization: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    columns: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          color: {
            type: String,
            default: "gray",
          },
        },
      ],
      default: [
        {
          name: "To Do",
          color: "gray",
        },
        {
          name: "In Progress",
          color: "blue",
        },
        {
          name: "Done",
          color: "green",
        },
      ],
    },
  },
  { timestamps: true },
);

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;
