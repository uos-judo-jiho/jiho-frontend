import axiosInstance from "./config";

const METHOD_URL = "api/trainings";

export const getTrainings = async (year) => {
  return await axiosInstance({
    url: `${METHOD_URL}?year=${year ?? ""}`,
    method: "GET",
    withCredentials: true,
  }).then((response) => response.data.trainingLogs);
};
