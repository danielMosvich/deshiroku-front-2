// TYPES TAGS
//               0 = general
//               1 = artist
//               3 = Copyright
//               4 = character
//               5 = meta

import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import TagButton from "./header/TagButton";
// import DropDown from "./global-react/dropDown";
import FilterButton from "./header/filterButton";
import MagicButtons from "./header/magicButtons";
interface tagProps {
  label: string;
  value: string;
  type: string;
}
type RatingTypes =
  | "all"
  | "safe"
  | "general"
  | "sensitive"
  | "questionable"
  | "explicit";
interface FilterParams {
  sort: { q: string; type: string; order: string };
  score: {
    value: number;
  };
  rating: RatingTypes;
}

interface QueryParams {
  tags: tagProps[];
  filter: FilterParams;
}
// import React, { useEffect, useRef, useState } from "react";
// import type { AutocompleteProps } from "../types/autocompleteProps";
// function Searcher() {
//   const [inputValue, setInputValue] = useState("");
//   const [extension, setExtension] = useState<string | null>(null);
//   const [resultsBySearch, setResultsBySearch] = useState<
//     null | AutocompleteProps[]
//   >(null);
//   const [active, setActive] = useState<boolean>(false);
//   const [tags, setTags] = useState<AutocompleteProps[]>([]);
//   const inputRef = useRef<HTMLInputElement>(null);

//   async function handleInput(e: React.FormEvent<HTMLInputElement>) {
//     if (extension) {
//       const input_value = e.currentTarget.value;
//       setInputValue(input_value);
//       if (input_value !== "") {
//         console.log(e.currentTarget.value);
//         try {
//           const response = await fetch(
//             `${import.meta.env.PUBLIC_SERVER_URL}/api/deshiroku/${extension}/autocomplete/${input_value}`
//           );
//           const json = await response.json();
//           // console.log(json);
//           if (json.success) {
//             setResultsBySearch(json.data);
//           }
//         } catch (error) {}
//       } else {
//         setResultsBySearch(null);
//       }
//     }
//   }
//   function getTagStyle(type: string) {
//     // const typeNumber = Number(type);
//     // console.log(type);
//     if (type === "general") {
//       return "text-blue-500 bg-blue-100 ring-1 ring-blue-400";
//     }
//     if (type === "artist") {
//       return "text-rose-500 bg-rose-100 ring-1 ring-rose-400";
//     }
//     if (type === "copyright") {
//       return "text-purple-500 bg-purple-100 ring-1 ring-purple-400";
//     }
//     if (type === "character") {
//       return "text-lime-600 bg-lime-100 ring-1 ring-lime-500";
//     }
//     if (type === "meta") {
//       return "text-amber-500 bg-amber-100 ring-1 ring-amber-400";
//     }
//     if (type === "metadata") {
//       return "text-amber-500 bg-amber-100 ring-1 ring-amber-400";
//     }
//   }
//   useEffect(() => {
//     // const input_search = document.querySelector("#input_search");
//     const extensionsArray = ["rule34", "realbooru", "safebooru","gelbooru"];
//     const currentURL = window.location.href;
//     const url = new URL(currentURL);
//     const pathname = url.pathname;
//     const parts = pathname.split("/");
//     const extension =
//       extensionsArray.find((ext) => parts.includes(ext)) || null;
//     setExtension(extension);
//   }, []);
//   useEffect(() => {
//     if (resultsBySearch !== null) {
//       setActive(true);
//     } else {
//       setActive(false);
//     }
//   }, [resultsBySearch]);
//   useEffect(() => {
//     const url = new URL(window.location.href);

//     // Obtener los fragmentos de la URL
//     const pathnameParts = url.pathname.split("/");

//     // El primer fragmento después del dominio es "extensions"
//     const containsSearch = pathnameParts.includes("search");
//     if (containsSearch) {
//       const tags = [];
//       const urlParts = window.location.href.split("/");
//       const lastPart = urlParts[urlParts.length - 1];
//       const tagsSplit = lastPart.split("&");
//       const tagsObj = tagsSplit.map((tag: string) => {
//         const uwu = tag.split("?");
//         return {
//           type: uwu[0],
//           value: uwu[1],
//         };
//       });
//       console.log(tagsObj);
//       setTags(tagsObj);
//     }
//   }, []);
//   return (
//     <div className="flex w-full relative ">
//       <div
//         className={`pl-3 pr-1 bg-neutral-200 gap-2 rounded-full w-full flex h-12 items-center relative ${
//           active && " ring-2 ring-blue-400"
//         } z-[41]`}
//       >
//         <i className="text-neutral-500">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="1.5rem"
//             height="1.5rem"
//             viewBox="0 0 24 24"
//           >
//             <path
//               fill="currentColor"
//               d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396l1.414-1.414l-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8s3.589 8 8 8m0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6s-6-2.691-6-6s2.691-6 6-6"
//             ></path>
//           </svg>
//         </i>
//         {tags && (
//           <div className="flex gap-2">
//             {tags.map((e, i) => (
//               <div
//                 key={i}
//                 className=" cursor-pointer font-semibold flex items-center whitespace-nowrap text-ellipsis"
//               >
//                 <label
//                   className={`cursor-pointer px-3 py-1 rounded-full ${getTagStyle(
//                     e.type
//                   )} flex gap-2 items-center`}
//                 >
//                   {e.value}
//                   <i
//                     className="mt-[2px]"
//                     onClick={() => {
//                       const newTags = tags.filter((el) => el.value !== e.value);
//                       setTags(newTags);
//                       if (inputRef.current) {
//                         inputRef.current.focus();
//                       }
//                     }}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="1.2rem"
//                       height="1.2rem"
//                       viewBox="0 0 36 36"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m8 22.1a1.4 1.4 0 0 1-2 2l-6-6l-6 6.02a1.4 1.4 0 1 1-2-2l6-6.04l-6.17-6.22a1.4 1.4 0 1 1 2-2L18 16.1l6.17-6.17a1.4 1.4 0 1 1 2 2L20 18.08Z"
//                         className="clr-i-solid clr-i-solid-path-1"
//                       />
//                       <path fill="none" d="M0 0h36v36H0z" />
//                     </svg>
//                   </i>
//                 </label>
//               </div>
//             ))}
//           </div>
//         )}
//         <input
//           ref={inputRef}
//           value={inputValue}
//           onInput={(e) => {
//             handleInput(e);
//           }}
//           onKeyUp={(e) => {
//             if (e.key === "Enter") {
//               console.log("REDIRECT TO SEARCH");
//               // const tagHash = JSON.stringify(tags.map((e) => e));
//               const tagHash = tags
//                 .map((e) => {
//                   return `${e.type}?${e.value}`;
//                 })
//                 .join("&");
//               // console.log(tagHash.join("&"));
//               window.location.href = `/extensions/${extension}/search/${tagHash}`;
//             }
//           }}
//           onFocus={() => setActive(true)}
//           // onBlur={() => setActive(false)}
//           type="text"
//           placeholder={tags.length > 0 ? "" : "Buscar"}
//           className={`bg-transparent w-full h-full placeholder:capitalize placeholder:text-neutral-500 outline-none`}
//         />
//         {tags.length > 0 && (
//           <i
//             className="text-neutral-700 mr-2"
//             onClick={() => {
//               setActive(false);
//               setTags([]);
//               setResultsBySearch(null);
//               setInputValue("");
//               window.location.href = `/extensions/${extension}`;
//             }}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="1.5rem"
//               height="1.5rem"
//               viewBox="0 0 36 36"
//             >
//               <path
//                 fill="currentColor"
//                 d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m8 22.1a1.4 1.4 0 0 1-2 2l-6-6l-6 6.02a1.4 1.4 0 1 1-2-2l6-6.04l-6.17-6.22a1.4 1.4 0 1 1 2-2L18 16.1l6.17-6.17a1.4 1.4 0 1 1 2 2L20 18.08Z"
//                 className="clr-i-solid clr-i-solid-path-1"
//               />
//               <path fill="none" d="M0 0h36v36H0z" />
//             </svg>
//           </i>
//         )}
//         {tags.length > 0 && (
//           <button
//             onClick={() => {
//               const tagHash = tags
//                 .map((e) => {
//                   return `${e.type}?${e.value}`;
//                 })
//                 .join("&");
//               // console.log(tagHash.join("&"));
//               window.location.href = `/extensions/${extension}/search/${tagHash}`;
//             }}
//             className="capitalize bg-rose-500 px-4 py-2 rounded-full font-semibold text-white"
//           >
//             buscar
//           </button>
//         )}
//       </div>
//       {/* popover */}
//       {active && resultsBySearch && (
//         <div className="bg-white absolute backdrop-blur-lg left-0 top-[50%] pb-5 pt-10 w-full rounded-xl overflow-hidden shadow-xl z-40">
//           {resultsBySearch.map((element, index) => {
//             return (
//               <div
//                 key={index}
//                 className="hover:bg-neutral-200 px-5 py-2 cursor-pointer font-semibold text-neutral-800 flex items-center gap-2"
//               >
//                 <label
//                   onClick={() => {
//                     if (!tags.some((el) => el.value === element.value)) {
//                       setTags((prev) => [...prev, element]);
//                       setInputValue("");
//                       setResultsBySearch(null);
//                       if (inputRef.current) {
//                         inputRef.current.focus();
//                       }
//                       // localStorage.setItem(
//                       //   "tags",
//                       //   JSON.stringify([...tags, element])
//                       // );
//                     } else {
//                       alert("este tag ya esta agregado >:c");
//                     }
//                   }}
//                   className={`cursor-pointer px-3 py-1 rounded-full ${getTagStyle(
//                     element.type
//                   )} flex gap-2 items-center`}
//                 >
//                   {element.label}
//                   <i className="">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="1.5rem"
//                       height="1.5rem"
//                       viewBox="0 0 512 512"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m80 224h-64v64a16 16 0 0 1-32 0v-64h-64a16 16 0 0 1 0-32h64v-64a16 16 0 0 1 32 0v64h64a16 16 0 0 1 0 32"
//                       />
//                     </svg>
//                   </i>
//                 </label>
//               </div>
//             );
//           })}
//         </div>
//       )}
//       {active && (
//         <div
//           onClick={() => setActive(false)}
//           className="w-full h-screen fixed left-0 top-0 z-30"
//         ></div>
//       )}
//     </div>
//   );
// }
// export default Searcher;
function Searcher() {
  const [active, setActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<null | tagProps[]>(null);
  const [selectedTags, setSelectedTags] = useState<tagProps[]>([]);
  const [localStorageTags, setLocalStorageTags] = useState([]);
  const [extension, setExtension] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [filters, setFilters] = useState<null | FilterParams>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cardsTags = [
    {
      extension: "realbooru",
      tags: [
        {
          name: "most popular",
          image_url:
            "https://realbooru.com//images/af/4b/af4b6378b651e06ddaac2d132efd9289.jpeg",
          url: `/extensions/${extension}/search/filter=%7B"sort"%3A%7B"q"%3A"sort"%2C"type"%3A"score"%2C"order"%3A"desc"%7D%2C"score"%3A%7B"value"%3A0%7D%2C"rating"%3A"all"%7D`,
        },
        {
          name: "popular week",
          image_url:
            "https://realbooru.com//images/99/bc/99bcb28993667683a40ea29ec80ccff2.png",
          url: `/extensions/${extension}/search/filter=%7B"sort"%3A%7B"q"%3A"sort"%2C"type"%3A"updated"%2C"order"%3A"desc"%7D%2C"score"%3A%7B"value"%3A100%7D%2C"rating"%3A"all"%7D`,
        },
        {
          name: "animated",
          image_url:
            "https://realbooru.com/images/68/a5/68a5c088791782328b2b8b7a89463437.gif",
          url: `/extensions/${extension}/search/tags=%5B%7B"label"%3A"animated%20(24913)"%2C"value"%3A"animated"%2C"type"%3A"general"%7D%5D&filter=%7B"sort"%3A%7B"q"%3A"sort"%2C"type"%3A"updated"%2C"order"%3A"desc"%7D%2C"score"%3A%7B"value"%3A0%7D%2C"rating"%3A"all"%7D`,
        },
        {
          name: "cosplay",
          image_url:
            "https://realbooru.com//images/84/59/845922c76570f06b8f3925d6d4ff27b5.jpeg",
          url: `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22cosplay%20(53702)%22%2C%22value%22%3A%22cosplay%22%2C%22type%22%3A%22general%22%7D%5D&filter=%7B%22sort%22%3A%7B%22q%22%3A%22sort%22%2C%22type%22%3A%22updated%22%2C%22order%22%3A%22desc%22%7D%2C%22score%22%3A%7B%22value%22%3A0%7D%2C%22rating%22%3A%22all%22%7D`,
        },
        {
          name: "watermark",
          image_url:
            "https://realbooru.com//images/02/a9/02a94b1810e70e09ecb72a177eb5d30a.jpeg",
          url: `/extensions/${extension}/search/tags=%5B%7B"label"%3A"watermark%20(411299)"%2C"value"%3A"watermark"%2C"type"%3A"general"%7D%5D&filter=%7B"sort"%3A%7B"q"%3A"sort"%2C"type"%3A"updated"%2C"order"%3A"desc"%7D%2C"score"%3A%7B"value"%3A0%7D%2C"rating"%3A"all"%7D`,
        },
      ],
    },
    {
      extension: "rule34",
      tags: [
        {
          name: "most popular",
          image_url:
            "https://api-cdn.rule34.xxx/images/3074/c1f93eeaeed32886fb954475d085b290.png",
          url: `/extensions/${extension}/search/filter=%7B"sort"%3A%7B"q"%3A"sort"%2C"type"%3A"score"%2C"order"%3A"desc"%7D%2C"score"%3A%7B"value"%3A0%7D%2C"rating"%3A"all"%7D`,
        },
        {
          name: "popular week",
          image_url:
            "https://api-cdn.rule34.xxx/images/1806/1f71154017758ca71910821161c00ab6.png",
          url: `/extensions/${extension}/search/filter=%7B"sort"%3A%7B"q"%3A"sort"%2C"type"%3A"updated"%2C"order"%3A"desc"%7D%2C"score"%3A%7B"value"%3A100%7D%2C"rating"%3A"all"%7D`,
        },
        {
          name: "animated",
          image_url:
            "https://api-cdn.rule34.xxx/images/6720/3e601453fffc93b84e4378f77be8b837.gif",
          url: `/extensions/${extension}/search/tags=%5B%7B"label"%3A"animated%20(24913)"%2C"value"%3A"animated"%2C"type"%3A"general"%7D%5D&filter=%7B"sort"%3A%7B"q"%3A"sort"%2C"type"%3A"updated"%2C"order"%3A"desc"%7D%2C"score"%3A%7B"value"%3A0%7D%2C"rating"%3A"all"%7D`,
        },
        {
          name: "cosplay",
          image_url:
            "https://api-cdn.rule34.xxx/images/2068/9cbce4243824a53128f94b83c825d7ca.jpeg",
          url: `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22cosplay%20(53702)%22%2C%22value%22%3A%22cosplay%22%2C%22type%22%3A%22general%22%7D%5D&filter=%7B%22sort%22%3A%7B%22q%22%3A%22sort%22%2C%22type%22%3A%22updated%22%2C%22order%22%3A%22desc%22%7D%2C%22score%22%3A%7B%22value%22%3A0%7D%2C%22rating%22%3A%22all%22%7D`,
        },
        {
          name: "watermark",
          image_url:
            "https://api-cdn.rule34.xxx/images/281/1a10d0210f7266486861b5f458182df3.png",
          url: `/extensions/${extension}/search/tags=%5B%7B"label"%3A"watermark%20(411299)"%2C"value"%3A"watermark"%2C"type"%3A"general"%7D%5D&filter=%7B"sort"%3A%7B"q"%3A"sort"%2C"type"%3A"updated"%2C"order"%3A"desc"%7D%2C"score"%3A%7B"value"%3A0%7D%2C"rating"%3A"all"%7D`,
        },
      ],
    },
  ];

  const getTags = async (query: string) => {
    if (query !== "") {
      console.log(query);
      try {
        const response = await fetch(
          `${
            import.meta.env.PUBLIC_SERVER_URL
          }/api/deshiroku/${extension}/autocomplete/${query}`
        );
        const data = await response.json();
        if (data.success) {
          setTags(data.data);
        }
      } catch (error) {}
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault(); // Evitar que se inserte el espacio
      setInputValue((prev) => prev + "_");
    }
    // agregar el tag con enter
    if (e.key === "Enter") {
      // e.preventDefault(); // Evitar que se inserte el espacio
      console.log(inputValue);
      setSelectedTags((prev) => [
        ...prev,
        { label: inputValue, type: "general", value: inputValue },
      ]);
      setInputValue("");
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
    getTags(e.currentTarget.value);
  };

  const addTag = (item: tagProps) => {
    setSelectedTags((prev) => [...prev, item]);
  };
  const removeTag = (value: string) => {
    const newArrayTags = selectedTags.filter((item) => item.value !== value);
    setSelectedTags(newArrayTags);
  };
  const handleActive = () => {
    console.log(active);
    setActive((prev) => !prev);
  };

  const handleGo = () => {
    if (extension) {
      const queryParams: QueryParams = {
        tags: selectedTags,
        filter: {
          sort: { q: "sort", type: "updated", order: "desc" },
          score: { value: 0 },
          rating: "all",
        },
      };

      const queryString = Object.keys(queryParams)
        .map((key: string) => {
          const encodedValue = encodeURIComponent(
            JSON.stringify(queryParams[key as keyof QueryParams])
          );
          return `${encodeURIComponent(key)}=${encodedValue}`;
        })
        .join("&");

      if (queryString) {
        setFilters(queryParams.filter);
        window.location.href = `/extensions/${extension}/search/${queryString}`;
      }
    }
  };
  const typesTagsTransform = (type: string): number => {
    // console.log(type)
    // if(type === "1") console.log("Xd")
    if (type === "general" || type === "0") return 0;
    if (type === "artist" || type === "1") return 1;
    if (type === "copyrigth" || type === "3") return 3;
    if (type === "character" || type === "4") return 4;
    if (type === "meta" || type === "5") return 5;
    if (type === "metadata" || type === "2") return 5;
    return 0;
  };
  const getParams = () => {
    try {
      const currentUrl = window.location.href;
      const queryString = currentUrl.split("/search/")[1];
      const paramsUri = new URLSearchParams(queryString);
      const tagsString = paramsUri.get("tags") as string;
      const filterString = paramsUri.get("filter") as string;
      const tags = JSON.parse(decodeURIComponent(tagsString));
      const decodedFilterString = decodeURIComponent(filterString);
      const filterParams = JSON.parse(decodedFilterString);
      const params = {
        tags,
        filter: filterParams,
      };
      return params;
    } catch (error) {
      console.log("XD");
    }
  };
  //TODO MAGIC BUTONS EVENT
  // TODO--------------------
  useEffect(() => {
    if (window) {
      const url = window.location.pathname;
      function getExtension() {
        const parts = url.split("/extensions/");
        // console.log(parts)
        if (parts[0] !== "/") {
          const extensionName = parts[1].split("/")[0].trim();
          // console.log(extensionName);
          setExtension(extensionName);
        }
      }
      getExtension();
    }
  }, []);
  useEffect(() => {
    if (localStorage.getItem("tags") && extension) {
      const localStorageTagsParse: {
        extension: string;
        tags: { type: string; value: string; label: string }[];
      }[] = JSON.parse(localStorage.getItem("tags") as string);

      const indexCoincide = localStorageTagsParse.findIndex(
        (item) => item.extension === extension
      );
      if (indexCoincide !== -1) {
        const data = JSON.parse(localStorage.getItem("tags") as string);
        const tags = data.filter(
          (item: any) => item.extension === extension
        )[0];
        setLocalStorageTags(tags.tags);
      }
    }
  }, [extension]);
  // !HOCK PARA OBTENER LAS BUSQUEDAS SI ES QUE ESTAS ESTAN
  useEffect(() => {
    if (window) {
      const urlParts = window.location.href.split("/");
      if (urlParts.some((item) => item === "search")) {
        setIsSearch(true);
        const params = getParams();
        if (params) {
          setSelectedTags(params.tags);
          if (params.filter) {
            setFilters(params.filter);
          } else {
            setFilters({
              sort: {
                q: "sort",
                type: "updated",
                order: "desc",
              },
              score: {
                value: 0,
              },
              rating: "all",
            });
          }
        }
      }
    }
  }, [active]);

  useEffect(() => {}, [filters]);
  //? SI ES QUE EL INPUT ESTA ESCRIBIENDOSE
  if (active) {
    return (
      //? CONTAINER PRINCIPAL
      <div className="w-full relative">
        {/* searcher */}
        <div className="w-full ">
          <div className="rounded-3xl relative">
            <input
              ref={inputRef}
              value={inputValue}
              placeholder="search"
              className="bg-neutral-200 dark:bg-neutral-800 dark:text-white w-full rounded-full px-4 py-3  outline-none placeholder:text-neutral-500 placeholder:font-semibold z-[52] relative"
              type="text"
              onInput={handleChange}
              onKeyDown={handleKeyDown}
            />
            {/* CONTENIDO DE BUSQUEDA DE TAGS O RECOMENDACIONES */}
            {/* ! solo se active si es que el input no tiene nada PARA NO INTERRUMPIR LA BUSQUEDA */}

            <div className="w-full flex flex-col gap-2 p-5 absolute top-0 z-[51] bg-white dark:bg-neutral-900 rounded-3xl pt-14 ring-4">
              {extension && selectedTags && selectedTags.length > 0 && (
                <button
                  onClick={handleGo}
                  className="bg-gradient-to-tr from-rose-500 to-violet-500 shadow-lg shadow-rose-500/20 w-fit mx-auto rounded-full px-4 py-3 text-white font-bold tracking-wider"
                >
                  Search in {extension}
                </button>
              )}
              {selectedTags && selectedTags.length > 0 && (
                <div className="flex flex-col gap-2 overflow-auto">
                  <h2 className="dark:text-white text-lg font-semibold">
                    Selected
                  </h2>
                  <div className="flex flex-row gap-2">
                    {selectedTags.map((item, index) => (
                      <TagButton
                        type={typesTagsTransform(item.type)}
                        flat
                        key={item.label + String(index)}
                        action={() => {
                          removeTag(item.value);
                        }}
                      >
                        {item.value}
                      </TagButton>
                    ))}
                  </div>
                </div>
              )}
              {/* TAG SECTION */}
              {/* BUSQUEdAS RECIENTES */}
              {!inputValue &&
                localStorageTags &&
                localStorageTags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg">
                      Busquedas recientes
                    </h4>
                    <ul className="mt-3 flex gap-2 overflow-auto">
                      {localStorageTags.map(
                        (
                          item: { type: string; value: string; label: string },
                          index
                        ) => (
                          <TagButton
                            action={() => addTag(item)}
                            key={index}
                            type={typesTagsTransform(item.type)}
                          >
                            {item.value}
                            {/* <i
                              className="hover:bg-neutral-400 rounded-full p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStorageTag(item.value);
                              }}
                            >
                              <svg
                                className=""
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 512 512"
                              >
                                <path
                                  d="M437.5 386.6L306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z"
                                  fill="currentColor"
                                />
                              </svg>
                            </i> */}
                          </TagButton>
                        )
                      )}
                    </ul>
                  </div>
                )}
              {/* RECOMENDATIONS SECTION */}
              {!inputValue &&
              extension &&
              cardsTags[
                cardsTags.findIndex((item) => item.extension === extension)
              ] &&
              cardsTags ? (
                selectedTags?.length === 0 && (
                  <div>
                    <h4 className="font-semibold text-lg dark:text-white">
                      Recomendations
                    </h4>
                    <div className="mt-3 grid 2xl:grid-cols-4 xl:grid-cols-3 grid-cols-2 gap-3">
                      {/* SWIPER CONTAINER */}
                      {cardsTags[
                        cardsTags.findIndex(
                          (item) => item.extension === extension
                        )
                      ].tags.map((item, index) => (
                        <a
                          href={item.url}
                          key={index}
                          className="bg-neutral-100 dark:bg-neutral-900 dark:text-white flex gap-5 items-center  w-full h-fit rounded-2xl overflow-hidden hover:brightness-95 dark:hover:brightness-75 cursor-pointer"
                        >
                          <img
                            className="lg:min-w-[110px] lg:max-w-[110px] lg:min-h-[110px] lg:max-h-[110px] 
                            min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px]
                            object-cover "
                            src={item.image_url}
                            alt=""
                          />
                          <p className="font-semibold capitalize text-ellipsis whitespace-nowrap overflow-hidden">
                            {item.name}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                // BUSQUEDA RESULTADOS
                <div>
                  <h2 className="font-semibold text-lg dark:text-white">
                    Results
                  </h2>
                  <ul className="flex flex-col gap-2 mt-3">
                    {tags &&
                      tags.map((item, index) => (
                        <TagButton
                          key={index}
                          type={typesTagsTransform(item.type)}
                          action={() => {
                            addTag(item);
                            setInputValue("");
                          }}
                        >
                          {item.label}
                        </TagButton>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* outside */}
        <div
          className="w-full fixed left-0 top-0 min-h-screen z-[50]"
          onClick={handleActive}
        />
      </div>
    );
  } else {
    // ? SI ES QUE EL INPUT NO ESTA SELECCIONADO  Y SE ESTA HACIENDO OTRA COSA
    return (
      //? CONTAINER PRINCIPAL
      <>
        <div className="cursor-pointer w-full bg-neutral-200 dark:bg-neutral-800   rounded-full overflow-hidden pl-2 flex items-center text-neutral-500">
          <i className="mx-2">
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
          <input
            placeholder={
              selectedTags && selectedTags.length === 0
                ? "Search"
                : selectedTags?.map((item) => item.value).join(" ")
            }
            className={`font-semibold w-full bg-transparent pr-10 py-3 text-black outline-none ${
              selectedTags?.length === 0
                ? "placeholder:text-neutral-500 placeholder:dark:text-neutral-200"
                : "placeholder:text-black placeholder:dark:text-white"
            }`}
            type="text"
            onFocus={() => {
              setActive(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}
            onBlur={() => setActive(false)}
          />
        </div>
        {/* CUANDO SE HACE UNA BUSQUEDA XD */}
        {isSearch && (
          <div className="fixed mt-20 bg-white dark:bg-neutral-950 w-full top-0 left-0 min-h-20 px-10 flex gap-3 items-center z-50">
            <FilterButton
              filters={filters}
              setFilters={setFilters}
              extension={extension}
              selectedTags={selectedTags}
            />
            <div className="flex gap-2">
              {selectedTags &&
                selectedTags.map((item, index) => (
                  <TagButton
                    key={index}
                    flat
                    type={typesTagsTransform(item.type)}
                  >
                    {item.value}
                  </TagButton>
                ))}
            </div>
            {filters && <MagicButtons filters={filters} />}
          </div>
        )}
      </>
    );
  }
}

export default Searcher;
