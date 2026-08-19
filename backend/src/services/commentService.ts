import Comment from "../models/Comment";
import Task from "../models/Task";

export const createComment = async (
  taskId: string,
  userId: string,
  text: string
) => {
  const task = await Task.findOne({
    _id: taskId,
    owner: userId,
  });

  if (!task) {
    return null;
  }

  return Comment.create({
    task: taskId,
    user: userId,
    text,
  });
};

export const getTaskComments = async (
  taskId: string,
  userId: string
) => {
  const task = await Task.findOne({
    _id: taskId,
    owner: userId,
  });

  if (!task) {
    return null;
  }

  return Comment.find({
    task: taskId,
  })
    .populate(
      "user",
      "name email"
    )
    .sort({
      createdAt: 1,
    });
};

export const updateComment = async (
  commentId: string,
  userId: string,
  text: string
) => {
  return Comment.findOneAndUpdate(
    {
      _id: commentId,
      user: userId,
    },
    {
      text,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate(
    "user",
    "name email"
  );
};

export const deleteComment = async (
  commentId: string,
  userId: string
) => {
  return Comment.findOneAndDelete({
    _id: commentId,
    user: userId,
  });
};
