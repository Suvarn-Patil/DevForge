import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "created_task",
        "updated_task",
        "changed_status",
        "deleted_task",
        "created_comment",
        "updated_comment",
        "deleted_comment",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({
  project: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Activity",
  activitySchema
);
