// TYPES TAGS
//               0 = general
//               1 = artist
//               3 = Copyright
//               4 = character
//               5 = meta

// https://lens.google.com/uploadbyurl?url=https://realbooru.com/thumbnails/79/f9/thumbnail_79f9ddea59400483cc497cf5f566c84d.jpg
import { useEffect, useState } from "react";
import PopoverButton from "@/components/popoverButton";
import Masonry from "react-layout-masonry";
import getPostById from "../../../../../services/getPostById";
import Card from "../../../../../components/Card";
import SaveButton from "../../../../../components/SaveButton";

function PostById({ extension, id }) {
  const [loadClient, setLoadClient] = useState(false);
  const [preview_url, setPreview__url] = useState(null);
  const [file_url, setFile_url] = useState(null);

  const [data, setData] = useState(null);
  const [defaultCollection, setDefaultCollection] = useState(null);
  const [collections, setCollections] = useState(null);
  const [dataByQuery, setDataByQuery] = useState(null);
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState("false");
  function obtenerCookies() {
    const cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [nombre, valor] = cookie.split("=").map((part) => part.trim());
      cookies[nombre] = decodeURIComponent(valor);
    });
    return cookies;
  }
  const handleDownloadClick = (imageUrl) => {
    const proxyUrl = `${
      import.meta.env.PUBLIC_SERVER_URL
    }/proxy?imageUrl=${encodeURIComponent(imageUrl)}`;
    fetch(proxyUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${extension}-${id}.png`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error al descargar la imagen:", error));
  };
  async function handleSave(id) {
    setIsLoading("saving");
    console.log("SAVE");
    const token = obtenerCookies();
    if (document.cookie) {
      console.log("FETCH");

      const resp = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
          body: JSON.stringify({ id: id, image: data }),
        }
      );
      const response = await resp.json();
      if (response.success) {
        async function getProfile() {
          const res = await fetch(
            `${import.meta.env.PUBLIC_SERVER_URL}/api/user/profile`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JSON.stringify(token)}`,
              },
            }
          );
          const data = await res.json();
          localStorage.setItem("user", JSON.stringify(data.data));
          setCollections(data.data.collections);
          // setUserData(data.data)
          console.log("SE ACTUALIZO EL LOCAL STORAGE DE USER");
          // console.log(data.data)
        }
        getProfile();
        // setSaved(true);
        setIsLoading("true");
      } else {
        alert(response.message);
        setIsLoading("false");
      }
    }
  }
  async function handleRemove(id) {
    setIsLoading("removing");
    if (document.cookie) {
      const token = obtenerCookies();
      const fileUrl = data.file_url;
      const resp = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collection`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
          body: JSON.stringify({
            id_collection: id,
            url: fileUrl,
          }),
        }
      );
      const response = await resp.json();
      console.log(response);
      if (response.success) {
        async function getProfile() {
          const res = await fetch(
            `${import.meta.env.PUBLIC_SERVER_URL}/api/user/profile`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JSON.stringify(token)}`,
              },
            }
          );
          const data = await res.json();
          localStorage.setItem("user", JSON.stringify(data.data));
          setCollections(data.data.collections);
          console.log("SE ACTUALIZO EL LOCAL STORAGE DE USER");
        }
        getProfile();
        setIsLoading("false");
      } else {
        alert(response.message);
        setIsLoading("true");
      }
    }
  }
  async function handleChangeDefaultCollection(obj) {
    setDefaultCollection(obj);
    localStorage.setItem("defaultCollection", JSON.stringify(obj));
  }
  async function getDataByTags(tags, page) {
    // TAGS IS A ARRAY
    console.log(tags);
    if (tags.length > 0) {
      const tagsList = tags.sort((a, b) => {
        return parseInt(b.count) - parseInt(a.count);
      });

      const generalTags = tagsList.filter((item) => item.type === "0");
      const generalTagsListSorted = generalTags
        .filter((obj) => parseInt(obj.count) > 500)
        .sort((a, b) => parseInt(b.count) - parseInt(a.count));

      const tagElegido =
        generalTagsListSorted[
          Math.floor(Math.random() * generalTagsListSorted.length)
        ];
      const characterTags = tagsList
        .filter((item) => item.type === "4")
        .sort((a, b) => parseInt(b.count) - parseInt(a.count));

      console.log(tagElegido, "ELEGIDO");
      const finalString =
        characterTags.length > 0
          ? `${
              characterTags[Math.floor(Math.random() * characterTags.length)]
                .name
            }`
          : `${tagElegido.name}`;
      console.log(finalString);
      async function GetDataByTags() {
        try {
          const response = await fetch(
            `${
              import.meta.env.PUBLIC_SERVER_URL
            }/api/deshiroku/${extension}/search/${finalString}/1`
          );

          const res = await response.json();
          console.log(res);
          if (res.success) {
            const data = res.data;
            // console.log(data)
            // setDataByQuery(res.data);
            const imageUrls = data.map((img) => img.preview_url);
            // console.log(imageUrls)
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
                loadedImages.every(
                  (img) => img.complete && img.naturalWidth !== 0
                )
              ) {
                setTimeout(() => {
                  setDataByQuery(data);
                }, 500);
              }
            } catch (error) {}
          } else {
            console.log("SOMETHING WAS WRONG");
          }
        } catch (error) {
          console.log("error", error);
        }
      }
      GetDataByTags();
    }
  }

  function getTagsUrl(e) {
    // console.log(e);
    if (e.type === "0") {
      return `general?${e.name}`;
    }
    if (e.type === "1") {
      return `artist?${e.name}`;
    }
    if (e.type === "2") {
      return `metadata?${e.name}`;
    }
    if (e.type === "3") {
      return `copyright?${e.name}`;
    }
    if (e.type === "4") {
      return `character?${e.name}`;
    }
    if (e.type === "5") {
      return `meta?${e.name}`;
    }
  }

  // !EFECT PARA CARGAR EL DOM Y TRAER LOS VALORES DE LOS PARAMETROS
  useEffect(() => {
    setLoadClient(true);
    if (setLoadClient) {
      function getParamValue(paramName) {
        // Obtener la URL actual del navegador
        var url = window.location.href;

        // Extraer el valor del parámetro "p" de la URL
        paramName = paramName.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + paramName + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        var encodedValue = decodeURIComponent(results[2].replace(/\+/g, " "));
        return atob(encodedValue); // Decodificar en Base64
      }
      setPreview__url(getParamValue("p"));
    }
  }, []);
  useEffect(() => {
    async function getData() {
      const data = await getPostById(extension, id);
      // console.log(data.data.tags.tags)
      setData(data.data);
      getDataByTags(data.data.tags.tags, 1);
      if (data.data.type_file === "webm" || data.data.type_file === "mp4") {
        async function loadVideo() {
          return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.addEventListener("loadedmetadata", () => {
              resolve(video);
            });
            video.addEventListener("error", (error) => {
              reject(new Error("Error al cargar el video"));
            });
            video.src = data.data.file_url;
            video.controls = true;
          });
        }
        try {
          const videoElement = await loadVideo();
          if (videoElement) {
            setFile_url(data.data.file_url);
            const post = data.data;
            const now = new Date().getTime();
            if (localStorage.getItem(extension)) {
              const beforeStorage = JSON.parse(localStorage.getItem(extension));
              if (beforeStorage.posts.lastUpdate) {
                beforeStorage.posts.data.push(post);
              } else {
                beforeStorage.posts.data.push(post);
                beforeStorage.posts.lastUpdate = now;
              }
              1712941999714;
              localStorage.setItem(extension, JSON.stringify(beforeStorage));
            } else {
              localStorage.setItem(
                extension,
                JSON.stringify({
                  data: {},
                  posts: { data: [post], lastUpdate: now },
                  search: { querys: [] },
                })
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        const imagePromises = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () =>
            reject(
              new Error(`error al cargar la imagen desde ${data.data.file_url}`)
            );
          img.src = data.data.file_url;
        });
        try {
          const loadedImages = await Promise.resolve(imagePromises);
          if (loadedImages) {
            setFile_url(data.data.file_url);
            const post = data.data;
            const now = new Date().getTime();
            if (localStorage.getItem(extension)) {
              const beforeStorage = JSON.parse(localStorage.getItem(extension));
              if (beforeStorage.posts.lastUpdate) {
                beforeStorage.posts.data.push(post);
              } else {
                beforeStorage.posts.data.push(post);
                beforeStorage.posts.lastUpdate = now;
              }
              1712941999714;
              localStorage.setItem(extension, JSON.stringify(beforeStorage));
            } else {
              localStorage.setItem(
                extension,
                JSON.stringify({
                  data: {},
                  posts: { data: [post], lastUpdate: now },
                  search: { querys: [] },
                })
              );
            }
          } else {
          }
        } catch (error) {}
      }
    }
    if (localStorage.getItem(extension)) {
      const beforeStorage = JSON.parse(localStorage.getItem(extension));
      const indexCoincide = beforeStorage.posts.data.findIndex(
        (item) => Number(item.id) === Number(id)
      );
      // console.log(indexCoincide)
      if (indexCoincide !== -1) {
        // console.log(beforeStorage.data);
        const postCoincide = beforeStorage.posts.data[indexCoincide];
        // console.log(postCoincide);
        setFile_url(postCoincide.file_url);
        setData(postCoincide);
        getDataByTags(postCoincide.tags.tags, 1);
      } else {
        getData();
      }
    } else {
      getData();
    }
  }, []);
  useEffect(() => {
    if (data) {
      // ! ESTO VERIFICA SI ES QUE EXISTE UNA COLLECTION POR DEFECTO DONDE GUARDAR LAS IMAGENES.
      const localStorageDefaultCollection =
        localStorage.getItem("defaultCollection");
      const parsedLocalStorageDefaultCollection = JSON.parse(
        localStorageDefaultCollection
      );
      parsedLocalStorageDefaultCollection &&
        setDefaultCollection(parsedLocalStorageDefaultCollection);

      const localStorageUser = localStorage.getItem("user");
      // !VERIFICA SI ES QUE LA IMAGEN YA EXISTE EN LA COLECCION DEFAULT O SELECIONADA.
      if (localStorageUser) {
        const parsedLocalStorageUser = JSON.parse(localStorageUser);
        if (parsedLocalStorageUser) {
          setCollections(parsedLocalStorageUser.collections);
          const index = parsedLocalStorageUser.collections.findIndex(
            (e) => e._id === parsedLocalStorageDefaultCollection.id
          );
          if (index !== -1) {
            const match = parsedLocalStorageUser.collections[index].images.some(
              (e) => e.file_url === data.file_url
            );
            setIsLoading(String(match));
          } else {
            setIsLoading("false");
          }
        }
      }
    }
  }, [data]);
  // !TRAE LAS COLECCIONES DEL USUARIO
  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    setUser(JSON.parse(userLocal));
  }, [collections]);

  return (
    <div className="md:pt-4">
      {loadClient && (
        <div>
          {data ? (
            <div className="">
              <div className="bg-white sm:shadow-2xl max-w-xl lg:max-w-5xl mx-auto sm:rounded-3xl overflow-hidden flex flex-col lg:flex-row p-0">
                {(data && data.type_file === "webm") ||
                (data && data.type_file === "mp4") ? (
                  // *VIDEO
                  <div className="w-full lg:w-3/4 relative">
                    <a
                      href={data?.file_url}
                      target="_blank"
                      className="absolute bottom-5 left-5 z-10 bg-neutral-50 text-2xl px-4 py-3 rounded-full capitalize"
                    >
                      original image
                    </a>
                    {file_url ? (
                      <video
                        src={file_url}
                        preload={preview_url}
                        muted
                        controls
                        className="w-full rounded-t-xl lg:rounded-l-3xl"
                      />
                    ) : (
                      <img
                        src={preview_url}
                        className="w-full rounded-t-xl lg:rounded-l-3xl"
                      />
                    )}
                  </div>
                ) : (
                  //* IMAGE
                  <div className="w-full lg:w-3/4 relative">
                    <a
                      href={data?.file_url}
                      target="_blank"
                      className="absolute flex gap-2 items-center bottom-5 left-5 z-10 bg-neutral-50 text-lg px-4 py-2 rounded-full capitalize"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5rem"
                        height="1.5rem"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m21 15.344l-2.121 2.121l-3.172-3.172l-1.414 1.414l3.172 3.172L15.344 21H21zM3 8.656l2.121-2.121l3.172 3.172l1.414-1.414l-3.172-3.172L8.656 3H3zM21 3h-5.656l2.121 2.121l-3.172 3.172l1.414 1.414l3.172-3.172L21 8.656zM3 21h5.656l-2.121-2.121l3.172-3.172l-1.414-1.414l-3.172 3.172L3 15.344z"
                        />
                      </svg>
                      <p className="font-semibold">original image</p>
                    </a>
                    {file_url ? (
                      <img
                        src={file_url}
                        className="w-full rounded-t-xl lg:rounded-l-3xl"
                      />
                    ) : (
                      <img
                        src={preview_url}
                        className="w-full rounded-t-xl lg:rounded-l-3xl"
                      />
                    )}
                  </div>
                )}

                {/* RIGHT */}
                <div className="lg:p-10 p-5 lg:w-[70%] w-full max-h-fit overflow-hidden border-b-[1px]">
                  <div className="hidden gap-1 justify-end lg:flex">
                    {data.source && (
                      <a
                        href={data.source}
                        target="_blank"
                        className=" p-2 grid place-content-center w-10 h-10 hover:bg-neutral-200  rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5rem"
                          height="1.5rem"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5q0-1.875-1.312-3.187T9.5 5Q7.625 5 6.313 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14"
                          />
                        </svg>
                      </a>
                    )}
                    {data.file_url && (
                      <a
                        onClick={() => handleDownloadClick(data.file_url)}
                        className="hover:bg-neutral-300 p-2 grid place-content-center w-10 h-10 rounded-full capitalize text-black font-semibold"
                        // target="_blank"
                        // href={data.file_url}
                        // download
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5rem"
                          height="1.5rem"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"
                          />
                        </svg>
                      </a>
                    )}
                    {/* THIS IS A TOOLTIP :D */}
                    {defaultCollection && collections && (
                      <PopoverButton
                        user={user}
                        defaultCollectionName={defaultCollection.name}
                        defaultCollection={defaultCollection}
                        collections={collections}
                        file_url={data.file_url}
                        handleRemove={handleRemove}
                        handleSave={handleSave}
                        setDefaultCollection={setDefaultCollection}
                        handleChangeDefaultCollection={
                          handleChangeDefaultCollection
                        }
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />
                    )}

                    {/* BUTON SECTION FOR SAVE OR DELETE IMG FROM COLLECTION */}
                    {defaultCollection && collections && (
                      <SaveButton
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        handleSave={handleSave}
                        handleRemove={handleRemove}
                        defaultCollection={defaultCollection}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mt-5">
                      <div className="bg-rose-400 w-12 h-12 rounded-full grid place-content-center uppercase font-semibold text-white">
                        {data?.owner.split("")[0]}
                      </div>
                      <p className="font-semibold">{data?.owner}</p>
                    </div>

                    {/* CONTENT TO SAVED IN MOBILE */}
                    <div className="lg:flex mt-5  hidden">
                      {/* TYPES TAGS 
        0 = general
        1 = artist
        3 = Copyright
        4 = character
        5 = meta
        */}
                      {data && (
                        <div className="">
                          {data.tags.tags.some((e) => e.type === "1") && (
                            <div>
                              <h2 className=" font-semibold capitalize">
                                artist
                              </h2>
                              <div className="my-2">
                                {data.tags.tags.map((el, i) => {
                                  if (el.type === "1") {
                                    return (
                                      <a
                                        href={`/extensions/${
                                          data.extension
                                        }/search/${getTagsUrl(el)}`}
                                        key={i + el.id}
                                        // onClick={() => console.log(getTagsUrl(e))}
                                        className="items-center justify-center px-3 py-1 text-sm text-rose-500 bg-rose-100 rounded-full cursor-pointer backdrop-blur-3xl ring-1 ring-rose-400"
                                      >
                                        {el.name} ({el.count})
                                      </a>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          )}

                          {data.tags.tags.some((e) => e.type === "3") && (
                            <div>
                              <h2 className=" font-semibold capitalize">
                                copyright
                              </h2>
                              <div className="my-2 flex flex-wrap gap-2">
                                {data.tags.tags.map((el, i) => {
                                  if (el.type === "3") {
                                    return (
                                      <a
                                        href={`/extensions/${
                                          data.extension
                                        }/search/${getTagsUrl(el)}`}
                                        key={i + el.id}
                                        className="items-center justify-center px-3 py-1 text-sm text-purple-900 bg-purple-100 rounded-full cursor-pointer backdrop-blur-3xl ring-1 ring-purple-300"
                                      >
                                        {el.name} ({el.count})
                                      </a>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          )}

                          {data.tags.tags.some((e) => e.type === "4") && (
                            <div>
                              <h2 className=" font-semibold capitalize">
                                character
                              </h2>
                              <div className="my-2 flex flex-wrap gap-2">
                                {data.tags.tags.map((el, i) => {
                                  if (el.type === "4") {
                                    return (
                                      <a
                                        key={i + el.id}
                                        href={`/extensions/${
                                          data.extension
                                        }/search/${getTagsUrl(el)}`}
                                        className="items-center justify-center px-3 py-1 text-sm text-lime-800 bg-lime-100 rounded-full cursor-pointer backdrop-blur-3xl ring-1 ring-lime-500"
                                      >
                                        {el.name} ({el.count})
                                      </a>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          )}

                          {data.tags.tags.some((e) => e.type === "5") && (
                            <div>
                              <h2 className=" font-semibold capitalize">
                                meta
                              </h2>
                              <div className="my-2 flex flex-wrap gap-2">
                                {data.tags.tags.map((el, i) => {
                                  if (el.type === "5") {
                                    return (
                                      <a
                                        href={`/extensions/${
                                          data.extension
                                        }/search/${getTagsUrl(el)}`}
                                        key={i + el.id}
                                        className="items-center justify-center px-3 py-1 text-sm text-amber-700 bg-amber-100 rounded-full cursor-pointer backdrop-blur-3xl ring-1 ring-amber-500"
                                      >
                                        {el.name} ({el.count})
                                      </a>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          )}
                          {data.tags.tags.some((e) => e.type === "0") && (
                            <div className="">
                              <h2 className=" font-semibold capitalize">
                                general
                              </h2>
                              <div className="my-2 flex flex-wrap gap-2">
                                {data.tags.tags.slice(0, 20).map((el, i) => {
                                  if (el.type === "0") {
                                    return (
                                      <a
                                        href={`/extensions/${
                                          data.extension
                                        }/search/${getTagsUrl(el)}`}
                                        key={i + el.id}
                                        className="items-center justify-center px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-full cursor-pointer backdrop-blur-3xl ring-1 ring-blue-400"
                                      >
                                        {el.name} ({el.count})
                                      </a>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="lg:hidden flex  mt-5">
                      {/* {data && data.tags.tags.length} */}
                      {data && (
                        <div className="flex items-center justify-center gap-3 w-full">
                          <button className=" px-4 py-3 rounded-full font-semibold">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.5rem"
                              height="1.5rem"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M3 19h18v2H3zm10-5.828L19.071 7.1l1.414 1.414L12 17L3.515 8.515L4.929 7.1L11 13.173V2h2z"
                              />
                            </svg>
                          </button>
                          <button className="bg-neutral-200 px-4 py-3 rounded-full font-semibold  gap-1">
                            Source
                          </button>
                          <SaveButton isLoading={isLoading} />
                          <button className="flex hover:bg-neutral-100 px-4 py-3 rounded-full font-semibold gap-1">
                            <label htmlFor="">Tags</label>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.5rem"
                              height="1.5rem"
                              viewBox="0 0 15 15"
                            >
                              <path
                                fill="currentColor"
                                d="M7.5 10.207L11.707 6H3.293z"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* {data.source && data.source} */}
              </div>

              {/*! MORE CONTENT BY RELATED  */}
              {/*! MORE CONTENT BY RELATED  */}
              {/*! MORE CONTENT BY RELATED  */}
              {/*! MORE CONTENT BY RELATED  */}

              <div className="">
                {dataByQuery ? (
                  <div className="lg:px-20 sm:px-10  px-5">
                    <h2 className="md:mt-10  mt-5 pb-5 md:pl-0 sm:text-center font-semibold md:text-xl">
                      Mas para explorar
                    </h2>
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
                      {dataByQuery.map((element, index) => {
                        if (element.id !== id) {
                          return (
                            <a
                              className=""
                              href={`/extensions/${element.extension}/post/${
                                element.id
                              }?p=${btoa(element.preview_url)}`}
                              key={element.id + index}
                            >
                              <img
                                className="w-full rounded-xl max-h-[500px] object-cover"
                                src={element.preview_url}
                                alt="some"
                              />
                            </a>
                          );
                        }
                      })}
                    </Masonry>
                  </div>
                ) : (
                  <div className=" w-full max-h-[calc(100vh-80px)]  min-h-[calc(100vh-80px)] max h-full lg:px-20 sm:px-10 px-5 overflow-hidden md:mt-[85px] mt-16">
                    <div className="">
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
                        {Array.from({ length: 40 }).map((e, k) => {
                          return <Card key={k} delay={k} />;
                        })}
                      </Masonry>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-2xl max-w-xl lg:max-w-5xl mx-auto rounded-3xl overflow-hidden flex flex-col lg:flex-row p-0">
              <div className="w-full lg:w-3/4 relative">
                <img
                  src={preview_url}
                  className="w-full rounded-t-xl lg:rounded-l-3xl"
                />
              </div>

              {/* RIGHT */}
              <div className="p-10 w-[70%]"></div>
              {/* {data.source && data.source} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default PostById;
