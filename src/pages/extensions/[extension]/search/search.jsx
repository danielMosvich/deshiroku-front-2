import getImagesByQuery from "../../../../services/getImagesByQuery";
import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Card from "../../../../components/Card";
import Loader from "../../../../components/Loader";
import TagButton from "../../../../components/header/TagButton";
import DropDown from "../../../../components/global-react/dropDown";
import Alert from "../../../../components/global-native/alert";

function Search({ extension }) {
  //   ? HOOKS ------------------------>
  const [data, setData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchOptions, setSearchOptions] = useState(false);
  //   ? ------------------------------<
  // TODO FUNCTIONS -------------->
  function getHref(element) {
    const queryParams = {
      preview_url: element.preview_url,
      file_url: element.file_url,
      width: element.width,
      height: element.height,
    };
    const queryString = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join("&");
    const url = `/extensions/${extension}/post/${element.id}?${queryString}`;
    return url;
  }
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
        if (data.success) {
          const imageUrls = data.data.map((img) => img.preview_url);
          const loadedImages = await loadImages(imageUrls);
          if (loadedImages) {
            setData(data.data);
            // console.log(data.data);
          }
        }
      }
    } catch (error) {
      Alert("bottom", 2000, "error", "Error fetch data", "please reload page");
    }
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
      let filterParams = JSON.parse(decodedFilterString);
      
      if (!filterParams) {
        filterParams = {
          sort: {
            q: "sort",
            type: "updated",
            order: "desc",
          },
          score: {
            value: 0,
          },
          rating: "all",
        };
      }
      const params = {
        tags,
        filter: filterParams,
      };
      const filtersString = `+${params.filter.sort.q}:${
        params.filter.sort.type
      }:${params.filter.sort.order}${
        params.filter.score.value !== 0
          ? `+score:>${params.filter.score.value}`
          : ""
      }`;
      if (tags) {
        GetImages(
          1,
          params.tags.map((item) => item.value).join("+") + filtersString
        );
      } else {
        GetImages(1, filtersString);
      }
    } catch (error) {
      console.log("XD");
    }
  };
  //TODO -----------------------<

  //   ? HOOKS ------------------------>
  useEffect(() => {
    if (extension) {
      setParams();
    }
  }, [extension]);

  //   ? ------------------------------<
  return (
    <div className="md:mt-20 sm:mt-10 mt-2">
      {data && data.length > 0 ? (
        <div className="lg:px-20 sm:px-10  px-2">
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
            {data.map((e) => (
              <a className="w-full" key={e.id} href={getHref(e)}>
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
            ))}
          </Masonry>
        </div>
      ) : (
        <div className=" w-full max-h-[calc(100vh-160px)]  min-h-[calc(100vh-160px)] max h-full lg:px-20 sm:px-10 px-2 overflow-hidden">
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
  );
}
export default Search;