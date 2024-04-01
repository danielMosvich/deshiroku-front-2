// TYPES TAGS
//               0 = general
//               1 = artist
//               3 = Copyright
//               4 = character
//               5 = meta

import React, { useEffect, useRef, useState } from "react";
import type { AutocompleteProps } from "../types/autocompleteProps";
function Searcher() {
  const [inputValue, setInputValue] = useState("");
  const [extension, setExtension] = useState<string | null>(null);
  const [resultsBySearch, setResultsBySearch] = useState<
    null | AutocompleteProps[]
  >(null);
  const [active, setActive] = useState<boolean>(false);
  const [tags, setTags] = useState<AutocompleteProps[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleInput(e: React.FormEvent<HTMLInputElement>) {
    if (extension) {
      const input_value = e.currentTarget.value;
      setInputValue(input_value);
      if (input_value !== "") {
        console.log(e.currentTarget.value);
        try {
          const response = await fetch(
            `${import.meta.env.PUBLIC_SERVER_URL}/api/deshiroku/${extension}/autocomplete/${input_value}`
          );
          const json = await response.json();
          // console.log(json);
          if (json.success) {
            setResultsBySearch(json.data);
          }
        } catch (error) {}
      } else {
        setResultsBySearch(null);
      }
    }
  }
  function getTagStyle(type: string) {
    // const typeNumber = Number(type);
    // console.log(type);
    if (type === "general") {
      return "text-blue-500 bg-blue-100 ring-1 ring-blue-400";
    }
    if (type === "artist") {
      return "text-rose-500 bg-rose-100 ring-1 ring-rose-400";
    }
    if (type === "copyright") {
      return "text-purple-500 bg-purple-100 ring-1 ring-purple-400";
    }
    if (type === "character") {
      return "text-lime-600 bg-lime-100 ring-1 ring-lime-500";
    }
    if (type === "meta") {
      return "text-amber-500 bg-amber-100 ring-1 ring-amber-400";
    }
    if (type === "metadata") {
      return "text-amber-500 bg-amber-100 ring-1 ring-amber-400";
    }
  }
  useEffect(() => {
    // const input_search = document.querySelector("#input_search");
    const extensionsArray = ["rule34", "realbooru", "safebooru","gelbooru"];
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const pathname = url.pathname;
    const parts = pathname.split("/");
    const extension =
      extensionsArray.find((ext) => parts.includes(ext)) || null;
    setExtension(extension);
    // console.log(extension);
    // if (extension) {
    //   console.log(extension);
    //   input_search.addEventListener("input", (e) => {
    //     fetch(
    //       `http://localhost:3000/api/deshiroku/${extension}/autocomplete/${e.target.value}`
    //     )
    //       .then((res) => res.json())
    //       .then((data) => {
    //         console.log(data);
    //       });
    //   });
    // }
  }, []);
  useEffect(() => {
    if (resultsBySearch !== null) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [resultsBySearch]);
  // useEffect(() => {
  //   if (localStorage.getItem("tags")) {
  //     const localTags = JSON.parse(localStorage.getItem("tags") as string);
  //     setTags(localTags)
  //   }
  // }, []);
  useEffect(() => {
    const url = new URL(window.location.href);

    // Obtener los fragmentos de la URL
    const pathnameParts = url.pathname.split("/");

    // El primer fragmento después del dominio es "extensions"
    const containsSearch = pathnameParts.includes("search");
    if (containsSearch) {
      const tags = [];
      const urlParts = window.location.href.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      const tagsSplit = lastPart.split("&");
      const tagsObj = tagsSplit.map((tag: string) => {
        const uwu = tag.split("?");
        return {
          type: uwu[0],
          value: uwu[1],
        };
      });
      console.log(tagsObj);
      setTags(tagsObj);
    }
    // http://localhost:4321/extensions/rule34/search/character?yorha_2b&general?looking_at_viewer&general?anus
  }, []);
  return (
    <div className="flex w-full relative ">
      <div
        className={`pl-3 pr-1 bg-neutral-200 gap-2 rounded-full w-full flex h-12 items-center relative ${
          active && " ring-2 ring-blue-400"
        } z-[41]`}
      >
        <i className="text-neutral-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396l1.414-1.414l-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8s3.589 8 8 8m0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6s-6-2.691-6-6s2.691-6 6-6"
            ></path>
          </svg>
        </i>
        {tags && (
          <div className="flex gap-2">
            {tags.map((e, i) => (
              <div
                key={i}
                className=" cursor-pointer font-semibold flex items-center whitespace-nowrap text-ellipsis"
              >
                <label
                  className={`cursor-pointer px-3 py-1 rounded-full ${getTagStyle(
                    e.type
                  )} flex gap-2 items-center`}
                >
                  {e.value}
                  <i
                    className="mt-[2px]"
                    onClick={() => {
                      const newTags = tags.filter((el) => el.value !== e.value);
                      setTags(newTags);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                      // if(newTags.length > 0){
                      //   localStorage.setItem("tags",JSON.stringify(newTags))
                      // } else{
                      //   localStorage.removeItem("tags")
                      // }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.2rem"
                      height="1.2rem"
                      viewBox="0 0 36 36"
                    >
                      <path
                        fill="currentColor"
                        d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m8 22.1a1.4 1.4 0 0 1-2 2l-6-6l-6 6.02a1.4 1.4 0 1 1-2-2l6-6.04l-6.17-6.22a1.4 1.4 0 1 1 2-2L18 16.1l6.17-6.17a1.4 1.4 0 1 1 2 2L20 18.08Z"
                        className="clr-i-solid clr-i-solid-path-1"
                      />
                      <path fill="none" d="M0 0h36v36H0z" />
                    </svg>
                  </i>
                </label>
              </div>
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          value={inputValue}
          onInput={(e) => {
            handleInput(e);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              console.log("REDIRECT TO SEARCH");
              // const tagHash = JSON.stringify(tags.map((e) => e));
              const tagHash = tags
                .map((e) => {
                  return `${e.type}?${e.value}`;
                })
                .join("&");
              // console.log(tagHash.join("&"));
              window.location.href = `/extensions/${extension}/search/${tagHash}`;
            }
          }}
          onFocus={() => setActive(true)}
          // onBlur={() => setActive(false)}
          type="text"
          placeholder={tags.length > 0 ? "" : "Buscar"}
          className={`bg-transparent w-full h-full placeholder:capitalize placeholder:text-neutral-500 outline-none`}
        />
        {tags.length > 0 && (
          <i
            className="text-neutral-700 mr-2"
            onClick={() => {
              setActive(false);
              setTags([]);
              setResultsBySearch(null);
              setInputValue("");
              window.location.href = `/extensions/${extension}`;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 36 36"
            >
              <path
                fill="currentColor"
                d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m8 22.1a1.4 1.4 0 0 1-2 2l-6-6l-6 6.02a1.4 1.4 0 1 1-2-2l6-6.04l-6.17-6.22a1.4 1.4 0 1 1 2-2L18 16.1l6.17-6.17a1.4 1.4 0 1 1 2 2L20 18.08Z"
                className="clr-i-solid clr-i-solid-path-1"
              />
              <path fill="none" d="M0 0h36v36H0z" />
            </svg>
          </i>
        )}
        {tags.length > 0 && (
          <button
            onClick={() => {
              const tagHash = tags
                .map((e) => {
                  return `${e.type}?${e.value}`;
                })
                .join("&");
              // console.log(tagHash.join("&"));
              window.location.href = `/extensions/${extension}/search/${tagHash}`;
            }}
            className="capitalize bg-rose-500 px-4 py-2 rounded-full font-semibold text-white"
          >
            buscar
          </button>
        )}
      </div>
      {/* popover */}
      {active && resultsBySearch && (
        <div className="bg-white absolute backdrop-blur-lg left-0 top-[50%] pb-5 pt-10 w-full rounded-xl overflow-hidden shadow-xl z-40">
          {resultsBySearch.map((element, index) => {
            return (
              <div
                key={index}
                className="hover:bg-neutral-200 px-5 py-2 cursor-pointer font-semibold text-neutral-800 flex items-center gap-2"
              >
                <label
                  onClick={() => {
                    if (!tags.some((el) => el.value === element.value)) {
                      setTags((prev) => [...prev, element]);
                      setInputValue("");
                      setResultsBySearch(null);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                      // localStorage.setItem(
                      //   "tags",
                      //   JSON.stringify([...tags, element])
                      // );
                    } else {
                      alert("este tag ya esta agregado >:c");
                    }
                  }}
                  className={`cursor-pointer px-3 py-1 rounded-full ${getTagStyle(
                    element.type
                  )} flex gap-2 items-center`}
                >
                  {element.label}
                  <i className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m80 224h-64v64a16 16 0 0 1-32 0v-64h-64a16 16 0 0 1 0-32h64v-64a16 16 0 0 1 32 0v64h64a16 16 0 0 1 0 32"
                      />
                    </svg>
                  </i>
                </label>
              </div>
            );
          })}
        </div>
      )}
      {active && (
        <div
          onClick={() => setActive(false)}
          className="w-full h-screen fixed left-0 top-0 z-30"
        ></div>
      )}
    </div>
  );
}
export default Searcher;
