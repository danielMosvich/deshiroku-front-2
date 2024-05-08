import { useEffect, useState } from "react";
import getPostById from "../../../../../services/getPostById";
import type { ImagesProps, TagAttributes } from "../../../../../types/ImagesProps";
import Alert from "../../../../../components/global-native/alert";
import type { Collection, UserProps } from "../../../../../types/UserProps";
import PopoverButton from "../../../../../components/popoverButton";
import SaveButton from "../../../../../components/SaveButton";
import TagButton from "../../../../../components/header/TagButton";
interface ParamsProps {
  preview_url: string;
  file_url: string;
  width: number;
  height: number;
  type_file: string;
}
interface Cookies {
  [key: string]: string;
}
type ButtonStates = "false" | "saving" | "removing" | "true";
function PostById({ extension, id }: { extension: string; id: string }) {
  // ?^^ hooks--------------------------->
  const [paramsProperties, setParamsProperties] = useState<null | ParamsProps>(
    null
  );
  const [loadImage, setLoadImage] = useState<boolean>(false);
  const [data, setData] = useState<null | ImagesProps>(null);

  const [defaultCollection, setDefaultCollection] = useState<null | {
    id: string;
    name: string;
  }>(null);
  const [user, setUser] = useState<null | UserProps>(null);

  const [collections, setCollections] = useState<null | Collection[]>(null);
  const [isLoading, setIsLoading] = useState<ButtonStates>("false");
  // ?^^ hooks--------------------------<

  // TODO FUNCTIONS --------------------->

  function obtenerCookies(): Cookies {
    const cookies: Cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [nombre, valor] = cookie.split("=").map((part) => part.trim());
      cookies[nombre] = decodeURIComponent(valor);
    });
    return cookies;
  }

  async function handleSave(id: string): Promise<void> {
    setIsLoading("saving");
    // console.log("SAVE");
    const token = obtenerCookies();
    if (document.cookie) {
      // console.log("FETCH");

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
        }
        getProfile();
        Alert(
          "bottom",
          3000,
          "success",
          "Saved",
          `Image was saved in: ${response.direction.name}`
        );
        setIsLoading("true");
      } else {
        alert();
        Alert(
          "bottom",
          3000,
          "error",
          "Error when saving",
          `${response.message}`
        );
        setIsLoading("false");
      }
    }
  }
  async function handleRemove(id: string): Promise<void> {
    setIsLoading("removing");
    if (document.cookie) {
      const token = obtenerCookies();
      const fileUrl = data?.file_url;
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
      // console.log(response);
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
          // console.log("SE ACTUALIZO EL LOCAL STORAGE DE USER");
        }
        getProfile();
        setIsLoading("false");
      } else {
        alert(response.message);
        setIsLoading("true");
      }
    }
  }
  async function handleChangeDefaultCollection(obj: {
    id: string;
    name: string;
  }) {
    setDefaultCollection(obj);
    localStorage.setItem("defaultCollection", JSON.stringify(obj));
  }
  const handleDownloadClick = async (imageUrl: string): Promise<void> => {
    try {
      const proxyUrl = `${
        import.meta.env.PUBLIC_SERVER_URL
      }/proxy?imageUrl=${encodeURIComponent(imageUrl)}`;

      // Descarga la imagen
      const response = await fetch(proxyUrl, {
        headers: { "Content-Type": "image/png" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Crea un enlace para descargar la imagen
      const link = document.createElement("a");
      link.href = url;
      const extension = imageUrl.split(".").pop();
      if (extension) {
        link.setAttribute(
          "download",
          `${extension}-${Date.now()}.${extension}`
        );
      }
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      // Obtiene el tamaño del archivo de imagen
      const sizeResponse = await fetch(
        `${
          import.meta.env.PUBLIC_SERVER_URL
        }/proxy/size?imageUrl=${encodeURIComponent(imageUrl)}`
      );
      if (!sizeResponse.ok) {
        throw new Error(`HTTP error! status: ${sizeResponse.status}`);
      }
      const sizeData = await sizeResponse.json();
      if (sizeData.success) {
        Alert("bottom", 3000, "success", "Image downloaded", sizeData.data);
      } else {
        throw new Error(`Server error: ${sizeData.message}`);
      }
    } catch (error: any) {
      console.error("Error downloading or fetching image size:", error);
      Alert("bottom", 2000, "error", "Download error", error.message);
    }
  };

  async function setParams() {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      interface QueryParams {
        [key: string]: string;
      }
      const params: QueryParams = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
      console.log(params);
      const type =
        params.file_url.split(".")[params.file_url.split(".").length - 1];
      setParamsProperties({
        preview_url: String(params.preview_url),
        file_url: String(params.file_url),
        width: Number(params.width),
        height: Number(params.height),
        type_file: type,
      });
      if (type !== "mp4" && type !== "webm") {
        // console.log("XD")
        const imagePromise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () =>
            reject(
              new Error(`error al cargar la imagen desde ${params.file_url}`)
            );
          img.src = params.file_url;
        });
        const loadedImage = await Promise.resolve(imagePromise);

        if (loadedImage) {
          setLoadImage(true);
          console.log("load image");
        }
      }
    } catch (error) {
      return;
    }
  }
  async function getDataById() {
    const data = await getPostById(extension, id);
    if (data?.success) {
      setData(data.data);
      if (!paramsProperties) {
        setParamsProperties({
          file_url: data.data.file_url,
          preview_url: data.data.preview_url,
          height: data.data.height,
          width: data.data.width,
          type_file: data.data.type_file,
        });
        if (data.data.type_file !== "mp4" && data.data.type_file !== "webm") {
          // console.log("XD")
          const imagePromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () =>
              reject(
                new Error(
                  `error al cargar la imagen desde ${data.data.file_url}`
                )
              );
            img.src = data.data.file_url;
          });
          const loadedImage = await Promise.resolve(imagePromise);
          if (loadedImage) {
            setLoadImage(true);
          }
        }
      }
    }
  }
  // TODO FUNCTIONS ---------------------<
  useEffect(() => {
    setParams();
    getDataById();
  }, []);
  useEffect(() => {
    if (data) {
      // ! ESTO VERIFICA SI ES QUE EXISTE UNA COLLECTION POR DEFECTO DONDE GUARDAR LAS IMAGENES.
      const localStorageDefaultCollection = localStorage.getItem(
        "defaultCollection"
      ) as string;
      const parsedLocalStorageDefaultCollection = JSON.parse(
        localStorageDefaultCollection
      );
      parsedLocalStorageDefaultCollection &&
        setDefaultCollection(parsedLocalStorageDefaultCollection);

      const localStorageUser = localStorage.getItem("user");
      // !VERIFICA SI ES QUE LA IMAGEN YA EXISTE EN LA COLECCION DEFAULT O SELECIONADA.
      if (localStorageUser) {
        const parsedLocalStorageUser = JSON.parse(
          localStorageUser
        ) as UserProps;
        // console.log(parsedLocalStorageUser)
        if (parsedLocalStorageUser) {
          setCollections(parsedLocalStorageUser.collections);
          const index = parsedLocalStorageUser.collections.findIndex(
            (e:Collection) => e._id === parsedLocalStorageDefaultCollection.id
          );
          if (index !== -1) {
            const match = parsedLocalStorageUser.collections[index].images.some(
              (e: { file_url: string; preview_url: string }) =>
                e.file_url === data.file_url
            );
            setIsLoading(String(match) as ButtonStates);
          } else {
            setIsLoading("false");
          }
        }
      }
    }
  }, [data]);
  useEffect(() => {
    const userLocal = localStorage.getItem("user") as string;
    setUser(JSON.parse(userLocal));
  }, [collections]);
  return (
    <div>
      <div className="bg-white sm:shadow-2xl max-w-xl max-h-[1500px] lg:max-w-5xl xl:max-w-6xl mx-auto sm:rounded-3xl overflow-hidden flex flex-col lg:flex-row p-0">
        {paramsProperties ? (
          <section className="w-full lg:w-3/4 relative">
            {paramsProperties.type_file === "mp4" ||
            paramsProperties.type_file === "webm" ? (
              <video
                width={paramsProperties.width}
                height={paramsProperties.height}
                src={paramsProperties.file_url}
                preload="auto"
                controls
                className="w-full object-cover"
                onPlay={(e) => (e.currentTarget.volume = 0.5)}
              />
            ) : loadImage ? (
              <img
                width={paramsProperties.width}
                height={paramsProperties.height}
                src={paramsProperties.file_url}
                alt=""
                className="rounded-l-2xl brightness-95 w-full object-cover"
              />
            ) : (
              <img
                width={paramsProperties.width}
                height={paramsProperties.height}
                src={paramsProperties.preview_url}
                alt=""
                className="rounded-l-2xl brightness-95 w-full object-cover"
              />
            )}
          </section>
        ) : (
          <section className="w-full lg:w-3/4 relative">
            <div className="animate-card-squeleton max-w-[600px] min-h-[600px] w-full h-full"></div>
          </section>
        )}
        <div className="lg:p-10 p-5 lg:w-[70%] w-full max-h-fit overflow-hidden border-b-[1px]">
          {data ? (
            <div>
              {/* HEADER ----------------------------------- */}
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
                    // isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                )}

                {/* BUTON SECTION FOR SAVE OR DELETE IMG FROM COLLECTION */}
                {defaultCollection && collections && (
                  <SaveButton
                    isLoading={isLoading}
                    handleSave={handleSave}
                    handleRemove={handleRemove}
                    defaultCollection={defaultCollection}
                  />
                )}
              </div>
              {/* BODY ------------------------------------ */}
              <div>
                <div className="flex items-center gap-3 mt-5">
                  <div className="bg-rose-400 w-12 h-12 rounded-full grid place-content-center uppercase font-semibold text-white">
                    {data?.owner.split("")[0]}
                  </div>
                  <p className="font-semibold">{data?.owner}</p>
                </div>

                {/* CONTENT TO SAVED IN MOBILE */}
                <div className="lg:flex mt-5  hidden">
                  <div className="">
                    {data.tags.some((e: TagAttributes) => e.type === 1) && (
                      <div className="">
                        <h2 className=" font-semibold capitalize">artist</h2>
                        <div className="my-2 flex gap-1">
                          {data.tags.map((el: TagAttributes, i: number) => {
                            if (el.type === 1) {
                              return (
                                <TagButton
                                  key={String(i) + String(el.id) + extension}
                                  type={el.type}
                                >
                                  {el.name}
                                </TagButton>
                              );
                            }
                          })}
                        </div>
                      </div>
                    )}

                    {data.tags.some((e: TagAttributes) => e.type === 3) && (
                      <div>
                        <h2 className=" font-semibold capitalize">copyright</h2>
                        <div className="my-2 flex flex-wrap gap-2">
                          {data.tags.map((el: TagAttributes, i: number) => {
                            if (el.type === 3) {
                              return (
                                <TagButton
                                  key={String(i) + String(el.id) + extension}
                                  type={el.type}
                                >
                                  {el.name}
                                </TagButton>
                              );
                            }
                          })}
                        </div>
                      </div>
                    )}

                    {data.tags.some((e: TagAttributes) => e.type === 4) && (
                      <div>
                        <h2 className=" font-semibold capitalize">character</h2>
                        <div className="my-2 flex flex-wrap gap-2">
                          {data.tags.map((el: TagAttributes, i: number) => {
                            if (el.type === 4) {
                              return (
                                <TagButton
                                  key={String(i) + String(el.id) + extension}
                                  type={el.type}
                                >
                                  {el.name}
                                </TagButton>
                              );
                            }
                          })}
                        </div>
                      </div>
                    )}

                    {data.tags.some((e: TagAttributes) => e.type === 5) && (
                      <div>
                        <h2 className=" font-semibold capitalize">meta</h2>
                        <div className="my-2 flex flex-wrap gap-2">
                          {data.tags.map((el: TagAttributes, i: number) => {
                            if (el.type === 5) {
                              return (
                                <TagButton
                                  key={String(i) + String(el.id) + extension}
                                  type={el.type}
                                >
                                  {el.name}
                                </TagButton>
                              );
                            }
                          })}
                        </div>
                      </div>
                    )}
                    {data.tags.some((e: TagAttributes) => e.type === 0) && (
                      <div className="">
                        <h2 className=" font-semibold capitalize">general</h2>
                        <div className="my-2 flex flex-wrap gap-2">
                          {data.tags
                            .slice(0, 20)
                            .map((el: TagAttributes, i: number) => {
                              if (el.type === 0) {
                                return (
                                  <TagButton
                                    key={String(i) + String(el.id) + extension}
                                    type={el.type}
                                  >
                                    {el.name}
                                  </TagButton>
                                );
                              }
                            })}
                        </div>
                      </div>
                    )}
                  </div>
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
                      {/* <SaveButton /> */}
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
          ) : (
            <div className="flex flex-col">
              <div className="animate-card-squeleton w-2/3 self-end h-12 rounded-full"></div>
              <div className="w-full mt-5 flex gap-3">
                <div className="w-14 h-14 min-w-14 min-h-14 animate-card-squeleton rounded-full"></div>
                <div className="w-1/2 h-12 animate-card-squeleton rounded-full"></div>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <div className="animate-card-squeleton w-1/2 h-12 rounded-full"></div>
                <div className="animate-card-squeleton w-full h-12 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* FOOTER */}
      <section></section>
    </div>
  );
}

export default PostById;
