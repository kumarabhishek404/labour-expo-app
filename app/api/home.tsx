import API_CLIENT from ".";

const fetchCompanyStats = async () => {
  try {
    const response = await API_CLIENT.makeGetRequest("/home/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching company stats:", error);
    throw error;
  }
};

const HOME = {
  fetchCompanyStats,
};

export default HOME;
