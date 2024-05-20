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
async function deletePost(
  id: string,
  post: ImagesProps,
  setState: React.Dispatch<React.SetStateAction<ButtonStates>>
) {
  const token = getCookieByName("access_token");
  if (document.cookie) {
    setState("removing");
    console.log("REMOVE");
    const response = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collection`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify({ token: token })}`,
        },
        body: JSON.stringify({
          id_collection: id,
          url: post.file_url,
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.data));
      STORE_user.set(data.data);
      Alert("bottom", 3000, "success", "Saved", `Image was removed`);
      setState("save");
    }
    // setState("save");
    // localStorage.setItem("user", JSON.stringify(data.data));
    // setCollections(data.data.collections);

    // const response = await fetch(
    //   `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collection`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${JSON.stringify({ token: token })}`,
    //     },
    //     body: JSON.stringify({ id: id, image: post }),
    //   }
    // );
    // const data = (await response.json()) as {
    //   data: UserProps;
    //   success: boolean;
    //   message?: string;
    //   direction: { name: string; id: string };
    // };
    // if (data.success) {
    //   console.log(data)
    //   localStorage.setItem("user", JSON.stringify(data.data));
    //   STORE_user.set(data.data);
    //   Alert(
    //     "bottom",
    //     3000,
    //     "success",
    //     "Saved",
    //     `Image was saved in:${data.direction.name} `
    //   );
    //   setState("saved");
    // } else {
    //   Alert("bottom", 3000, "error", "Error when saving", `${data.message}`);
    //   setState("save");
    // }
  }
}

export default deletePost;

// async function handleRemove(id: string): Promise<void> {
//     setIsLoading("removing");
//     if (document.cookie) {
//       const token = obtenerCookies();
//       const fileUrl = data?.file_url;
//       const resp = await fetch(
//         `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collection`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${JSON.stringify(token)}`,
//           },
//           body: JSON.stringify({
//             id_collection: id,
//             url: fileUrl,
//           }),
//         }
//       );
//       const response = await resp.json();
//       // console.log(response);
//       if (response.success) {
//         async function getProfile() {
//           const res = await fetch(
//             `${import.meta.env.PUBLIC_SERVER_URL}/api/user/profile`,
//             {
//               method: "GET",
//               headers: {
//                 Authorization: `Bearer ${JSON.stringify(token)}`,
//               },
//             }
//           );
//           const data = await res.json();
//           localStorage.setItem("user", JSON.stringify(data.data));
//           setCollections(data.data.collections);
//           // console.log("SE ACTUALIZO EL LOCAL STORAGE DE USER");
//         }
//         getProfile();
//         setIsLoading("false");
//       } else {
//         alert(response.message);
//         setIsLoading("true");
//       }
//     }
//   }
