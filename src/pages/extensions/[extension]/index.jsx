import { useState, useEffect } from "react";
import Masonry from "react-layout-masonry";
import getImages from "../../../services/getImages";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";
function Extension({ extension }) {
  const [loadClient, setClientLoad] = useState(false);
  // const [dataByAstro, setDataByAstro] = useState();
  // const [loadImages, setLoadImages] = useState(false);
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  function encryptUrl(url) {
    return btoa(url);
  }
  async function GetImages(pageParams) {
    if (pageParams === 1 && extension) {
      const data = await getImages(extension, pageParams);
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
            const now = new Date();
            if (!localStorage.getItem(String(extension))) {
              console.log("no hay nada aun");
              localStorage.setItem(
                String(extension),
                JSON.stringify({
                  data: {
                    default: {
                      lastUpdate: now.getTime(),
                      scrollY: 0,
                      page: 1,
                      images: data.data,
                    },
                  },
                  search: {
                    querys: [],
                  },
                  posts: [],
                })
              );
              setData(data.data);
              setTimeout(() => {
                setIsLoadingMore(false);
              }, 1000);
            } else {
              const beforeStorage = JSON.parse(
                localStorage.getItem(String(extension))
              );
              localStorage.setItem(
                String(extension),
                JSON.stringify({
                  ...beforeStorage,
                  data: {
                    default: {
                      lastUpdate: now.getTime(),
                      scrollY: 0,
                      page: 1,
                      images: data.data,
                    },
                  },
                })
              );
              setData(data.data);
              setTimeout(() => {
                setIsLoadingMore(false);
              }, 1000);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      const newArray = new Array(30).fill().map(() => ({ extension: "load" }));
      // LOAD IMAGES
      const data2 = await getImages(extension, pageParams);
      setData((prev) => [...prev, ...newArray]);
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
            setData((prev) => [
              ...prev.filter((e) => e.extension !== "load"),
              ...data2.data,
            ]);
            const storageData = localStorage.getItem(String(extension));
            // console.log(storageData)
            if (storageData) {
              const storageDataOBJ = JSON.parse(storageData);
              storageDataOBJ.data.default.images = [...data, ...data2.data];
              storageDataOBJ.data.default.page = page + 1;
              localStorage.setItem(
                String(extension),
                JSON.stringify(storageDataOBJ)
              );
            }
            setPage((prev) => prev + 1);
            setTimeout(() => {
              setIsLoadingMore(false);
            }, 1000);
          } else {
            throw new Error("Algunas imágenes no se cargaron correctamente");
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
  // !PONER EL SCROLL A DONDE SE QUEDO
  useEffect(() => {
    // if(data){
    //   console.log(encryptUrl(data.preview_url))
    // }
    if (extension && localStorage.getItem(`${extension}`)) {
      const storageData = JSON.parse(localStorage.getItem(`${extension}`));
      // console.log("XD");
      const uwu = () => {
        if (data.length > 0) {
          console.log(data.length);
          window.scrollTo(0, storageData.data.default.scrollY);
          console.log("SCROLLED ", storageData.data.default.scrollY + "Y");
        }
      };
      uwu();
    }
  }, [data.length]);
  useEffect(() => {
    let timeOut;
    if (extension) {
      if (localStorage.getItem(`${extension}`)) {
        const now = new Date();
        const storageData = JSON.parse(localStorage.getItem(`${extension}`));
        if (storageData.data.default) {
          console.log("SE GUARDA DESDE EL LOCAL")
          setData(storageData.data.default.images);
          setPage(storageData.data.default.page);
        } else {
          // console.log(storageData.data)
          GetImages(1);
        }
      } else {
        timeOut = setTimeout(() => {
          GetImages(1);
        }, 500);
      }
      //! ESTA MADRE SOLO ES PARA QUE NO OCURRA EL ERROR DE WINDOW IS NOT DEFINED XD
      setClientLoad(true);
    }
    return () => clearTimeout(timeOut);
  }, []);

  // !SCROLL DETECT
  // ! no se si con AStro el scroll es automatico, pero de por si ahora es auto, en todo caso aqui el codigo para hacerlo manual
  // useEffect(() => {
  //   if (data && !isLoadingMore) {
  //     const handleScroll = () => {
  //       const { scrollTop, scrollHeight, clientHeight } =
  //         document.documentElement;
  //       if (scrollTop + clientHeight >= scrollHeight - scrollHeight / 4) {
  //         console.log("LOAD MORE", page + 1);
  //         setIsLoadingMore(true);
  //         GetImages(page + 1);
  //       }
  //     };
  //     window.addEventListener("scroll", handleScroll);
  //     return () => {
  //       window.removeEventListener("scroll", handleScroll);
  //     };
  //   }
  // }, [data, isLoadingMore]);

  // //* SCROLL Y LOAD
  // useEffect(() => {
  //   function handleScroll() {
  //     const ScrollY = window.scrollY || document.documentElement.scrollTop;
  //     console.log("Position", ScrollY);
  //     const storageData = localStorage.getItem(String(extension));
  //     const dataJSON = JSON.parse(storageData);
  //     dataJSON.data.default.scrollY = ScrollY;
  //     localStorage.setItem(String(extension), JSON.stringify(dataJSON));
  //   }
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <div className="relative">
      {loadClient && (
        <div>
          {data && data.length > 0 ? (
            <div className="lg:px-20 sm:px-10  px-5">
              <Masonry
                columns={{
                  0: 1,
                  350: 2,
                  400: 2,
                  700: 3,
                  1000: 4,
                  1250: 5,
                  1500: 6,
                  1750: 7,
                }}
                gap={16}
              >
                {data.map((e, index) =>
                  e.extension === "load" ? (
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
                    <a
                      href={`/extensions/${extension}/post/${e.id}?p=${btoa(
                        e.preview_url
                      )}`}
                      key={e.id}
                      className=""
                      onClick={() => {
                        // window.location.href = `/extensions/${extension}/post/${e.id}?p=${encryptUrl(e.preview_url)}`
                        console.log(encryptUrl(e.preview_url));
                        console.log("Xd");
                      }}
                    >
                      <img
                        className="w-full rounded-xl max-h-[500px] object-cover"
                        src={e.preview_url}
                        alt={e.owner + "image"}
                        loading="lazy"
                      />
                      <div className="flex gap-1 items-center mt-2">
                        {/* <div className="rounded-full bg-neutral-200 w-8 h-8 grid place-content-center">
                          <p className="uppercase font-semibold">
                            {e.owner.split("")[0]}
                          </p>
                        </div> */}
                        <h2 className="text-sm font-semibold">{e.owner}</h2>
                      </div>
                    </a>
                  )
                )}
              </Masonry>
            </div>
          ) : (
            <div className=" w-full max-h-[calc(100vh-80px)]  min-h-[calc(100vh-80px)] max h-full lg:px-20 sm:px-10 px-5 overflow-hidden">
              <div className="animate-fade-up">
                <Masonry
                  columns={{
                    0: 1,
                    350: 2,
                    400: 2,
                    700: 3,
                    1000: 4,
                    1250: 5,
                    1500: 6,
                    1750: 7,
                  }}
                  gap={16}
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
export default Extension;
