import { axiosInstance } from "./config.js";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });

  try {
    const res = await axiosInstance.post("/auth/login", userCredential);
    // console.log(res.data);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
