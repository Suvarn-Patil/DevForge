import api from "../api/axios";

export type TeamRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer";

export interface TeamUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface TeamMember {
  _id: string;

  user:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
      };

  role: TeamRole;
}

export interface Team {
  _id: string;
  name: string;
  owner: string;
  role?: TeamRole;
  members?: TeamMember[];
  createdAt?: string;
  updatedAt?: string;
}

/* CREATE TEAM */

export const createTeam = async (
  name: string
) => {
  const response = await api.post(
    "/teams",
    {
      name,
    }
  );

  return response.data;
};

/* GET TEAMS */

export const getTeams = async (): Promise<
  Team[]
> => {
  const response = await api.get(
    "/teams"
  );

  return response.data;
};

/* GET SINGLE TEAM */

export const getTeam = async (
  teamId: string
): Promise<Team> => {
  const response = await api.get(
    `/teams/${teamId}`
  );

  return response.data;
};

/* SEARCH USERS */

export const searchUsers = async (
  search: string
): Promise<TeamUser[]> => {
  const response = await api.get(
    "/users/search",
    {
      params: {
        search,
      },
    }
  );

  return response.data;
};

/* ADD MEMBER */

export const addTeamMember = async (
  teamId: string,
  userId: string,
  role:
    | "admin"
    | "member"
    | "viewer" = "member"
) => {
  const response = await api.post(
    `/teams/${teamId}/members`,
    {
      userId,
      role,
    }
  );

  return response.data;
};

/* UPDATE MEMBER ROLE */

export const updateMemberRole = async (
  teamId: string,
  userId: string,
  role:
    | "admin"
    | "member"
    | "viewer"
) => {
  const response = await api.put(
    `/teams/${teamId}/members/${userId}`,
    {
      role,
    }
  );

  return response.data;
};

/* REMOVE MEMBER */

export const removeTeamMember = async (
  teamId: string,
  userId: string
) => {
  const response = await api.delete(
    `/teams/${teamId}/members/${userId}`
  );

  return response.data;
};
