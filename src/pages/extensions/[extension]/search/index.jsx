import getImagesByQuery from "../../../..//services/getImagesByQuery";
import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Card from "../../../../components/Card";
import Loader from "../../../../components/Loader";
import TagButton from "../../../../components/header/TagButton";
import DropDown from "../../../../components/global-react/dropDown";

function PostByQuery({ extension }) {
  const [loadClient, setClientLoad] = useState(false);
  const [data, setData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchOptions, setSearchOptions] = useState(false);
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Error loading image from ${url}`));
      img.src = url;
    });
  };
  const loadImages = async (imageUrls) => {
    try {
      // Carga todas las imágenes simultáneamente
      const loadedImages = await Promise.all(
        imageUrls.map(async (url) => {
          try {
            return await loadImage(url);
          } catch (error) {
            return null;
          }
        })
      );

      // Filtra las imágenes cargadas para eliminar aquellas que sean null (indicando que hubo un error al cargarlas)
      const filteredImages = loadedImages.filter((img) => img !== null);

      return filteredImages;
    } catch (error) {
      console.error(`Error loading images: ${error.message}`);
      // Puedes manejar el error de alguna manera, por ejemplo, lanzar una excepción o retornar un array vacío
      throw error;
    }
  };
  async function GetImages(pageParams, query) {
    try {
      if (pageParams === 1 && extension) {
        const data = await getImagesByQuery(extension, query, pageParams);
        // console.log(data)
        if (data.success) {
          const imageUrls = data.data.map((img) => img.preview_url);
          const loadedImages = await loadImages(imageUrls);
          if (loadedImages) {
            setData(data.data);
            console.log(data.data)
          }
        }
      }
    } catch (error) {}
  }
  const setParams = () => {
    try {
      const currentUrl = window.location.href;
      const queryString = currentUrl.split("/search/")[1];
      const paramsUri = new URLSearchParams(queryString);
      const tagsString = paramsUri.get("tags");
      const filterString = paramsUri.get("filter");
      const tags = JSON.parse(decodeURIComponent(tagsString));
      const decodedFilterString = decodeURIComponent(filterString);
      const filterParams = JSON.parse(decodedFilterString);
      const params = {
        tags,
        filter: filterParams,
      };
      console.log();
      GetImages(1, params.tags.map((item) => item.value).join("+"));
    } catch (error) {
      console.log("XD");
    }
  };
  // !EFFECT PARA OBTENER LOS QUERYS DE LA URL
  // !PRIMERA CARGA DE LA PAGINA 1
  // useEffect(() => {
  //   const href =
  //     window.location.href.split("/")[
  //       window.location.href.split("/").length - 1
  //     ];
  //   const tags = href.split("&").map((e) => e.split("?")[1]);
  //   // tags.push("sort:score:desc")
  //   // console.log(tags)
  //   // if (options.popular) {
  //   //   tags.push(`sort:score:${options.update === "recent" ? "desc" : "asc"}`);
  //   // } else {
  //   //   tags.push(`sort:updated:${options.update === "recent" ? "desc" : "asc"}`);
  //   // }
  //   console.log(tags);
  //   let timeOut;
  //   const now = new Date();
  //   if (extension) {
  //     if (localStorage.getItem(String(extension))) {
  //       const parsedLocalStorage = JSON.parse(
  //         localStorage.getItem(String(extension))
  //       );
  //       if (parsedLocalStorage.search && parsedLocalStorage.search.querys) {
  //         const itemInQuestion = parsedLocalStorage.search.querys.find(
  //           (item) => item.query === tags.join("+")
  //         );
  //         if (itemInQuestion) {
  //           const index = parsedLocalStorage.search.querys.findIndex(
  //             (item) => item.query === tags.join("+")
  //           );
  //           const tiempo_transcurrido =
  //             (now.getTime() - itemInQuestion.lastUpdate) / 60000;
  //           console.log(tiempo_transcurrido);
  //           if (tiempo_transcurrido > 2) {
  //             timeOut = setTimeout(() => {
  //               GetImages(1, tags.join("+"));
  //             }, 1000);
  //           } else {
  //             setData(parsedLocalStorage.search.querys[index].images);
  //             setPage(parsedLocalStorage.search.querys[index].page);
  //           }
  //         } else {
  //           GetImages(1, tags.join("+"));
  //         }
  //       } else {
  //         GetImages(1, tags.join("+"));
  //       }
  //     } else {
  //       GetImages(1, tags.join("+"));
  //     }
  //     setClientLoad(true);
  //   }
  //   return () => clearTimeout(timeOut);
  // }, [options]);
  useEffect(() => {
    setParams();
  }, []);
  // !SCROLL DETECT
  // useEffect(() => {
  //   const href =
  //     window.location.href.split("/")[
  //       window.location.href.split("/").length - 1
  //     ];
  //   const tags = href.split("&").map((e) => e.split("?")[1]);

  //   if (data && !isLoadingMore) {
  //     const handleScroll = () => {
  //       const { scrollTop, scrollHeight, clientHeight } =
  //         document.documentElement;
  //       if (scrollTop + clientHeight >= scrollHeight - scrollHeight / 4) {
  //         console.log("LOAD MORE", page + 1);
  //         setIsLoadingMore(true);
  //         GetImages(page + 1, tags.join("+"));
  //       }
  //     };
  //     window.addEventListener("scroll", handleScroll);
  //     return () => {
  //       window.removeEventListener("scroll", handleScroll);
  //     };
  //   }
  // }, [data, isLoadingMore]);
  // ! DETECT TAGS SELECTED
  // useEffect(() => {
  //   if (window) {
  //     const urlParts = window.location.href.split("/");
  //     if (urlParts.some((item) => item === "search")) {
  //       const tags = getTagsByUrl();
  //       setSelectedTags(tags);

  //       // console.log(tags)
  //       const magicTags = tags.filter((item) => item.type === "magic");
  //       const popularTag = magicTags.filter((item) =>
  //         item.value.includes("sort:score:")
  //       )[0];
  //       if (!popularTag) {
  //         const updateTag = magicTags.filter((item) =>
  //           item.value.includes("sort:updated:")
  //         )[0];
  //         // console.log(updateTag);
  //         if (updateTag) {
  //           setOptions((prev) => ({
  //             ...prev,
  //             update:
  //               updateTag.value.split(":")[2] === "desc"
  //                 ? "recent "
  //                 : "ancient",
  //           }));
  //         }
  //       } else {
  //         // console.log(popularTag);
  //         setOptions((prev) => ({ ...prev, popular: true }));
  //       }
  //     }
  //   }
  // }, []);

  return (
    <div className="relative">
      {loadClient && (
        <div>
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquam aliquid veritatis, necessitatibus minima excepturi tenetur atque delectus, odit deleniti temporibus distinctio nobis minus iste, facere enim deserunt praesentium? Consequuntur, ex. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laboriosam nulla atque eos dolor officia rerum necessitatibus doloremque reprehenderit soluta enim ex sit aspernatur nobis, aperiam, ipsum molestiae itaque eum
          </div>
          {/* <div className="bg-white/90 backdrop-blur-lg w-full p-5 px-10 fixed h-16 top-0 mt-20 z-10 flex gap-3 items-center ">
            <a
              className=" bg-neutral-200 hover:bg-neutral-300 rounded-full p-2 relative"
              onClick={() => setSearchOptions((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M11.646 20.965a1.67 1.67 0 0 1-1.321-1.282a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.728.177 1.154.71 1.279 1.303" />
                  <path d="M14.985 11.694a3 3 0 1 0-3.29 3.29M15 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.2 2.2L22 22" />
                </g>
              </svg>
              {searchOptions && (
                <DropDown position="left" close={() => setSearchOptions(false)}>
                  <div className="flex flex-col items-start">
                    <h2 className="font-semibold text-lg">Filters to search</h2>
                    <p className="text-sm text-start font-semibold text-neutral-600">
                      this will remain in the other searches
                    </p>
                    <p></p>
                    <div className=" w-full flex gap-3 items-center mt-5">
                      <button
                        onClick={() => {}}
                        className={
                          options.popular
                            ? `bg-black px-3 py-2 rounded-full font-semibold font-mono flex gap-2 items-center
                            bg-gradient-to-tr from-rose-800 to-red-400
                            ring-4 ring-rose-300
                            text-white shadow-xl shadow-rose-500/40
                            transition-all
                        `
                            : `bg-black px-3 py-2 rounded-full font-semibold font-mono flex gap-2 items-center
                        bg-gradient-to-tr from-neutral-800 to-neutral-700
                        text-neutral-300
                        `
                        }
                      >
                        {options.popular ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              stroke="currentColor"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M8 15c4.875 0 7-2.051 7-7c0 4.949 2.11 7 7 7c-4.89 0-7 2.11-7 7c0-4.89-2.125-7-7-7ZM2 6.5c3.134 0 4.5-1.318 4.5-4.5c0 3.182 1.357 4.5 4.5 4.5c-3.143 0-4.5 1.357-4.5 4.5c0-3.143-1.366-4.5-4.5-4.5Z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M8 15c4.875 0 7-2.051 7-7c0 4.949 2.11 7 7 7c-4.89 0-7 2.11-7 7c0-4.89-2.125-7-7-7ZM2 6.5c3.134 0 4.5-1.318 4.5-4.5c0 3.182 1.357 4.5 4.5 4.5c-3.143 0-4.5 1.357-4.5 4.5c0-3.143-1.366-4.5-4.5-4.5Z"
                            />
                          </svg>
                        )}
                        <span>Popular</span>
                      </button>
                      <button
                        onClick={() => {
                          setOptions((prev) => {
                            const updatedOptions = {
                              ...prev,
                              update:
                                prev.update === "recent" ? "ancient" : "recent",
                            };
                            return updatedOptions;
                          });
                        }}
                        className=" px-3 py-2 rounded-full w-[120px] justify-center font-semibold font-mono flex gap-2 items-center
                        bg-gradient-to-tr from-blue-800 to-sky-600
                        text-white
                        "
                      >
                        {options.update === "recent" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14"
                            />
                          </svg>
                        )}
                        <span>{options.update}</span>
                      </button>
                      <button
                        onClick={() => {
                          const newScore = Number(prompt("nuevo score"));

                          setOptions((prev) => {
                            const updatedOptions = {
                              ...prev,
                              scoreCount: newScore,
                            };
                            localStorage.setItem(
                              "searchOptions",
                              JSON.stringify(updatedOptions)
                            );
                            return updatedOptions;
                          });
                        }}
                        className=" bg-black px-3 py-2 rounded-full font-semibold font-mono flex gap-1 items-center
                        bg-gradient-to-tr from-neutral-800 to-neutral-700
                        text-neutral-300 whitespace-nowrap
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2q-.225-.175-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562q.1-.275.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15q.275 0 .537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45q.1.275.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437q-.225.175-.525.2t-.575-.15z"
                          />
                        </svg>
                        <span>
                          score {">"} {options.scoreCount}
                        </span>
                      </button>
                    </div>
                  </div>
                </DropDown>
              )}
            </a>
            <ul className=" w-full flex gap-2 items-center ">
              {selectedTags &&
                selectedTags.map((item, index) => (
                  <TagButton key={index} flat type={item.type}>
                    {item.value}
                  </TagButton>
                ))}
            </ul>
            {/* <ul className=" w-full flex gap-2 items-center justify-end ">
              <li className="bg-rose-400 rounded-full w-fit flex gap-2 items-center pr-5 py-1 pl-1 cursor-pointer">
                <i className="bg-neutral-800 w-6 h-6 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                  >
                    <g fill="none">
                      <g filter="url(#IconifyId18f110642c67b95312)">
                        <path
                          fill="url(#IconifyId18f110642c67b9538)"
                          d="M15.821 11.106c-.17.662-.749 1.156-1.433 1.498c-1.939.67-3.47 1.316-4.738 1.942c-1.122.555-1.11 2.308.015 2.855c1.315.639 2.966 1.252 4.8 1.98c.493.195 1.19.747 1.363 1.426a55.506 55.506 0 0 0 2.063 6.35c.621 1.587 2.158 1.585 2.783 0c.81-2.059 1.427-4.282 2.122-6.397a2.02 2.02 0 0 1 1.294-1.395a69.593 69.593 0 0 0 4.721-1.889c1.26-.555 1.286-2.356.042-2.946a55.776 55.776 0 0 0-4.771-2.009a2.163 2.163 0 0 1-1.339-1.398c-.754-2.31-1.232-4.27-2.034-6.304c-.625-1.586-2.264-1.537-2.89.048c-.798 2.028-1.355 4.045-1.998 6.239"
                        />
                      </g>
                      <path
                        fill="url(#IconifyId18f110642c67b9539)"
                        d="M15.821 11.106c-.17.662-.749 1.156-1.433 1.498c-1.939.67-3.47 1.316-4.738 1.942c-1.122.555-1.11 2.308.015 2.855c1.315.639 2.966 1.252 4.8 1.98c.493.195 1.19.747 1.363 1.426a55.506 55.506 0 0 0 2.063 6.35c.621 1.587 2.158 1.585 2.783 0c.81-2.059 1.427-4.282 2.122-6.397a2.02 2.02 0 0 1 1.294-1.395a69.593 69.593 0 0 0 4.721-1.889c1.26-.555 1.286-2.356.042-2.946a55.776 55.776 0 0 0-4.771-2.009a2.163 2.163 0 0 1-1.339-1.398c-.754-2.31-1.232-4.27-2.034-6.304c-.625-1.586-2.264-1.537-2.89.048c-.798 2.028-1.355 4.045-1.998 6.239"
                      />
                      <g filter="url(#IconifyId18f110642c67b95313)">
                        <path
                          fill="url(#IconifyId18f110642c67b95310)"
                          d="M7.768 5.816c-.055.213-.241.372-.461.482c-.624.216-1.117.424-1.525.626c-.361.178-.358.742.005.918c.423.206.954.403 1.544.637c.16.063.383.241.44.46c.171.673.405 1.385.663 2.043c.2.511.695.51.896 0c.26-.662.46-1.378.683-2.059a.65.65 0 0 1 .417-.449a22.404 22.404 0 0 0 1.52-.607a.523.523 0 0 0 .013-.949c-.428-.202-.96-.437-1.536-.646a.696.696 0 0 1-.431-.45c-.243-.744-.397-1.374-.655-2.03c-.2-.51-.729-.494-.93.016c-.257.653-.436 1.302-.643 2.008"
                        />
                      </g>
                      <path
                        fill="url(#IconifyId18f110642c67b95311)"
                        d="M7.768 5.816c-.055.213-.241.372-.461.482c-.624.216-1.117.424-1.525.626c-.361.178-.358.742.005.918c.423.206.954.403 1.544.637c.16.063.383.241.44.46c.171.673.405 1.385.663 2.043c.2.511.695.51.896 0c.26-.662.46-1.378.683-2.059a.65.65 0 0 1 .417-.449a22.404 22.404 0 0 0 1.52-.607a.523.523 0 0 0 .013-.949c-.428-.202-.96-.437-1.536-.646a.696.696 0 0 1-.431-.45c-.243-.744-.397-1.374-.655-2.03c-.2-.51-.729-.494-.93.016c-.257.653-.436 1.302-.643 2.008"
                      />
                      <g filter="url(#IconifyId18f110642c67b95314)">
                        <path
                          fill="url(#IconifyId18f110642c67b95315)"
                          d="M5.226 20.066c-.076.297-.336.518-.643.672c-.87.3-1.558.59-2.127.872c-.503.249-.498 1.035.007 1.28c.59.288 1.331.563 2.154.89c.222.087.534.335.612.64c.24.938.566 1.932.926 2.85c.279.712.969.711 1.249 0c.364-.924.64-1.922.952-2.872a.906.906 0 0 1 .581-.626a31.22 31.22 0 0 0 2.12-.847a.73.73 0 0 0 .018-1.323a25.027 25.027 0 0 0-2.141-.901a.97.97 0 0 1-.601-.628c-.339-1.037-.553-1.916-.913-2.83c-.28-.71-1.017-.689-1.297.023c-.358.91-.609 1.815-.897 2.8"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="IconifyId18f110642c67b9538"
                          x1="26.129"
                          x2="15.052"
                          y1="11.271"
                          y2="22.931"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFCF5A" />
                          <stop offset="1" stop-color="#FEA254" />
                        </linearGradient>
                        <linearGradient
                          id="IconifyId18f110642c67b9539"
                          x1="14.754"
                          x2="20.792"
                          y1="29.29"
                          y2="16.554"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FF886D" />
                          <stop
                            offset="1"
                            stop-color="#FF886D"
                            stop-opacity="0"
                          />
                        </linearGradient>
                        <linearGradient
                          id="IconifyId18f110642c67b95310"
                          x1="11.086"
                          x2="7.521"
                          y1="5.869"
                          y2="9.622"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFDA72" />
                          <stop offset="1" stop-color="#F7A967" />
                        </linearGradient>
                        <linearGradient
                          id="IconifyId18f110642c67b95311"
                          x1="8.886"
                          x2="8.886"
                          y1="11.98"
                          y2="7.855"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FDA071" />
                          <stop
                            offset="1"
                            stop-color="#FDA071"
                            stop-opacity="0"
                          />
                        </linearGradient>
                        <filter
                          id="IconifyId18f110642c67b95312"
                          width="21.607"
                          height="25.193"
                          x="8.415"
                          y="3.404"
                          color-interpolation-filters="sRGB"
                          filterUnits="userSpaceOnUse"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx=".25" dy="-.25" />
                          <feGaussianBlur stdDeviation=".25" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 0.937255 0 0 0 0 0.482353 0 0 0 0 0.329412 0 0 0 1 0" />
                          <feBlend
                            in2="shape"
                            result="effect1_innerShadow_18_454"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx=".25" dy=".25" />
                          <feGaussianBlur stdDeviation=".5" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 0.737255 0 0 0 0 0.615686 0 0 0 0 0.415686 0 0 0 1 0" />
                          <feBlend
                            in2="effect1_innerShadow_18_454"
                            result="effect2_innerShadow_18_454"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx="-.4" dy=".25" />
                          <feGaussianBlur stdDeviation=".2" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.901961 0 0 0 0 0.458824 0 0 0 1 0" />
                          <feBlend
                            in2="effect2_innerShadow_18_454"
                            result="effect3_innerShadow_18_454"
                          />
                        </filter>
                        <filter
                          id="IconifyId18f110642c67b95313"
                          width="6.945"
                          height="8.048"
                          x="5.413"
                          y="3.418"
                          color-interpolation-filters="sRGB"
                          filterUnits="userSpaceOnUse"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx=".1" dy=".1" />
                          <feGaussianBlur stdDeviation=".1" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 0.803922 0 0 0 0 0.6 0 0 0 0 0.262745 0 0 0 1 0" />
                          <feBlend
                            in2="shape"
                            result="effect1_innerShadow_18_454"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx="-.1" dy=".1" />
                          <feGaussianBlur stdDeviation=".1" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.882353 0 0 0 0 0.423529 0 0 0 1 0" />
                          <feBlend
                            in2="effect1_innerShadow_18_454"
                            result="effect2_innerShadow_18_454"
                          />
                        </filter>
                        <filter
                          id="IconifyId18f110642c67b95314"
                          width="9.556"
                          height="11.233"
                          x="2.081"
                          y="16.571"
                          color-interpolation-filters="sRGB"
                          filterUnits="userSpaceOnUse"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx=".15" dy="-.15" />
                          <feGaussianBlur stdDeviation=".15" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.458824 0 0 0 0 0.462745 0 0 0 1 0" />
                          <feBlend
                            in2="shape"
                            result="effect1_innerShadow_18_454"
                          />
                        </filter>
                        <radialGradient
                          id="IconifyId18f110642c67b95315"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="matrix(-4.2802 5.63466 -5.4871 -4.1681 10.014 18.567)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset=".365" stop-color="#FFBC64" />
                          <stop offset="1" stop-color="#FF8F6B" />
                        </radialGradient>
                      </defs>
                    </g>
                  </svg>
                </i>
                <p className="font-semibold text-sm">score</p>
              </li>
              <li className="bg-rose-400 rounded-full w-fit flex gap-2 items-center pr-5 py-1 pl-1 cursor-pointer">
                <i className="bg-white w-6 h-6 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059"
                    />
                  </svg>
                </i>
                <p className="font-semibold text-sm">recent</p>
              </li>
              <li className="bg-rose-400 rounded-full w-fit flex gap-2 items-center pr-5 py-1 pl-1 cursor-pointer">
                <i className="bg-neutral-800 w-6 h-6 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                  >
                    <g fill="none">
                      <g filter="url(#IconifyId18f110642c67b95383)">
                        <path
                          fill="url(#IconifyId18f110642c67b95377)"
                          d="m18.605 3.744l2.203 4.62c.34.686.963 1.169 1.685 1.276l4.928.696c2.538.376 3.496 3.101 1.527 5.086l-3.453 3.562a2.49 2.49 0 0 0-.682 2.187l.776 5.063c.441 2.626-1.77 4.49-4.008 3.29l-4.536-2.413a2.144 2.144 0 0 0-2.006 0l-4.536 2.412c-2.238 1.19-4.586-.617-3.93-3.351l.766-4.953a2.49 2.49 0 0 0-.682-2.187l-3.521-3.688c-1.985-1.961-1.011-4.632 1.527-5.007L9.41 9.64c.723-.107 1.552-.579 1.883-1.276l2.248-4.62c1.144-2.325 3.93-2.325 5.065 0"
                        />
                        <path
                          fill="url(#IconifyId18f110642c67b95378)"
                          d="m18.605 3.744l2.203 4.62c.34.686.963 1.169 1.685 1.276l4.928.696c2.538.376 3.496 3.101 1.527 5.086l-3.453 3.562a2.49 2.49 0 0 0-.682 2.187l.776 5.063c.441 2.626-1.77 4.49-4.008 3.29l-4.536-2.413a2.144 2.144 0 0 0-2.006 0l-4.536 2.412c-2.238 1.19-4.586-.617-3.93-3.351l.766-4.953a2.49 2.49 0 0 0-.682-2.187l-3.521-3.688c-1.985-1.961-1.011-4.632 1.527-5.007L9.41 9.64c.723-.107 1.552-.579 1.883-1.276l2.248-4.62c1.144-2.325 3.93-2.325 5.065 0"
                        />
                      </g>
                      <path
                        fill="url(#IconifyId18f110642c67b95379)"
                        d="m18.605 3.744l2.203 4.62c.34.686.963 1.169 1.685 1.276l4.928.696c2.538.376 3.496 3.101 1.527 5.086l-3.453 3.562a2.49 2.49 0 0 0-.682 2.187l.776 5.063c.441 2.626-1.77 4.49-4.008 3.29l-4.536-2.413a2.144 2.144 0 0 0-2.006 0l-4.536 2.412c-2.238 1.19-4.586-.617-3.93-3.351l.766-4.953a2.49 2.49 0 0 0-.682-2.187l-3.521-3.688c-1.985-1.961-1.011-4.632 1.527-5.007L9.41 9.64c.723-.107 1.552-.579 1.883-1.276l2.248-4.62c1.144-2.325 3.93-2.325 5.065 0"
                      />
                      <path
                        fill="url(#IconifyId18f110642c67b95380)"
                        d="m18.605 3.744l2.203 4.62c.34.686.963 1.169 1.685 1.276l4.928.696c2.538.376 3.496 3.101 1.527 5.086l-3.453 3.562a2.49 2.49 0 0 0-.682 2.187l.776 5.063c.441 2.626-1.77 4.49-4.008 3.29l-4.536-2.413a2.144 2.144 0 0 0-2.006 0l-4.536 2.412c-2.238 1.19-4.586-.617-3.93-3.351l.766-4.953a2.49 2.49 0 0 0-.682-2.187l-3.521-3.688c-1.985-1.961-1.011-4.632 1.527-5.007L9.41 9.64c.723-.107 1.552-.579 1.883-1.276l2.248-4.62c1.144-2.325 3.93-2.325 5.065 0"
                      />
                      <path
                        fill="url(#IconifyId18f110642c67b95381)"
                        d="m18.605 3.744l2.203 4.62c.34.686.963 1.169 1.685 1.276l4.928.696c2.538.376 3.496 3.101 1.527 5.086l-3.453 3.562a2.49 2.49 0 0 0-.682 2.187l.776 5.063c.441 2.626-1.77 4.49-4.008 3.29l-4.536-2.413a2.144 2.144 0 0 0-2.006 0l-4.536 2.412c-2.238 1.19-4.586-.617-3.93-3.351l.766-4.953a2.49 2.49 0 0 0-.682-2.187l-3.521-3.688c-1.985-1.961-1.011-4.632 1.527-5.007L9.41 9.64c.723-.107 1.552-.579 1.883-1.276l2.248-4.62c1.144-2.325 3.93-2.325 5.065 0"
                      />
                      <path
                        fill="url(#IconifyId18f110642c67b95382)"
                        d="m18.605 3.744l2.203 4.62c.34.686.963 1.169 1.685 1.276l4.928.696c2.538.376 3.496 3.101 1.527 5.086l-3.453 3.562a2.49 2.49 0 0 0-.682 2.187l.776 5.063c.441 2.626-1.77 4.49-4.008 3.29l-4.536-2.413a2.144 2.144 0 0 0-2.006 0l-4.536 2.412c-2.238 1.19-4.586-.617-3.93-3.351l.766-4.953a2.49 2.49 0 0 0-.682-2.187l-3.521-3.688c-1.985-1.961-1.011-4.632 1.527-5.007L9.41 9.64c.723-.107 1.552-.579 1.883-1.276l2.248-4.62c1.144-2.325 3.93-2.325 5.065 0"
                      />
                      <defs>
                        <radialGradient
                          id="IconifyId18f110642c67b95377"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="rotate(132.939 10.318 9.828)scale(19.9803 19.7731)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FAC632" />
                          <stop offset="1" stop-color="#F7C632" />
                        </radialGradient>
                        <radialGradient
                          id="IconifyId18f110642c67b95378"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="matrix(0 13.9478 -13.9614 0 16.039 15.948)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#DDBA38" />
                          <stop
                            offset="1"
                            stop-color="#DDBA38"
                            stop-opacity="0"
                          />
                        </radialGradient>
                        <radialGradient
                          id="IconifyId18f110642c67b95379"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="matrix(.62228 2.178 -7.26854 2.07673 7.06 10.082)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#DDBA38" />
                          <stop
                            offset="1"
                            stop-color="#DDBA38"
                            stop-opacity="0"
                          />
                        </radialGradient>
                        <radialGradient
                          id="IconifyId18f110642c67b95380"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="matrix(3.77717 1.089 -1.09006 3.78086 2.077 11.52)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#B5953A" />
                          <stop
                            offset="1"
                            stop-color="#B5953A"
                            stop-opacity="0"
                          />
                        </radialGradient>
                        <radialGradient
                          id="IconifyId18f110642c67b95381"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="matrix(1.47791 -2.41136 2.41371 1.47936 8.888 30.811)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#C47E42" />
                          <stop
                            offset="1"
                            stop-color="#C47E42"
                            stop-opacity="0"
                          />
                        </radialGradient>
                        <radialGradient
                          id="IconifyId18f110642c67b95382"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="rotate(150.751 14.005 9.89)scale(2.2288 2.93061)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFF246" />
                          <stop
                            offset="1"
                            stop-color="#FFF246"
                            stop-opacity="0"
                          />
                        </radialGradient>
                        <filter
                          id="IconifyId18f110642c67b95383"
                          width="30.673"
                          height="29.645"
                          x=".827"
                          y="1.5"
                          color-interpolation-filters="sRGB"
                          filterUnits="userSpaceOnUse"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dy="-.5" />
                          <feGaussianBlur stdDeviation="1.5" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 0.772549 0 0 0 0 0.494118 0 0 0 0 0.282353 0 0 0 1 0" />
                          <feBlend
                            in2="shape"
                            result="effect1_innerShadow_18_14837"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx="-1.25" dy="1.25" />
                          <feGaussianBlur stdDeviation=".75" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.952941 0 0 0 0 0.286275 0 0 0 1 0" />
                          <feBlend
                            in2="effect1_innerShadow_18_14837"
                            result="effect2_innerShadow_18_14837"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            result="hardAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          />
                          <feOffset dx="1.5" dy="-.5" />
                          <feGaussianBlur stdDeviation=".75" />
                          <feComposite
                            in2="hardAlpha"
                            k2="-1"
                            k3="1"
                            operator="arithmetic"
                          />
                          <feColorMatrix values="0 0 0 0 0.698039 0 0 0 0 0.537255 0 0 0 0 0.192157 0 0 0 1 0" />
                          <feBlend
                            in2="effect2_innerShadow_18_14837"
                            result="effect3_innerShadow_18_14837"
                          />
                        </filter>
                      </defs>
                    </g>
                  </svg>
                </i>
                <p className="font-semibold text-sm">old</p>
              </li>
            </ul> */}
          {/* </div> */}
          {data ? (
            <div className="lg:px-20 sm:px-10 mt-20 px-2">
              <Masonry
                breakpointCols={{
                  0: 2,
                  520: 2,
                  1000: 3,
                  1300: 4,
                  1550: 5,
                  1750: 6,
                  default: 7,
                }}
                className="my-mansory-grid flex gap-2 md:gap-4 w-auto"
                columnClassName="my-mansory-grid-column"
              >
                {/* {data.map((e, index) =>
                  e.extension === "load" ? (
                    // AQUI VA LAS CARTAS ROSAS (ESQUELETON)
                    <div
                      key={index + "load"}
                      style={{
                        height: `${Math.floor(
                          Math.random() * (400 - 150 + 1) + 150
                        )}px`,
                      }}
                      className={` bg-rose-100 w-full rounded-xl animate-card-squeleton transition-all`}
                    ></div>
                  ) : (
                    // AQUI LAS CARTAS NORMALES
                    <a
                      className="w-full"
                      href={`/extensions/${extension}/post/${e.id}?p=${btoa(
                        e.preview_url
                      )}&f=${btoa(e.file_url)}`}
                      key={e.id}
                    >
                      {e.type_file === "mp4" || e.type_file === "webm" ? (
                        <div>
                          <div
                            style={{
                              backgroundImage:
                                " linear-gradient(144deg,#a241ff, #513bfa 50%,#3f89ff)",
                            }}
                            className="w-full rounded-[18px] p-[3px] shadow-xl shadow-blue-500/30 relative"
                          >
                            <img
                              className="w-full rounded-2xl max-h-[500px] object-cover"
                              src={e.preview_url}
                              alt={e.owner + "image"}
                              loading="lazy"
                            />
                            <i className="absolute top-3 right-3 text-neutral-500 bg-white/80 px-2 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.2rem"
                                height="1.2rem"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"
                                />
                              </svg>
                            </i>
                          </div>
                          <div className="flex gap-1 items-center mt-2 mb-4">
                            <h2 className="text-sm font-semibold">{e.owner}</h2>
                          </div>
                        </div>
                      ) : (
                        <div className="">
                          <img
                            style={{ filter: "brightness(0.95)" }}
                            className="w-full rounded-2xl max-h-[500px] object-cover"
                            src={e.preview_url}
                            alt={e.owner + "image"}
                            loading="lazy"
                          />
                          <div className="flex gap-1 items-center mt-2 mb-4">
                            <h2 className="text-sm font-semibold">{e.owner}</h2>
                          </div>
                        </div>
                      )}
                    </a>
                  )
                )} */}
                {data.map((item) => (
                  <div>{item.name}</div>
                ))}
              </Masonry>
            </div>
          ) : (
            <div className=" w-full max-h-[calc(100vh-80px)]  min-h-[calc(100vh-80px)] max h-full lg:px-20 sm:px-10 px-2 overflow-hidden">
              <div className="animate-fade-up">
                <Masonry
                  breakpointCols={{
                    0: 2,
                    520: 2,
                    1000: 3,
                    1300: 4,
                    1550: 5,
                    1750: 6,
                    default: 7,
                  }}
                  className="my-mansory-grid flex gap-2 md:gap-4 w-auto"
                  columnClassName="my-mansory-grid-column"
                >
                  {Array.from({ length: 30 }).map((e, k) => {
                    return <Card key={k} delay={k} />;
                  })}
                </Masonry>
              </div>
            </div>
          )}
        </div>
      )}
      {isLoadingMore && <Loader />}
    </div>
  );
}
export default PostByQuery;
