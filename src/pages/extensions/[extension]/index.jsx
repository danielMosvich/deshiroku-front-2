import { useState, useEffect } from "react";
import getImages from "../../../services/getImages";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";
import "swiper/css";
import "swiper/css/effect-cards";

import Masonry from "react-masonry-css";

function Extension({ extension }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pass, setPass] = useState(false);

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
  async function GetImages(pageParams) {
    if (pageParams === 1 && extension) {
      const data = await getImages(extension, pageParams);
      console.log(data);
      if (data.success) {
        const imageUrls = data.data.map((img) => img.preview_url);
        const imagePromises = imageUrls.map(
          (url) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () =>
                reject(new Error(`error al cargar la imagen desde ${url}`));
              img.src = url;
            })
        );
        try {
          const loadedImages = await Promise.all(imagePromises);
          if (
            loadedImages.every((img) => img.complete && img.naturalWidth !== 0)
          ) {
            setData(data.data);
            setTimeout(() => {
              setIsLoadingMore(false);
            }, 1000);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      const newArray = new Array(30).fill().map(() => ({ extension: "load" }));
      // LOAD IMAGES
      setData((prev) => {
        return [...prev, ...newArray];
      });
      const data2 = await getImages(extension, pageParams);
      if (data2.success) {
        const imageUrls = data2.data.map((img) => img.preview_url);
        const imagePromises = imageUrls.map(
          (url) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () =>
                reject(new Error(`error al cargar la imagen desde ${url}`));
              img.src = url;
            })
        );
        try {
          const loadedImages = await Promise.all(imagePromises);
          if (
            loadedImages.every((img) => img.complete && img.naturalWidth !== 0)
          ) {
            setData((prev) => {
              const newValueToData = [
                ...prev.filter((e) => e.extension !== "load"),
                ...data2.data,
              ];
              return newValueToData;
            });
            setPage((prev) => prev + 1);
            setIsLoadingMore(false);
            setPass(false);
          } else {
            throw new Error("Algunas imágenes no se cargaron correctamente");
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  useEffect(() => {
    if (extension) {
      GetImages(1);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingMore && data && data.length > 0 && pass) {
      GetImages(page + 1);
      setIsLoadingMore(true);
    }
  }, [pass]);
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const windowHeightInVH = (clientHeight * 99) / 100;
      if (scrollTop + window.innerHeight >= scrollHeight - windowHeightInVH) {
        setPass(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoadingMore]);
  return (
    <div className="relative lg:px-20 sm:px-10  px-2">
      <div>
        {data && data.length > 0 ? (
          <div className="">
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
              {data.map((e, index) =>
                e.extension === "load" ? (
                  //! AQUI VA LAS CARTAS ROSAS (ESQUELETON)
                  <Card delay={index} key={`${index}-load-${page}`} />
                ) : (
                  // AQUI LAS CARTAS NORMALES
                  <a
                    className="w-full"
                    href={getHref(e)}
                    key={`${e.id}-page-${page}-index-${index}`}
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
                          <h2 className="text-sm font-semibold dark:text-white">
                            {e.owner}
                          </h2>
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
                          <h2 className="text-sm font-semibold dark:text-white">
                            {e.owner}
                          </h2>
                        </div>
                      </div>
                    )}
                  </a>
                )
              )}
            </Masonry>
          </div>
        ) : (
          <div className="md:max-h-[calc(100vh-80px)]  md:min-h-[calc(100vh-80px)] max-h-[calc(100vh-56px)]  min-h-[calc(100vh-56px)] overflow-y-clip">
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
                {Array.from({ length: 35 }).map((_e, k) => {
                  return <Card key={k} delay={k} />;
                })}
              </Masonry>
            </div>
          </div>
        )}
      </div>
      {isLoadingMore && <Loader />}
    </div>
  );
}
export default Extension;
