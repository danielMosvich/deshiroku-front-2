import type { ImagesProps } from "../../../types/ImagesProps";
import getCookieByName from "../../../helpers/getCookieByName";
import type { Collection, UserProps } from "../../../types/UserProps";
import Alert from "../../../components/global-native/alert";
import { STORE_user } from "../../../store/userStore";

/**
 * Save an image in a collection (cookie needed).
 *
 * @param id - collection id
 * @param setIsLoading - setter for states between false | saving | removing | true
 * @param setCollections - setter for collections
 * @param data - ImagesArray (post data)
 */
type ButtonStates = "save" | "saving" | "saved" | "removing";
async function savePost(
  id: string,
  post: ImagesProps,
  setState: React.Dispatch<React.SetStateAction<ButtonStates>>
) {
  const token = getCookieByName("access_token");
  if (document.cookie) {
    setState("saving");
    const response = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collection`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify({ token: token })}`,
        },
        body: JSON.stringify({ id: id, image: post }),
      }
    );
    const data = (await response.json()) as {
      data: UserProps;
      success: boolean;
      message?: string;
      direction: { name: string; id: string };
    };
    if (data.success) {
      // console.log(data)
      localStorage.setItem("user", JSON.stringify(data.data));
      STORE_user.set(data.data);
      Alert(
        "bottom",
        3000,
        "success",
        "Saved",
        `Image was saved in: ${data.direction.name} `
      );
      setState("saved");
    } else {
      Alert("bottom", 3000, "error", "Error when saving", `${data.message}`);
      setState("save");
    }
  }
}

export default savePost;
