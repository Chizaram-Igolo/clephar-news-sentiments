import { FetchNewsParams } from "../utils/types";
import { API_BASE_URL } from "../utils/constants";

export const fetchNews = async (params: {
  [K in keyof FetchNewsParams]: string;
}) => {
  const queryParams = new URLSearchParams({
    ...params,
    apikey: import.meta.env.VITE_API_KEY,
  }).toString();

  try {
    const response = await fetch(`${API_BASE_URL}?${queryParams}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("query", `${API_BASE_URL}?${queryParams}`);
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch news data", error);
    throw new Error("Failed to fetch news data");
  }
};
