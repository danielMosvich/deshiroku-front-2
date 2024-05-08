import { useEffect, useState } from "react";

type ButtonStates = "false" | "saving" | "removing" | "true";

interface SaveButtonProps {
  handleSave: (some: string) => Promise<void>;
  handleRemove: (some: string) => Promise<void>;
  defaultCollection: { name: string; id: string };
  isLoading: ButtonStates;
  // setIsLoading: (state: ButtonStates) => void;
}
function SaveButton({
  handleSave,
  handleRemove,
  defaultCollection,
  isLoading,
  // setIsLoading,
}: SaveButtonProps) {

useEffect(()=>{},[isLoading])
  if (isLoading === "false") {
    return (
      <button
        className="bg-red-500 rounded-full px-4 py-3 flex justify-center items-center font-semibold text-white"
        onClick={() => {
          handleSave(defaultCollection.id);
        }}
      >
        Save
      </button>
    );
  }
  if (isLoading === "saving") {
    return (
      <button className="bg-neutral-900 rounded-full px-4 py-3 flex justify-center items-center font-semibold text-white">
        Saving...
      </button>
    );
  }
  if (isLoading === "removing") {
    return (
      <button className="bg-neutral-900 rounded-full px-4 py-3 flex justify-center items-center font-semibold text-white">
        Removing...
      </button>
    );
  }
  if (isLoading === "true") {
    return (
      <button
        className="bg-neutral-900 rounded-full px-4 py-3 flex justify-center items-center font-semibold text-white"
        onClick={() => {
          handleRemove(defaultCollection.id);
        }}
      >
        Saved
      </button>
    );
  }
}

export default SaveButton;
