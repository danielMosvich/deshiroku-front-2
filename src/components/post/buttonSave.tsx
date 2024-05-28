import { useEffect, useState } from "react";
import type { ImagesProps } from "./../../types/ImagesProps";
import savePost from "../../api/user/post/savePost";
import deletePost from "../../api/user/post/deletePost";
import { useStore } from "@nanostores/react";
import { STORE_defaultCollection, STORE_user } from "../../store/userStore";
import type { Collection, UserProps } from "../../types/UserProps";

type ButtonStates = "save" | "saving" | "saved" | "removing";

function ButtonSave({
  id,
  post,
  isContainer,
  children,
}: {
  id: string;
  post: ImagesProps;
  isContainer?: boolean;
  children?: React.ReactNode;
}) {
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
      buttonContent = "..Saving";
      styleButton = { backgroundColor: "#5F6064", color: "white" };
      break;
    case "saved":
      buttonContent = "Saved";
      styleButton = { backgroundColor: "#5F6064", color: "white" };
      break;
    case "removing":
      buttonContent = "..Removing";
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

    const isImageSaved = collection.images.some(
      (image) => image.file_url === post.file_url
    );
    setState(isImageSaved ? "saved" : "save");
  }, [$user, id, post.file_url, $defaultCollection]);

  if (isContainer) {
    return (
      <div
      className="flex items-center w-full dark:hover:bg-neutral-700 hover:bg-neutral-200 rounded-xl"
        onClick={() => {
          if(state === "saving" || state === "removing") return
          if (state === "save") {
            savePost(id, post, setState);
          }
          if (state === "saved") {
            deletePost(id, post, setState);
          }
        }}
      >
        {children}
        <button
          
          style={styleButton}
          className="rounded-full min-w-24 py-2 flex justify-center items-center font-semibold text-white capitalize ml-auto mr-2"
          disabled={state === "saving" || state === "removing"} // Deshabilitar el botón durante las operaciones asincrónicas
          onClick={(e) => {
            e.stopPropagation();
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
      </div>
    );
  }
  return (
    <button
      style={styleButton}
      className="rounded-full min-w-24 py-2 flex justify-center items-center font-semibold text-white capitalize"
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
