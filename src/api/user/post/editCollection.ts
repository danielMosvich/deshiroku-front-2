import { STORE_user } from "../../../store/userStore";
import getCookieByName from "../../../helpers/getCookieByName";
import Alert from "../../../components/global-native/alert";

async function editCollection(id: string, name: string) {
  let token;
  //   const name = encodeURIComponent(name)
  if (getCookieByName("access_token")) token = getCookieByName("access_token");
  if (getCookieByName("refresh_token"))
    token = getCookieByName("refresh_token");
  if (!token) {
    return { success: false, data: null, message: "cookies is not there" };
  }
  try {
    const url = import.meta.env.PUBLIC_SERVER_URL;
    const response = await fetch(`${url}/api/user/collections`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${JSON.stringify({ token: token })}`,
      },
      body: JSON.stringify({
        name: name,
        id: id,
      }),
    });
    const data = await response.json();
    if (data.success) {
      const user = data.data;
      localStorage.setItem("user", JSON.stringify(user));
      STORE_user.set(user);
      const currentUser = window.location.pathname.split("/")[1];
      window.history.replaceState({}, "", `/${currentUser}/${name}`);
      window.location.reload();
      Alert(
        "bottom",
        3000,
        "success",
        `the collection was edited`,
        `was edited by ${name}`
      );
    } else {
      Alert(
        "bottom",
        3000,
        "error",
        `Error editing the collection`,
        `${data.message}`
      );
      return data;
    }
  } catch (error) {}
}
export default editCollection;
