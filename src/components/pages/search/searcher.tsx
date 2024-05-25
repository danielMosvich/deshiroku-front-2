import { useStore } from "@nanostores/react";
import { useEffect, useRef, useState } from "react";
import { STORE_global_default_extension } from "../../../store/userStore";
import SelectExtensions from "./selectExtensions";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import "./styles.css";
import DropdownContainer from "../../../components/global-react/dropdownContainer";
import TagButton from "../../../components/header/TagButton";
import ModalContainer from "../../../components/global-react/modalContainer";
import typeTagTransform from "../../../helpers/typeTagTransform";
import MyButton from "../../../components/global-react/myButton";
import getRecomendations from "../../../api/search/get/getRecomendations";

interface Tag {
  label: string;
  type: string;
  value: string;
}
function Searcher() {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const $default_extension = useStore(STORE_global_default_extension);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<Tag[]>([]);
  const [tagsSelected, setTagsSelected] = useState<Tag[]>([]);
  const [show, setShow] = useState(false);
  const [recommendation, setRecommendation] = useState<
    | []
    | {
        name: string;
        url: string;
        image: string;
      }[]
  >([]);
  const $STORE_global_default_extension = useStore(
    STORE_global_default_extension
  );
  const getTags = async (query: string) => {
    if (query !== "") {
      try {
        const response = await fetch(
          `${
            import.meta.env.PUBLIC_SERVER_URL
          }/api/deshiroku/${$default_extension}/autocomplete/${query}`
        );
        const data = (await response.json()) as {
          success: boolean;
          data: Tag[];
        };
        if (data.success) {
          setResults(data.data);
        }
      } catch (error) {}
    }
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== "" && value !== " ") {
      getTags(value);
    } else {
      setResults([]);
    }
  };
  const addTag = (tag: Tag) => {
    if (tagsSelected.find((it) => it.label === tag.label)) return;
    setTagsSelected((prev) => [...prev, tag]);
    setInputValue("");
  };
  const removeTag = (tag: Tag) => {
    const newTag = tagsSelected.filter((it) => it.label !== tag.label);
    setTagsSelected(newTag);
  };
  useEffect(() => {
    setTagsSelected([]);
    setInputValue("");
    getRecomendations($STORE_global_default_extension as string).then(
      (data) => {
        if (data.success && data.data) {
          setRecommendation(data.data);
        } else {
          setRecommendation([]);
        }
      }
    );
  }, [$STORE_global_default_extension]);

  const handleGo = () => {
    if (tagsSelected.length === 0) return;
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
    if ($default_extension) {
      const queryParams: QueryParams = {
        tags: tagsSelected,
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
        window.location.href = `/extensions/${$default_extension}/search/${queryString}`;
      }
    }
  };
  useEffect(() => {
    if (tagsSelected.length > 0 && inputValue === "") {
      setResults([]);
    }
  }, [tagsSelected, inputValue]);
  return (
    <>
      <div className="flex items-center relative h-10 rounded-full mx-auto mt-5 gap-2 px-2">
        <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-full rounded-full relative flex items-center">
          <svg
            className="text-neutral-700 z-10 absolute left-3 dark:text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            width="1.3rem"
            height="1.3rem"
            viewBox="0 0 16 16"
          >
            <g fill="currentColor">
              <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018c-5.825-3.764-1.664-6.69 0-5.018"></path>
              <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11"></path>
            </g>
          </svg>
          <input
            readOnly
            onFocus={() => setShow(true)}
            className="w-full h-full rounded-full bg-transparent placeholder:text-neutral-600 dark:placeholder:text-neutral-400 text-sm font-ui font-[500] pl-10 pr-4 outline-none"
            type="text"
            placeholder={`Search in ${$default_extension}`}
          />
        </div>
        {show && (
          <ModalContainer
            height="87%"
            onClose={() => {
              setShow(false);
              setInputValue("");
              setResults([]);
            }}
          >
            <div className="bg-neutral-200 dark:bg-neutral-800 h-10 rounded-full mx-2 mt-3 flex items-center">
              <svg
                className="text-neutral-700 z-10 absolute left-5 dark:text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                width="1.3rem"
                height="1.3rem"
                viewBox="0 0 16 16"
              >
                <g fill="currentColor">
                  <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018c-5.825-3.764-1.664-6.69 0-5.018"></path>
                  <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11"></path>
                </g>
              </svg>
              <input
                value={inputValue}
                ref={inputRef}
                onChange={handleInput}
                onFocus={() => setShow(true)}
                className="w-full h-full rounded-full bg-transparent placeholder:text-neutral-600 text-sm font-ui font-[500] outline-offset-4 outline-sky-500 pl-10 pr-4 dark:placeholder:text-neutral-400 dark:text-white"
                type="text"
                placeholder={`Search`}
              />
            </div>
            {tagsSelected.length > 0 && (
              <div className="">
                <h2 className="text-sm font-semibold px-2 pt-2 dark:text-white">
                  Selected Tags
                </h2>
                <section className="py-1 flex gap-2 overflow-auto px-2">
                  {tagsSelected.map((it, index) => {
                    return (
                      <TagButton
                        action={() => {
                          removeTag(it);
                        }}
                        type={typeTagTransform(it.type)}
                        key={index + "-selected-tag"}
                      >
                        {it.label}
                      </TagButton>
                    );
                  })}
                </section>
              </div>
            )}
            {results.length > 0 && (
              <div className="">
                <h2 className="mx-2 text-sm mt-2 font-semibold dark:text-white">
                  Results
                </h2>
                <div className="flex flex-col gap-2 px-2 mt-2">
                  {results.map((results, index) => {
                    return (
                      <TagButton
                        action={() => {
                          addTag(results);
                        }}
                        type={typeTagTransform(results.type)}
                        key={index + "-tag-selection"}
                      >
                        <div className="flex gap-1 items-center">
                          {results.label}
                          {results.value ===
                            tagsSelected.find(
                              (item) => item.label === results.label
                            )?.value && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 256 256"
                            >
                              <path
                                fill="currentColor"
                                d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32"
                              />
                            </svg>
                          )}
                        </div>
                      </TagButton>
                    );
                  })}
                </div>
              </div>
            )}
            {results.length === 0 && tagsSelected.length === 0 && (
              <div className=" h-full flex  items-center flex-col">
                <h2 className="text-black dark:text-white text-2xl px-2 text-center font-[600] font-ui mt-32 tracking-tight">
                  Search for content with your favorite extension
                </h2>
                <h3 className="text-black/80 dark:text-white/80 text-sm px-2 text-center mt-3">
                  Select your tags and search with the button.
                </h3>
                <p className="text-black/80 dark:text-white/80 text-xs ">
                  Remember that you can only search by tags
                </p>
                <svg
                  className="mt-6 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width="5rem"
                  height="5rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12.75 2a3.25 3.25 0 0 0-2.242.898L3.696 9.395a2.25 2.25 0 0 0-.034 3.223l6.256 6.227a2.25 2.25 0 0 0 3.166.009l6.945-6.835c.621-.61.97-1.445.97-2.316V4.75A2.75 2.75 0 0 0 18.25 2zm3.5 5.75a1.25 1.25 0 1 1 0-2.5a1.25 1.25 0 0 1 0 2.5m3.006 6.433l1.475-1.451q.067-.067.132-.136a2.75 2.75 0 0 1-.691 2.813l-5.334 5.229a4.75 4.75 0 0 1-6.666-.016l-4.356-4.31a2.75 2.75 0 0 1-.681-2.808l1.629 1.62q.048.064.107.121l2.411 2.386l1.931 1.922a3.25 3.25 0 0 0 4.575.014l5.334-5.229q.075-.073.134-.155"
                  />
                </svg>
              </div>
            )}
            <div className="w-full flex justify-center fixed bottom-5">
              <MyButton radius="full" variant="shadow" onClick={handleGo}>
                Search
              </MyButton>
            </div>
          </ModalContainer>
        )}
        <SelectExtensions setRecommendation={setRecommendation} />
      </div>

      {recommendation.length > 0 && (
        <section className="">
          <h2 className="font-semibold px-2 pt-5 pb-2 dark:text-white">
            Featured Content
          </h2>
          <Swiper
            slidesPerView={2.2}
            spaceBetween={8}
            modules={[Pagination]}
            
            className="mySwiper"
          >
            {recommendation.map((item, index) => {
              return (
                <SwiperSlide key={index + "-swiper"}>
                  <button
                    onClick={() => {
                      window.location.href = `/extensions/${$STORE_global_default_extension}/search/${item.url}`;
                    }}
                    className="flex flex-col relative  h-[240px] "
                  >
                    <img
                      className="w-full h-full object-cover rounded-xl rounded-b-2xl"
                      src={item.image}
                      alt={item.name}
                    />
                    <div
                      style={{
                        background:
                          "linear-gradient(transparent 50%, black 100%)",
                      }}
                      className="w-full font-semibold absolute text-center text-white  h-full flex items-end justify-center rounded-b-xl"
                    >
                      <span className="mb-2 whitespace-nowrap text-sm px-3 text-ellipsis overflow-hidden capitalize">
                        {item.name}
                      </span>
                    </div>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      )}
    </>
  );
}
export default Searcher;
