import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false,
    },

    type: {
      type: String,
      enum: [
        "task",
        "project",
        "comment",
        "team",
        "system",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  recipient: 1,
  read: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Notification",
  notificationSchema
);
