import { STORE_global_default_extension } from "../../../store/userStore";
import DropdownContainer from "../../../components/global-react/dropdownContainer";
import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";

type ListItem = {
  name: string;
  nsfw: boolean;
};

const items = [
  { name: "safebooru", icon: "/icons/safebooru.ico", nsfw: false },
  { name: "rule34", icon: "/icons/rule34.ico", nsfw: true },
  { name: "realbooru", icon: "/icons/realbooru.ico", nsfw: true },
  { name: "gelbooru", icon: "/icons/gelbooru.ico", nsfw: true },
];

function SelectExtensions({
  setRecommendation,
}: {
  setRecommendation: React.Dispatch<
    React.SetStateAction<
      | []
      | {
          name: string;
          url: string;
          image: string;
        }[]
    >
  >;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [checkedIndex, setCheckedIndex] = useState<number | null>(null);
  const $default_extension = useStore(STORE_global_default_extension);
  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (selectedIndex === null) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex! + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prevIndex) => (prevIndex! - 1 + items.length) % items.length
      );
    } else if (e.key === "Enter") {
      setCheckedIndex(selectedIndex);
      STORE_global_default_extension.set(items[selectedIndex].name)
    }
  };

  const handleClick = (index: number) => {
    setCheckedIndex(index);
    setSelectedIndex(index);
    STORE_global_default_extension.set(items[index].name);
    localStorage.setItem("default_extension", items[index].name);
  };

  const handleButtonClick = () => {
    // Cuando se hace clic en el botón, enfoca el ul
    setTimeout(() => {
      listRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (localStorage.getItem("default_extension")) {
      const local_extension = localStorage.getItem("default_extension");
      const index = items.findIndex((item) => item.name === local_extension);
      setCheckedIndex(index);
      setSelectedIndex(index);
    } else {
      const index = items.findIndex((item) => item.name === $default_extension);
      setCheckedIndex(index);
      setSelectedIndex(index);
    }
  }, []);
  useEffect(()=>{
    setRecommendation([])
  },[checkedIndex])
  return (
    <DropdownContainer
      position="bottom-right"
      classNamePather="w-fit flex h-full z-10 relative"
      dropdownContent={
        <ul
          id="list"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          ref={listRef} // Asigna el ref al ul
          className="outline-none bg-white/70 dark:bg-black/70 backdrop-blur-2xl ring-2 rounded-lg mt-2 overflow-hidden min-w-[190px] relative z-20"
        >
          {items.map((item, index) => (
            <li
              key={index}
              className={`p-4 cursor-pointer flex gap-2 items-center capitalize font-ui text-sm dark:text-white
              ${selectedIndex === index ? "bg-white/80 dark:bg-black/80" : ""} 
              ${
                selectedIndex !== index &&
                "hover:bg-white/60 dark:hover:bg-black/60"
              }`}
              onClick={() => handleClick(index)}
            >
              <img
                className="w-4 h-4 min-h-4 min-w-4"
                src={items[index].icon}
                alt="icon"
              />
              {item.name}
              {checkedIndex === index && (
                <svg
                  className="ml-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2rem"
                  height="1.2rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      }
    >
      <div
        className="flex h-full items-center gap-2 select-none w-full bg-neutral-200 dark:bg-neutral-900 dark:text-white  px-4 rounded-full"
        onClick={(e) => {
          // e.stopPropagation()
          handleButtonClick();
        }} // Asegura que el botón maneje el click
      >
        <img
          className="w-4 h-4 min-h-4 min-w-4"
          src={`/icons/${$default_extension}.ico`}
          alt="icon"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M3 6h18M3 12h18M3 18h18"
          ></path>
        </svg>
      </div>
    </DropdownContainer>
  );
}

export default SelectExtensions;
