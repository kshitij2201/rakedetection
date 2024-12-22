import axios from "axios";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  setIsLoginFalse,
  setIsLoginTrue,
} from "../slices/userSlice.js";
import toast from "react-hot-toast";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `https://rakedetection-bakckend.vercel.app/api/v1/user/login`,
      { email, password },
      config
    );

    localStorage.setItem("token", data.token);

    toast.success("Successfully Logged In!");

    dispatch(loginSuccess(data));
  } catch (err) {
    if (!err.response) {
      toast.error("Network error. Please check your internet connection.");
      dispatch(loginFail("Network error. Please check your internet connection."));
    } else {
      const { status, data } = err.response;
      if (status === 400) {
        toast.error(data.message || "Invalid credentials. Please try again.");
      } else if (status === 403) {
        toast.error(data.message || "Invalid device. You cannot use the website on this device.");
      } else if (status === 404) {
        toast.error(data.message || "User does not exist.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      dispatch(loginFail(data.message || "An unexpected error occurred. Please try again."));
    }
  }
};


export const isLogin = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(setIsLoginFalse());
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`https://rakedetection-bakckend.vercel.app/api/v1/user/isLogin`, config);

    if (response.data.success && response.data.isLogin) {
      dispatch(setIsLoginTrue());
      dispatch(loginSuccess(response.data.user));
    } else {
      dispatch(setIsLoginFalse());
    }
  } catch (err) {
    if (!err.response) {
      // Network error
      toast.error("Network error. Please check your internet connection.");
      console.error("Network error checking login status:", err);
    } else {
      const { status, data } = err.response;
      if (status === 401 || status === 403) {
        toast.error("Session expired or unauthorized access. Please log in again.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(data.message || "An unexpected error occurred. Please try again.");
      }
      console.error("Error checking login status:", err);
    }
    dispatch(setIsLoginFalse());
  }
};

