import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: [
        "owner",
        "admin",
        "member",
        "viewer",
      ],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

teamMemberSchema.index(
  {
    team: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "TeamMember",
  teamMemberSchema
);