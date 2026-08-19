import api from "../api/axios";

export interface SearchUser {
  _id: string;
  name: string;
  email: string;
}

export const searchUsers = async (
  search: string
): Promise<SearchUser[]> => {
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
