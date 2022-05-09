import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mahimsocialapp.herokuapp.com/api/",
});
