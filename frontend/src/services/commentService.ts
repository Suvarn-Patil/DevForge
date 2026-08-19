import api from "../api/axios";

export interface CommentUser {
  _id: string;
  name: string;
  email: string;
}

export interface Comment {
  _id: string;
  task: string;
  user: CommentUser;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ================================
   GET COMMENTS
================================ */

export const getComments = async (
  taskId: string
): Promise<Comment[]> => {
  const response = await api.get(
    `/tasks/${taskId}/comments`
  );

  return response.data;
};

/* ================================
   CREATE COMMENT
================================ */

export const createComment = async (
  taskId: string,
  text: string
): Promise<Comment> => {
  const response = await api.post(
    `/tasks/${taskId}/comments`,
    {
      text,
    }
  );

  return response.data;
};

/* ================================
   UPDATE COMMENT
================================ */

export const updateComment = async (
  commentId: string,
  text: string
): Promise<Comment> => {
  const response = await api.put(
    `/comments/${commentId}`,
    {
      text,
    }
  );

  return response.data;
};

/* ================================
   DELETE COMMENT
================================ */

export const deleteComment = async (
  commentId: string
) => {
  const response = await api.delete(
    `/comments/${commentId}`
  );

  return response.data;
};
