import ActionType from "./globalActionType";
import { Cookies } from "react-cookie";
import jwtDecode from "jwt-decode";

const globalState = {
  isLogin: false,
  id_user: "",
  username: "",
  role_id: "",
};

// Reducer
const rootReducer = (state = globalState, action) => {
  const cookie = new Cookies();

  const accessToken = cookie.get("accessToken");
  let token = "";
  if (accessToken) {
    token = jwtDecode(accessToken);
  }

  if (action.type === ActionType.IS_LOGIN) {
    return {
      ...state,
      isLogin: true,
      id_user: token.id_user,
      username: token.username,
      role_id: token.role_id,
    };
  }

  if (action.type === ActionType.IS_LOGOUT) {
    cookie.remove("accessToken");
    return {
      ...state,
      isLogin: false,
      id_user: "",
      username: "",
      role_id: "",
    };
  }
  return state;
};

export default rootReducer;
