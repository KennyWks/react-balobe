import axios from "axios";
import { Cookies } from "react-cookie";

const ApiURL = "https://balobe.herokuapp.com";
// const ApiURL = "http://localhost:5000";
const cookie = new Cookies();

function getConfig() {
  const accessToken = cookie.get("accessToken");
  if (accessToken) {
    return {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
  } else {
    return {};
  }
}

export const postData = async (path, data) => {
  try {
    const response = await axios.post(ApiURL + path, data, getConfig());
    return response;
  } catch (error) {
    throw error;
  }
};

export const patchData = async (path, data) => {
  try {
    const response = await axios.patch(ApiURL + path, data, getConfig());
    return response;
  } catch (error) {
    throw error;
  }
};

export const getData = async (path) => {
  try {
    const response = await axios.get(ApiURL + path, getConfig());
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (path) => {
  try {
    const response = await axios.delete(ApiURL + path, getConfig());
    return response;
  } catch (error) {
    throw error;
  }
};
