import { useEffect, useState } from "react";
import type { ImagesProps } from "../types/ImagesProps";
import type { Collection } from "../types/UserProps";
import handleSave from "../api/user/post/savePost";

type ButtonStates = "false" | "saving" | "removing" | "true";

interface SaveButtonProps {
  // handleSave: (some: string) => Promise<void>;
  handleRemove: (some: string) => Promise<void>;
  setCollections: React.Dispatch<React.SetStateAction<Collection[] | null>>;
  defaultCollection: Collection;
  isLoading: ButtonStates;
  setDefaultCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
  data: ImagesProps;
  setIsLoading: React.Dispatch<React.SetStateAction<ButtonStates>>;
  // setIsLoading: (state: ButtonStates) => void;
}
function SaveButton({
  // handleSave,
  handleRemove,
  defaultCollection,
  isLoading,
  setCollections,
  setIsLoading,
  setDefaultCollection,
  data
  // setIsLoading,
}: SaveButtonProps) {

useEffect(()=>{},[isLoading])
  if (isLoading === "false") {
    return (
      <button
        className="bg-red-500 rounded-full px-4 py-3 flex justify-center items-center font-semibold text-white"
        onClick={() => {
          handleSave(defaultCollection._id,setIsLoading,setCollections,data);
        }}
      >
        Save
      </button>
    );
  }
  if (isLoading === "saving") {
    return (
      <button className="bg-neutral-900 dark:bg-neutral-800 rounded-full px-4 py-3 flex justify-center items-center font-semibold text-white">
        Saving...
      </button>
    );
  }
  if (isLoading === "removing") {
    return (
      <button className="bg-neutral-900 dark:bg-neutral-800 rounded-full px-4 py-3 flex justify-center items-center font-semibold text-white">
        Removing...
      </button>
    );
  }
  if (isLoading === "true") {
    return (
      <button
        className="bg-neutral-900 dark:bg-neutral-800 rounded-full px-4 py-3 flex justify-center items-center font-semibold text-white"
        onClick={() => {
          handleRemove(defaultCollection._id);
        }}
      >
        Saved
      </button>
    );
  }
}

export default SaveButton;
