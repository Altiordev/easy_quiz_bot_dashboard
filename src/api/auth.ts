import api from "./axios.instance.ts";

export const getAccessToken = () => {
  return localStorage.getItem("chat_id");
};

export async function login(
  chat_id: number,
): Promise<{ message: string; chat_id: number }> {
  const response = await api.get(`/auth/${chat_id}`);
  return response.data;
}
