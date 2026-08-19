import api from "../api/axios";

export interface Task {
  _id: string;

  title: string;

  description?: string;

  project:
    | string
    | {
        _id: string;
        name: string;
        description?: string;
      };

  priority:
    | "low"
    | "medium"
    | "high";

  status:
    | "todo"
    | "inprogress"
    | "review"
    | "done";

  assignee?: {
    _id: string;
    name: string;
    email: string;
  } | null;

  createdAt?: string;

  updatedAt?: string;
}

/* ================================
   GET TASKS
================================ */

export const getTasks = async (
  project?: string
): Promise<Task[]> => {
  const response = await api.get(
    "/tasks",
    {
      params: project
        ? { project }
        : undefined,
    }
  );

  return (
    response.data.tasks ??
    response.data
  );
};

/* ================================
   GET TASK BY ID
================================ */

export const getTaskById = async (
  taskId: string
): Promise<Task> => {
  const response = await api.get(
    `/tasks/${taskId}`
  );

  return response.data;
};

/* ================================
   CREATE TASK
================================ */

export const createTask = async (
  title: string,
  description: string,
  project: string,
  assignee?: string
) => {
  const response = await api.post(
    "/tasks",
    {
      title,
      description,
      priority: "medium",
      status: "todo",
      project,

      ...(assignee
        ? { assignee }
        : {}),
    }
  );

  return response.data;
};

/* ================================
   EDIT TASK
================================ */

export const updateTask = async (
  taskId: string,
  updates: {
    title?: string;
    description?: string;

    priority?:
      | "low"
      | "medium"
      | "high";

    assignee?: string;
  }
) => {
  const response = await api.patch(
    `/tasks/${taskId}`,
    updates
  );

  return response.data;
};

/* ================================
   UPDATE TASK STATUS
================================ */

export const updateTaskStatus = async (
  taskId: string,
  status:
    | "todo"
    | "inprogress"
    | "review"
    | "done"
) => {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    {
      status,
    }
  );

  return response.data;
};

/* ================================
   DELETE TASK
================================ */

export const deleteTask = async (
  taskId: string
) => {
  const response = await api.delete(
    `/tasks/${taskId}`
  );

  return response.data;
};