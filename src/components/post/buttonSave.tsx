import { useEffect, useState } from "react";
import type { ImagesProps } from "./../../types/ImagesProps";
import savePost from "../../api/user/post/savePost";
import deletePost from "../../api/user/post/deletePost";
import { useStore } from "@nanostores/react";
import { STORE_defaultCollection, STORE_user } from "../../store/userStore";
import type { Collection, UserProps } from "../../types/UserProps";

type ButtonStates = "save" | "saving" | "saved" | "removing";

function ButtonSave({ id, post }: { id: string; post: ImagesProps }) {
  const [state, setState] = useState<ButtonStates>("save");
  const $user = useStore(STORE_user) as UserProps;
  const $defaultCollection = useStore(STORE_defaultCollection) as Collection;

  let buttonContent;
  let styleButton;
  switch (state) {
    case "save":
      buttonContent = "Save";
      styleButton = { backgroundColor: "#007bff", color: "white" };
      break;
    case "saving":
      buttonContent = "...Saving";
      styleButton = { backgroundColor: "#5F6064", color: "white" };
      break;
    case "saved":
      buttonContent = "Saved";
      styleButton = { backgroundColor: "#5F6064", color: "white" };
      break;
    case "removing":
      buttonContent = "...Removing";
      styleButton = { backgroundColor: "#5F6064", color: "white" };
      break;
    default:
      buttonContent = "Save";
      styleButton = { backgroundColor: "#5F6064", color: "white" };
      break;
  }
  useEffect(() => {
    if (!$user) return;
  
    const collection = $user.collections.find((item) => item._id === id);
    if (!collection) return;
  
    const isImageSaved = collection.images.some((image) => image.file_url === post.file_url);
    setState(isImageSaved ? "saved" : "save");
  }, [$user, id, post.file_url, $defaultCollection]);
  

  return (
    <button
      style={styleButton}
      className="rounded-full px-4 py-2 flex justify-center items-center font-semibold text-white capitalize"
      disabled={state === "saving" || state === "removing"} // Deshabilitar el botón durante las operaciones asincrónicas
      onClick={() => {
        if (state === "save") {
          savePost(id, post, setState);
        }
        if (state === "saved") {
          deletePost(id, post, setState);
        }
      }}
    >
      {buttonContent}
    </button>
  );
}

export default ButtonSave;
