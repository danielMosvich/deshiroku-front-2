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
                      // scrollY: 0,
                      page: 1,
                      images: data.data,
                    },
                  },
                  search: {
                    querys: [],
                  },
                  posts: { data: [] },
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
                      // scrollY: 0,
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
  // useEffect(() => {
  //   // if(data){
  //   //   console.log(encryptUrl(data.preview_url))
  //   // }
  //   if (extension && localStorage.getItem(`${extension}`)) {
  //     const storageData = JSON.parse(localStorage.getItem(`${extension}`));
  //     // console.log("XD");
  //     const uwu = () => {
  //       if (data.length > 0) {
  //         console.log(data.length);
  //         window.scrollTo(0, storageData.data.default.scrollY);
  //         console.log("SCROLLED ", storageData.data.default.scrollY + "Y");
  //       }
  //     };
  //     uwu();
  //   }
  // }, [data.length]);
  useEffect(() => {
    let timeOut;
    if (extension) {
      if (localStorage.getItem(`${extension}`)) {
        const storageData = JSON.parse(localStorage.getItem(`${extension}`));
        // !VERIFICA SI ES QUE DENTRO DE DATA {} DEL LOCAL STORAGE EXISTE LA PROPIEDAD DEFAULT SINO PASA A CREARLA CON GETIMAGES
        if (storageData.data.default) {
          if (storageData.data.default.lastUpdate) {
            // console.log("SE GUARDA DESDE EL LOCAL")
            const lastUpdate = storageData.data.default.lastUpdate;
            const now = new Date().getTime();
            const tiempo_pasado = (now - lastUpdate) / 60000;
            // console.log(lastUpdate)
            console.log(
              "tiempo transcurrido",
              Math.floor(tiempo_pasado),
              "minuto"
            );
            if (tiempo_pasado > 5) {
              console.log("paso mas de 5 minutos");
              timeOut = setTimeout(() => {
                GetImages(1);
              }, 500);
            } else {
              setData(storageData.data.default.images);
              setPage(storageData.data.default.page);
            }
          } else {
            GetImages(1);
          }
        } else {
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
  useEffect(() => {
    if (data && !isLoadingMore) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - scrollHeight / 4) {
          console.log("LOAD MORE", page + 1);
          setIsLoadingMore(true);
          GetImages(page + 1);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [data, isLoadingMore]);
  useEffect(() => {
    if (localStorage.getItem(extension)) {
      const storageData = JSON.parse(localStorage.getItem(extension));
      if (storageData.posts) {
        if (storageData.posts.lastUpdate) {
          const now = new Date().getTime();
          const tiempo_transcurrido = now - storageData.posts.lastUpdate;
          if (tiempo_transcurrido / 60000 > 10) {
            console.log(
              "POSTS[] PASO MAS DE 5 minutos",
              tiempo_transcurrido / 60000
            );
            storageData.posts.data = [];
            storageData.posts.lastUpdate = now;
            localStorage.setItem(extension, JSON.stringify(storageData));
          } else {
            console.log(
              "POSTS[] aun no pasan 5 minutos",
              tiempo_transcurrido / 60000
            );
          }
        }
      }
    }
  }, []);
  return (
    <div className="relative pt-5 md:pt-0">
      {loadClient && (
        <div>
          {data && data.length > 0 ? (
            <div className="lg:px-20 sm:px-10  px-2">
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor,
                facilis. Impedit dicta consectetur iste quas sapiente
                repudiandae sit distinctio nobis. Corporis dolorum commodi
                repellendus laboriosam! Incidunt facilis nemo ullam pariatur?
              </div>
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
                className="gap-2 sm:gap-4"
                // gap={16}
                // style={{gap:"16px"}}
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
                      )}&f=${btoa(e.file_url)}`}
                      key={e.id}
                    >
                      {e.type_file === "mp4" || e.type_file === "webm" ? (
                        <div
                          style={{
                            backgroundImage:
                              " linear-gradient(144deg,#a241ff, #513bfa 50%,#3f89ff)",
                          }}
                          className="w-full h-fit rounded-[18px] p-[3px] shadow-xl shadow-blue-500/30 relative"
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
                      ) : (
                        // <div className="relative drop-shadow-xl w-48 h-64 overflow-hidden rounded-xl bg-[#3d3c3d]">
                        //   <img
                        //   className="w-full absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-[#323132] max-h-[500px]"
                        //   src={e.preview_url}
                        //   alt={e.owner + "image"}
                        //   loading="lazy"
                        // />
                        // <div className="absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2">

                        // </div>
                        // </div>
                        <img
                          className="w-full rounded-2xl max-h-[500px] object-cover"
                          src={e.preview_url}
                          alt={e.owner + "image"}
                          loading="lazy"
                        />
                      )}
                      <div className="flex gap-1 items-center mt-2 mb-4">
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
