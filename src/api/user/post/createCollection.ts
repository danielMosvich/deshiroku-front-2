import { useStore } from "@nanostores/react";
import Alert from "../../../components/global-native/alert";
import getCookieByName from "../../../helpers/getCookieByName";
import type { UserProps } from "../../../types/UserProps";
import { STORE_user } from "../../../store/userStore";

async function createCollection(name: string) {
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
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.stringify({ token: token })}`,
      },
      body: JSON.stringify({
        name: name,
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
      Alert(
        "bottom",
        3000,
        "success",
        "Collection created",
        `the collection ${name} was created correctly`
      );
      return data
    } else {
      Alert("bottom", 3000, "error", "Error creating collection", data.message);
      return data;
    }
  } catch (error) {
    const message = (error as Error).message;
    Alert("bottom", 3000, "error", "Database error", message);
  }
}
export default createCollection;
