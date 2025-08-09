//TODO: 플젝 api DTO에 맞게 수정 필요
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false,
});

// POST 요청
export const postResponse = async <TRequest, TResponse>(
  url: string,
  body: TRequest
): Promise<TResponse | null> => {
  try {
    const response = await instance.post<TResponse>(url, body);
    return response.data;
  } catch (error) {
    console.error("POST 요청 실패:", error);
    return null;
  }
};

// GET 요청
export const getResponse = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    console.error("GET 요청 실패:", error);
    return null;
  }
};

export default instance;
