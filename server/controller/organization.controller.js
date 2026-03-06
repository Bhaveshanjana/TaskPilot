import organizationModel from "../models/organization.model.js";
import userModel from "../models/organization.model.js";

const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const creatorId = req.user._id;
    if (!name) {
      return res.status(400).json({
        message: "Organization name is required",
      });
    }
    const organization = await organizationModel.create({
      name,
      owner: creatorId,
      members: [
        {
          user: creatorId,
          role: "Owner",
        },
      ],
    });
    await userModel.findByIdAndUpdate(
      creatorId,
      { $push: { organizations: organization._id } },
      { new: true },
    );
    return res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error while creating organization" });
  }
};
const getUserOrganization = async (req, res) => {
  try {
    const userId = req.user._id;
    const organizations  = await organizationModel.find({ "members.user": userId });
    return res.status(200).json({
      message: "User organizations fetched successfully",
      organizations ,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  createOrganization,
  getUserOrganization,
};
