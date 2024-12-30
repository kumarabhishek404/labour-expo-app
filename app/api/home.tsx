import { makeGetRequest } from "./index";

export const fetchCompanyStats = async () => {
  try {
    const response = await makeGetRequest("/home/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching company stats:", error);
    throw error;
  }
};
