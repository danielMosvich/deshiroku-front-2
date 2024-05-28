
import Alert from "../../../components/global-native/alert";
import login from "./login";

/**
 * Register a new user in the server.
 *
 * @param name - full name (optional) but required for the user to be able to login.
 * @param username - username (unique identifier)
 * @param password - password (required)
 */
async function fetchRegisterServer(
  name: string,
  username: string,
  password: string
) {
  const user = {
    name: name.trim(),
    username: username.trim(),
    password: password.trim(),
  };
  if (name === "" || username === "" || password === "") return;
  const url = import.meta.env.PUBLIC_SERVER_URL;
  const response = await fetch(`${url}/api/user/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (data.success) {
    login(username, password);
  } else {
    Alert("bottom", 3000, "error", "Error creating account", data.message);
  }
}

/**
 * Register a new user.
 *
 * @param name - full name (optional) but required for the user to be able to login.
 * @param username - username (unique identifier)
 * @param password - password (required)
 */
async function register(name: string, username: string, password: string) {
  try {
    fetchRegisterServer(name, username, password);
  } catch (error) {
    Alert("bottom", 3000, "error", "Server Error", "Please try again");
  }
}

export default register;
