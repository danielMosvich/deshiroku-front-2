import { STORE_user } from "../../../store/userStore";
import getCookieByName from "../../../helpers/getCookieByName";
import Alert from "../../../components/global-native/alert";

async function deleteColletion(id: string, name?: string) {
  let token;
  if (getCookieByName("access_token")) token = getCookieByName("access_token");
  if (getCookieByName("refresh_token"))
    token = getCookieByName("refresh_token");
  if (!token) {
    return { success: false, data: null, message: "cookies is not there" };
  }
  try {
    const url = import.meta.env.PUBLIC_SERVER_URL;
    const response = await fetch(`${url}/api/user/collections`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.stringify({ token: token })}`,
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const data = (await response.json()) as {
      success: boolean;
      message?: string;
      data: {} | null;
    };
    if (data.success) {
      const user = data.data;
      localStorage.setItem("user", JSON.stringify(user));
      STORE_user.set(user);
      window.history.back();
      Alert(
        "bottom",
        3000,
        "success",
        `the collection was deleted`,
        `${name} was deleted`
      );
    } else {
      Alert("bottom", 3000, "error", "Error deleting collection", data.message);
      return new Error(data.message);
    }
  } catch (error) {
    const message = (error as Error).message;
    Alert("bottom", 3000, "error", "Database error", message);
  }
}
export default deleteColletion;
