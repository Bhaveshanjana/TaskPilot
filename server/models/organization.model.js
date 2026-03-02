import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true
            },
            role: {
                type: String,
                enum: ["Owner", "Admin", "Member"],
                default: "Member",
            }
        }
    ],
}, { timestamps: true });

const organizationModel = mongoose.model("Organization", organizationSchema);

export default organizationModel;