import api from "../api/axios";

export interface ActivityUser {
  _id: string;
  name: string;
  email: string;
}

export interface ActivityTask {
  _id: string;
  title: string;
}

export interface Activity {
  _id: string;
  project: string;
  task?: ActivityTask | string;
  user: ActivityUser;
  action: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getProjectActivities = async (
  projectId: string
): Promise<Activity[]> => {
  const response = await api.get(
    `/projects/${projectId}/activities`
  );

  return response.data;
};
