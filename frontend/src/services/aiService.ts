import api from "../api/axios";

export interface AIResponse {
  response: string;
}

export const chatWithAI = async (
  message: string
): Promise<string> => {
  const response =
    await api.post<AIResponse>(
      "/ai/chat",
      {
        message,
      }
    );

  return response.data.response;
};
