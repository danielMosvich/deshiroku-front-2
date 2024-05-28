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
import FilterButton from "./header/filterButton";
import MagicButtons from "./header/magicButtons";
import Alert from "./global-native/alert";
import getRecomendations from "../api/search/get/getRecomendations";
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

  const [limitSearch, setLimitSearch] = useState(false);

  const [recommendation, setRecommendation] = useState<
    | null
    | {
        url: string;
        name: string;
        image: string;
      }[]
  >(null);

  const getTags = async (query: string) => {
    if (query !== "") {
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
    }
  };
  //TODO MAGIC BUTONS EVENT
  // TODO--------------------
  useEffect(() => {
    if (window) {
      try {
        const url = window.location.pathname;
        function getExtension() {
          const parts = url.split("/extensions/");
          if (parts[0] !== "/") {
            const extensionName = parts[1].split("/")[0].trim();
            setExtension(extensionName);
          }
        }
        getExtension();
      } catch (error) {
        setLimitSearch(true);
      }
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
  useEffect(() => {
    if (extension) {
      getRecomendations(extension).then((data) => {
        if (data.success) {
          setRecommendation(data.data);
        }
      });
    }
  }, [extension]);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setLimitSearch(true);
    }
  }, []);
  // ! buscador por mientras que no se puede hacer una busqueda global.
  if (limitSearch) {
    return (
      <>
        <div
          onClick={() =>
            Alert(
              "top",
              3000,
              "danger",
              "can't use global search yet",
              "will be added in future versions ^^"
            )
          }
          className="cursor-default w-full bg-neutral-200 dark:bg-neutral-800  h-10 max-h-10  rounded-full overflow-hidden pl-2 flex items-center text-neutral-500"
        >
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
            readOnly
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
      </>
    );
  }
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
              className="bg-neutral-200 dark:bg-neutral-800 dark:text-white w-full rounded-full px-4 py-2  outline-none placeholder:text-neutral-500 placeholder:font-semibold z-[52] relative"
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
              {inputValue === "" ? (
                <div>
                  <h4 className="font-semibold text-lg dark:text-white">
                    Recomendations
                  </h4>
                  <div className="mt-3 grid 2xl:grid-cols-4 xl:grid-cols-3 grid-cols-2 gap-3">
                    {/* SWIPER CONTAINER */}
                    {recommendation &&
                      recommendation.map((item, index) => (
                        <a
                          href={`/extensions/${extension}/search/${item.url}`}
                          key={index}
                          className="bg-neutral-100 dark:bg-neutral-900 dark:text-white flex gap-5 items-center  w-full h-fit rounded-2xl overflow-hidden hover:brightness-95 dark:hover:brightness-75 cursor-pointer"
                        >
                          <img
                            className="lg:min-w-[110px] lg:max-w-[110px] lg:min-h-[110px] lg:max-h-[110px] 
                            min-w-[100px] max-w-[100px] min-h-[100px] max-h-[100px]
                            object-cover "
                            src={item.image}
                            alt=""
                          />
                          <p className="font-semibold capitalize text-ellipsis whitespace-nowrap overflow-hidden">
                            {item.name}
                          </p>
                        </a>
                      ))}
                  </div>
                </div>
              ) : (
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
        <div className="cursor-pointer w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden pl-2 flex items-center text-neutral-500 h-10 max-h-10 ml-2">
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
            className={`font-semibold w-full bg-transparent pr-10 text-black outline-none ${
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
