import type { ApiLoginProps } from "../../types/ApiLoginProps";
import Alert from "../../../components/global-native/alert";
import {
  STORE_username,
  STORE_name,
  
  STORE_defaultCollection,
  STORE_auth_modal,
} from "../../../store/userStore";
// import type { TokenProps } from "../../../types/cookieProps";

function transformCookies(name: string, token: string, expires_in: number) {
  const currentTime = new Date(); // <== tiempo actual
  const token_expiration = expires_in; // <== una hora
  const token_expirationDate = new Date(
    currentTime.getTime() + token_expiration
  );
  const token_expirationString = token_expirationDate.toUTCString();
  const access_token = `${name}=${token}; expires=${token_expirationString}; path=/`;
  return access_token;
}
/**
 * Login a user in the server.
 *
 * @param username - username (unique identifier)
 * @param password - password (required)
 */
async function fetchLoginServer(username: string, password: string) {
  const url = import.meta.env.PUBLIC_SERVER_URL;
  const response = await fetch(`${url}/api/user/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.trim(),
      password: password.trim(),
    }),
  });
  const data = (await response.json()) as ApiLoginProps;
  if (data.success && data.data) {
    const cookies = {
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
    };
    const access_token = transformCookies(
      "access_token",
      cookies.access_token.token,
      cookies.access_token.expires_in
    );
    const refresh_token = transformCookies(
      "refresh_token",
      cookies.refresh_token.token,
      cookies.refresh_token.expires_in
    );

    localStorage.setItem(
      "defaultCollection",
      JSON.stringify(data.data.user.collections[0])
    );
    localStorage.setItem("user", JSON.stringify(data.data.user));
    localStorage.setItem(
      "time",
      JSON.stringify({
        expires_in: cookies.access_token.expires_in,
        current_time: new Date().getTime(),
      })
    );
    document.cookie = access_token;
    document.cookie = refresh_token;
    STORE_username.set(data.data.user.username);
    STORE_name.set(data.data.user.name);
    STORE_defaultCollection.set(data.data.user.collections[0]);
    STORE_auth_modal.set(false);
    window.location.reload();

  } else {
    Alert(
      "bottom",
      2000,
      "error",
      "Username / Password is wrong",
      "please try again"
    );
    new Error(data.message);
  }
}
/**
 * Login a user.
 *
 * @param username - username (unique identifier)
 * @param password - password (required)
 */
async function login(username: string, password: string) {
  try {
    fetchLoginServer(username, password);
  } catch (error) {
    if (error instanceof Error) {
      Alert("bottom", 3000, "error", error.name, error.message);
    } else {
      Alert("bottom", 3000, "error", "Server Error", "Please try again");
    }
  }
}

export default login;
