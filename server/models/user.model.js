import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  country: {
    type: String,
    required: true,
  },
  organizations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  ],
  notifications: [
    {
      type: {
        type: String,
      },
      message: String,
      relatedTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

//Generating Token-
userSchema.methods.genAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

// CamparePassword-
userSchema.methods.camparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// hashPassword-
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
