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
function PostById({ extension, id }) {
  const [data, setData] = useState(null);
  const [defaultCollection, setDefaultCollection] = useState(null);
  const [changeDefaultCollection, setChangeDefaultCollection] = useState(null);
  const [collections, setCollections] = useState(null);
  const [saved, setSaved] = useState(undefined);
  const [dataByQuery, setDataByQuery] = useState(null);
  const [user, setUser] = useState(null);
  function obtenerCookies() {
    const cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [nombre, valor] = cookie.split("=").map((part) => part.trim());
      cookies[nombre] = decodeURIComponent(valor);
    });
    return cookies;
  }
  const handleDownloadClick = (imageUrl) => {
    const proxyUrl = `http://localhost:3000/proxy?imageUrl=${encodeURIComponent(
      imageUrl
    )}`;
    fetch(proxyUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download",`${extension}-${id}.png`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error al descargar la imagen:", error));
  };
  // const [userData, setUserData] = useState(undefined)
  async function handleSave(id) {
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
        setSaved(true);
      } else {
        alert(response.message);
      }
    }
  }
  async function handleRemove(id) {
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
          // console.log(data.data)
        }
        getProfile();
        setSaved(false);
      } else {
        alert(response.message);
      }
    }
  }
  async function handleChangeDefaultCollection(obj) {
    setDefaultCollection(obj);
    setChangeDefaultCollection(obj);
    localStorage.setItem("defaultCollection", JSON.stringify(obj));
  }
  async function getDataByTags(tags, page) {
    // TAGS IS A ARRAY
    if (tags.length > 0) {
      const tagsList = tags;

      const character = tagsList
        .filter((e) => e.type === "4")
        .map((e) => e.name);
      const randomsGeneral = tagsList.filter((e) => e.type === "0");
      const random = [
        randomsGeneral[
          [Math.floor(Math.random() * (randomsGeneral.length - 0 + 1)) + 0]
        ].name,
      ];
      // console.log("RANDOM", random);
      const tagsFinaly = [...character, ...random];
      // console.log(tagsFinaly);
      try {
        const response = await fetch(
          `${import.meta.env.PUBLIC_SERVER_URL}/api/deshiroku/${
            data.extension
          }/search/${tagsFinaly.join("+")}/${page}`
        );
        const res = await response.json();
        if (res.success) {
          setDataByQuery(res.data);
          console.log("GG :D");
        } else {
          console.log("SOMETHING WAS WRONG");
        }
      } catch (error) {}
    }

    // // Caso 1: Si hay más de 3 tags, selecciona aleatoriamente 3 de los primeros 10 tags
    // if (tagsList.length > 3) {
    //   const firstTenTags = tagsList.slice(0, 8); // Tomar los primeros 10 tags
    //   selectedTags = [];
    //   for (let i = 0; i < 3; i++) {
    //     const randomIndex = Math.floor(Math.random() * firstTenTags.length);
    //     selectedTags.push(firstTenTags.splice(randomIndex, 1)[0]);
    //   }
    // } else {
    //   // Caso 2: Si hay 3 o menos tags, simplemente selecciona todos los tags disponibles
    //   selectedTags = tagsList;
    // }
    // console.log(selectedTags);
    // const response = await fetch(
    //   `http://localhost:3000/api/deshiroku/${
    //     data.extension
    //   }/search/${selectedTags.join("+")}/${page}`,
    //   { method: "GET" }
    // );
    // const dat = await response.json();
    // console.log(dat);
    // if (dat.success) {
    //   setDataByQuery(dat.data);
    // }
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
  useState(() => {
    async function getData() {
      const data = await getPostById(extension, id);
      console.log(data.data);
      setData(data.data);
    }
    getData();
  }, []);
  useEffect(() => {
    if (data) {
      // console.log(data);
      // ! ESTO VERIFICA SI ES QUE EXISTE UNA COLLECTION POR DEFECTO DONDE GUARDAR LAS IMAGENES.
      const localStorageDefaultCollection =
        localStorage.getItem("defaultCollection");
      const parsedLocalStorageDefaultCollection = JSON.parse(
        localStorageDefaultCollection
      );
      parsedLocalStorageDefaultCollection &&
        setDefaultCollection(parsedLocalStorageDefaultCollection);

      const localStorageUser = localStorage.getItem("user");
      // console.log(localStorageUser)
      // !VERIFICA SI ES QUE LA IMAGEN YA EXISTE EN LA COLECCION DEFAULT O SELECIONADA.
      if (localStorageUser) {
        const parsedLocalStorageUser = JSON.parse(localStorageUser);
        if (parsedLocalStorageUser) {
          // console.log("SOME");
          // setUserData(parsedLocalStorageUser)
          setCollections(parsedLocalStorageUser.collections);
          const index = parsedLocalStorageUser.collections.findIndex(
            (e) => e._id === parsedLocalStorageDefaultCollection.id
          );
          if (index !== -1) {
            const match = parsedLocalStorageUser.collections[index].images.some(
              (e) => e.file_url === data.file_url
            );
            setSaved(match);
            console.log("SE ESTABLECE :", match);
          } else {
            console.log("SE ESTABLECE NO GUARDADo");
            setSaved(false);
          }
        }
      }
    }
  }, [changeDefaultCollection, data]);
  useEffect(() => {
    if (data) {
      getDataByTags(data.tags.tags, 1);
    }
  }, [data]);
  useEffect(() => {
    // console.log(data);
    const userLocal = localStorage.getItem("user");
    setUser(JSON.parse(userLocal));
  }, [collections]);
  return (
    <div className="pt-4">
      {data ? (
        <div>
          <div className="bg-white shadow-2xl max-w-6xl mx-auto rounded-3xl overflow-hidden flex p-0">
            {(data && data.type_file === "webm") ||
            (data && data.type_file === "mp4") ? (
              <div className="w-1/2 relative">
                <a
                  href={data?.file_url}
                  target="_blank"
                  className="absolute bottom-5 left-5 z-10 bg-neutral-50 text-2xl px-4 py-3 rounded-full capitalize"
                >
                  original image
                </a>
                <video
                  src={data.file_url}
                  muted
                  controls
                  className="w-full rounded-l-3xl"
                />
              </div>
            ) : (
              <div className="w-1/2 relative h-fit">
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
                <img src={data?.file_url} className="w-full rounded-l-3xl" />
              </div>
            )}
            <div className="p-10 w-1/2 ">
              <div className="flex gap-1 justify-end">
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
                  />
                )}
                {/* {defaultCollection && collections && <button>{defaultCollection.name}</button>} */}
                {saved === undefined ? (
                  <button className="px-4 rounded-full text-white">
                    loading
                  </button>
                ) : saved ? (
                  <button
                    className="px-4 py-3 capitalize rounded-full text-white font-semibold bg-neutral-900"
                    onClick={() => handleRemove(defaultCollection.id)}
                  >
                    guardado
                  </button>
                ) : (
                  <button
                    className="px-4 py-3 capitalize rounded-full text-white font-semibold bg-red-500"
                    onClick={() => handleSave(defaultCollection.id)}
                  >
                    guardar
                  </button>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mt-5">
                  <div className="bg-rose-400 w-12 h-12 rounded-full grid place-content-center uppercase font-semibold text-white">
                    {data?.owner.split("")[0]}
                  </div>
                  <p className="font-semibold">{data?.owner}</p>
                </div>

                <div className="flex mt-5">
                  {/* TYPES TAGS 
        0 = general
        1 = artist
        3 = Copyright
        4 = character
        5 = meta
        */}
                  {data && (
                    <div>
                      {data.tags.tags.some((e) => e.type === "1") && (
                        <div>
                          <h2 className=" font-semibold capitalize">artist</h2>
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
                          <h2 className=" font-semibold capitalize">meta</h2>
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
                        <div>
                          <h2 className=" font-semibold capitalize">general</h2>
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
              </div>
            </div>
            {/* {data.source && data.source} */}
          </div>

          {/* MORE CONTENT BY RELATED  */}
          <h2 className="mt-10 pb-5 text-center font-semibold text-xl">
            Mas para explorar{" "}
          </h2>
          <div className="">
            {dataByQuery && (
              <Masonry
                className="w-full h-fit"
                columns={{
                  200: 1,
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
                  return (
                    <a
                      className=""
                      href={`/extensions/${element.extension}/post/${element.id}`}
                      key={element.id + index}
                    >
                      <img
                        className="w-full rounded-xl max-h-[500px] object-cover"
                        src={element.preview_url}
                        alt="some"
                      />
                    </a>
                  );
                })}
              </Masonry>
            )}
          </div>
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
}
export default PostById;
