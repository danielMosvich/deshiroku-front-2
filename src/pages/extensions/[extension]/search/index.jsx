import getImagesByQuery from "@/services/getImagesByQuery";
import { useState, useEffect } from "react";
import Masonry from "react-layout-masonry";
import Card from "../../../../components/Card";
import Loader from "../../../../components/Loader";
function Extension({ extension }) {
  const [loadClient, setClientLoad] = useState(false);
  // const [loadImages, setLoadImages] = useState(false);
  const [data, setData] = useState([]);
  // const [query, setQuery] = useState(null);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function GetImages(pageParams, query) {
    // !getImagesByQuery params = extension / tags (query) / page
    if (pageParams === 1 && extension) {
      const data = await getImagesByQuery(extension, query, pageParams);
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
            // const lastUpdate = now.getTime();
            // * comienza la logica para el localStorage (esto comienza un vez todas las imagenes ya cargaron)
            // este se ejecuta si es que localStorage[extension] existe, este tiene que existir o luego veremos como agregarlo
            if (localStorage.getItem(String(extension))) {
              const parsedLocalStorage = JSON.parse(
                localStorage.getItem(String(extension))
              );
              //! si en el localStorage no hay mas de un elemento, si es que no hay se le agrega sin problemas
              if (parsedLocalStorage.search.querys.length > 0) {
                const indexQuery = parsedLocalStorage.search.querys.findIndex(
                  (item) => item.query === query
                );
                // console.log(indexQuery);
                // !si es que hay un elemento en el localstorage, si este coincide con la query se aplica la logica, si no se agrega sin mas
                if (indexQuery !== -1) {
                  const oldLastUpdate =
                    parsedLocalStorage.search.querys[indexQuery].lastUpdate;
                  const tiempo_actual = now.getTime() - oldLastUpdate;
                  const tiempo_transcurrido = tiempo_actual / 60000;
                  if (tiempo_transcurrido > 1) {
                    console.log(
                      "nuevo dato update in",
                      query,
                      tiempo_transcurrido
                    );
                    parsedLocalStorage.search.querys[indexQuery] = {
                      query,
                      // scrollY: 0,
                      page: 1,
                      images: data.data,
                      lastUpdate: now.getTime(),
                    };
                    localStorage.setItem(
                      String(extension),
                      JSON.stringify(parsedLocalStorage)
                    );
                  }
                } else {
                  parsedLocalStorage.search.querys.push({
                    query,
                    // scrollY: 0,
                    page: 1,
                    images: data.data,
                    lastUpdate: now.getTime(),
                  });
                  localStorage.setItem(
                    String(extension),
                    JSON.stringify(parsedLocalStorage)
                  );
                }
              } else {
                parsedLocalStorage.search.querys.push({
                  query,
                  // scrollY: 0,
                  page: 1,
                  images: data.data,
                  lastUpdate: now.getTime(),
                });
                localStorage.setItem(
                  String(extension),
                  JSON.stringify(parsedLocalStorage)
                );
              }
            } else {
              // * se crea si no hay nada en el inicio
              localStorage.setItem(
                String(extension),
                JSON.stringify({
                  data: {},
                  search: {
                    querys: [
                      {
                        query,
                        // scrollY: 0,
                        page: 1,
                        images: data.data,
                        lastUpdate: now.getTime(),
                      },
                    ],
                  },
                  posts: { data: {} },
                })
              );
            }
            // const now = new Date();
            // const lastUpdate = now.getTime();
            // if (localStorage.getItem(String(extension))) {
            //   const parsedLocal = JSON.parse(
            //     localStorage.getItem(String(extension))
            //   );
            //   console.log("QUERY: ", query);
            //   if (parsedLocal.search) {
            //     if (
            //       !parsedLocal.search.query.find((item) => item.query === query)
            //     ) {
            //       console.log("no se encontro uno igual");
            //       parsedLocal.search.query.push({
            //         query: query,
            //         scrollY: 0,
            //         page: 1,
            //         images: data.data,
            //         lastUpdate,
            //       });
            //       // console.log(parsedLocal)
            //       parsedLocal.lastUpdate = lastUpdate;
            //       localStorage.setItem(
            //         String(extension),
            //         JSON.stringify(parsedLocal)
            //       );
            //     } else {
            //       console.log("SE ENCONTRO UNO IGUAL ");
            //       const ecualQuery = parsedLocal.search.query.find(
            //         (item) => item.query === query
            //       );
            //       const cualQueryIndex = parsedLocal.search.query.findIndex(
            //         (item) => item.query === query
            //       );
            //       // console.log(cualQueryIndex)
            //       const storageLastUpdate = ecualQuery.lastUpdate;
            //       const tiempo_actual = lastUpdate - storageLastUpdate;
            //       console.log(tiempo_actual / 60000 > 1, tiempo_actual);
            //       if (tiempo_actual / 60000 > 5) {
            //         if (cualQueryIndex !== -1) {
            //           parsedLocal.search.query[cualQueryIndex] = {
            //             query: query,
            //             scrollY: 0,
            //             page: 1,
            //             images: data.data,
            //             lastUpdate,
            //           };
            //         }
            //       }
            //       // parsedLocal.search = {
            //       //   query: [
            //       //     {
            //       //       query: query,
            //       //       scrollY: 0,
            //       //       page: 1,
            //       //       images: data.data,
            //       //       lastUpdate,
            //       //     },
            //       //   ],
            //       // };
            //       parsedLocal.lastUpdate = lastUpdate;
            //       localStorage.setItem(
            //         String(extension),
            //         JSON.stringify(parsedLocal)
            //       );
            //     }
            //   }
            // }

            // ? guarda las imagenes en el hook
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
      const data2 = await getImagesByQuery(extension, query, pageParams);
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
          const now = new Date();
          if (
            loadedImages.every((img) => img.complete && img.naturalWidth !== 0)
          ) {
            setData((prev) => [
              ...prev.filter((e) => e.extension !== "load"),
              ...data2.data,
            ]);

            const dat = localStorage.getItem(String(extension));
            if (dat) {
              const storageDataOBJ = JSON.parse(
                localStorage.getItem(extension)
              );
              console.log(JSON.parse(localStorage.getItem(extension)), "iiw");
              const xd = storageDataOBJ.search.querys.find(
                (item) => item.query === query
              );
              const ind = storageDataOBJ.search.querys.findIndex(
                (item) => item.query === query
              );
              console.log(xd);
              storageDataOBJ.search.querys.splice(ind, 1, {
                ...xd,
                images: [...xd.images, ...data2.data],
                // scrollY: 0,
                page: page + 1,
                lastUpdate: now.getTime(),
              });
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
  // !EFFECT PARA OBTENER LOS QUERYS DE LA URL
  // !PRIMERA CARGA DE LA PAGINA 1
  useEffect(() => {
    const href =
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];
    const tags = href.split("&").map((e) => e.split("?")[1]);
    let timeOut;
    const now = new Date();
    if (extension) {
      if (localStorage.getItem(String(extension))) {
        const parsedLocalStorage = JSON.parse(
          localStorage.getItem(String(extension))
        );
        if (parsedLocalStorage.search && parsedLocalStorage.search.querys) {
          const itemInQuestion = parsedLocalStorage.search.querys.find(
            (item) => item.query === tags.join("+")
          );
          if (itemInQuestion) {
            const index = parsedLocalStorage.search.querys.findIndex(
              (item) => item.query === tags.join("+")
            );
            const tiempo_transcurrido =
              (now.getTime() - itemInQuestion.lastUpdate) / 60000;
            console.log(tiempo_transcurrido);
            if (tiempo_transcurrido > 2) {
              timeOut = setTimeout(() => {
                GetImages(1, tags.join("+"));
              }, 1000);
            } else {
              setData(parsedLocalStorage.search.querys[index].images);
              setPage(parsedLocalStorage.search.querys[index].page);
            }
          } else {
            GetImages(1, tags.join("+"));
          }
        } else {
          GetImages(1, tags.join("+"));
        }
      } else {
        GetImages(1, tags.join("+"));
      }
      setClientLoad(true);
    }
    return () => clearTimeout(timeOut);
  }, []);

  // !SCROLL DETECT
  useEffect(() => {
    const href =
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];
    const tags = href.split("&").map((e) => e.split("?")[1]);

    if (data && !isLoadingMore) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - scrollHeight / 4) {
          console.log("LOAD MORE", page + 1);
          setIsLoadingMore(true);
          GetImages(page + 1, tags.join("+"));
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [data, isLoadingMore]);
  return (
    <div className="relative">
      {loadClient && (
        <div>
          {data && data.length > 0 ? (
            <div className="lg:px-20 sm:px-10  px-2">
              
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
                    >
                      <img
                        className="w-full rounded-xl max-h-[500px] object-cover"
                        src={e.preview_url}
                        alt={e.owner + "image"}
                        loading="lazy"
                      />
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
