import { useEffect, useRef, useState } from "react";
import getPostById from "../../../../../services/getPostById";
import type {
  ImagesProps,
  TagAttributes,
} from "../../../../../types/ImagesProps";
import type { Collection, UserProps } from "../../../../../types/UserProps";
import TagButton from "../../../../../components/header/TagButton";
import MagicSearch from "../../../../../components/header/magicSearch";
import {
  STORE_auth_modal,
  STORE_defaultCollection,
  STORE_user,
} from "../../../../../store/userStore.ts";
import { useStore } from "@nanostores/react";
import getMe from "../../../../../api/user/get/getMe";
import DropdownContainer from "../../../../../components/global-react/dropdownContainer";
import SelectCollection from "../../../../../components/post/selectCollection";
import ButtonSave from "../../../../../components/post/buttonSave";
import DownloadButton from "../../../../../components/header/downloadButton";
import MyButton from "../../../../../components/global-react/myButton";
import ModalContainer from "../../../../../components/global-react/modalContainer.tsx";
interface ParamsProps {
  preview_url: string;
  file_url: string;
  width: number;
  height: number;
  type_file: string;
}
function PostById({ extension, id }: { extension: string; id: string }) {
  // * NANOSTATES ------------------------->
  const $user = useStore(STORE_user) as UserProps;
  const $defaultCollection = useStore(STORE_defaultCollection) as Collection;
  // ?^^ hooks--------------------------->
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paramsProperties, setParamsProperties] = useState<null | ParamsProps>(
    null
  );
  const [loadImage, setLoadImage] = useState<boolean>(false);
  const [post, setPost] = useState<null | ImagesProps>(null);
  const [defaultCollection, setDefaultCollection] = useState<null | Collection>(
    null
  );
  const [collections, setCollections] = useState<null | Collection[]>(null);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  const [showSaveCollectionModal, setShowSaveCollectionModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  // TODO FUNCTIONS --------------------->
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
      setPost(data.data);
      if (!paramsProperties) {
        setParamsProperties({
          file_url: data.data.file_url,
          preview_url: data.data.preview_url,
          height: data.data.height,
          width: data.data.width,
          type_file: data.data.type_file,
        });
        if (data.data.type_file !== "mp4" && data.data.type_file !== "webm") {
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
  function searchSource(url: string) {
    if (url) {
      try {
        const dominio = new URL(url).origin;
        return dominio.split("//")[1];
      } catch (error) {
        return "https://icons.duckduckgo.com/ip2/.ico";
      }
    }
  }
  // VOLUME DETECTOR
  useEffect(() => {
    const savedVolume = localStorage.getItem("videoVolume");
    if (savedVolume !== null && videoRef.current) {
      videoRef.current.volume = parseFloat(savedVolume);
    }

    // Añadir un event listener para el cambio de volumen
    const handleVolumeChange = () => {
      if (videoRef.current) {
        const currentVolume = videoRef.current.volume;
        localStorage.setItem("videoVolume", String(currentVolume));
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("volumechange", handleVolumeChange);
    }

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener(
          "volumechange",
          handleVolumeChange
        );
      }
    };
  }, [videoRef.current]);

  useEffect(() => {
    setParams();
    getDataById();
  }, []);
  useEffect(() => {
    if (post) {
      // ! ESTO VERIFICA SI ES QUE EXISTE UNA COLLECTION POR DEFECTO DONDE GUARDAR LAS IMAGENES.
      $defaultCollection &&
        setDefaultCollection($defaultCollection as Collection);
      if ($user) {
        setCollections($user.collections);
      }
    }
  }, [post]);
  useEffect(() => {
    if (!$user) {
      getMe().then((res) => {
        if (res.success) {
          STORE_user.set(res.data);
        }
      });
    }
  }, [collections]);
  return (
    <div>
      {showAllTags && (
        <ModalContainer
          icon
          height="80%"
          onClose={() => setShowAllTags(false)}
          title={`All tags about this post - ${post?.tags_length}`}
        >
          <div className="flex flex-wrap min-h-fit max-h-full p-2 pb-10 gap-2">
            {post?.tags.map((el: TagAttributes, i: number) => {
              if (el.type || el.type === 0) {
                return (
                  <TagButton
                    action={() => {
                      window.location.href = `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22${el.name}%20${el.count}%22%2C%22type%22%3A%22${el.type}%22%2C%22value%22%3A%22${el.name}%22%7D%5D`;
                    }}
                    key={String(i) + String(el.id) + extension}
                    type={el.type}
                  >
                    {el.name}
                  </TagButton>
                );
              }
            })}
          </div>
        </ModalContainer>
      )}
      <div className="bg-white dark:bg-neutral-900 dark:shadow-none sm:shadow-2xl max-w-xl h-fit  lg:max-w-5xl xl:max-w-6xl mx-auto sm:rounded-3xl flex flex-col lg:flex-row p-0 mb-5 border-b-[1px] sm:border-none dark:border-neutral-700">
        {/* PARAMS PROPERTIES SON LAS PROPIEDADES DESDE LA URL PARA CARGAR MAS RAPIDO */}
        {paramsProperties ? (
          <section className="w-full lg:w-3/4 relative overflow-hidden lg:max-h-[calc(170vh)] max-h-[calc(190vh)] rounded-t-2xl lg:rounded-2xl">
            {paramsProperties.type_file === "mp4" ||
            paramsProperties.type_file === "webm" ? (
              <video
                ref={videoRef}
                width={paramsProperties.width}
                height={paramsProperties.height}
                src={paramsProperties.file_url}
                preload="auto"
                controls
                className="lg:rounded-2xl rounded-t-3xl w-full object-cover "
                onPlay={(e) => {
                  const savedVolume = localStorage.getItem(
                    "videoVolume"
                  ) as string;
                  if (savedVolume) {
                    if (e.target && "volume" in e.target) {
                      e.target.volume =
                        savedVolume !== null
                          ? parseFloat(savedVolume)
                          : e.target.volume;
                    }
                  }
                }}
              />
            ) : loadImage ? (
              <img
                width={paramsProperties.width}
                height={paramsProperties.height}
                src={paramsProperties.file_url}
                alt=""
                className="rounded-t-2xl lg:rounded-2xl brightness-95 w-full object-cover relative"
              />
            ) : (
              <img
                width={paramsProperties.width}
                height={paramsProperties.height}
                src={paramsProperties.preview_url}
                alt=""
                className="rounded-t-2xl lg:rounded-2xl brightness-95 w-full object-cover "
              />
            )}
            <a target="_blank" href={`${paramsProperties.file_url}`} className="absolute top-3 left-3 flex items-center">
              <MyButton radius="full" size="sm" variant="faded">show original</MyButton>
            </a>
          </section>
        ) : (
          <section className="w-full lg:w-3/4 relative max-h-[1200px] overflow-hidden">
            <div className="animate-card-squeleton max-w-[1200px] min-h-[600px] w-full h-full rounded-t-2xl lg:rounded-2xl"></div>
          </section>
        )}
        {/* DATA SECTION */}
        <div className="lg:px-10 px-5 lg:pb-10 pb-5 lg:w-[70%] w-full ">
          {post ? (
            <div className="">
              {/* HEADER ----------------------------------- */}

              <div className="z-10 hidden justify-end lg:flex bg-white dark:bg-neutral-900 items-center sticky top-0 lg:pt-10 pt-3 pb-3 lg:pb-5 gap-2">
                {post && (
                  <MagicSearch
                    type={post.type_file}
                    file_url={paramsProperties?.file_url}
                    source={post.source}
                  />
                )}
                {post.file_url && <DownloadButton url={post.file_url} />}

                {$defaultCollection && $defaultCollection.name && (
                  <DropdownContainer
                    position="bottom"
                    dropdownContent={<SelectCollection post={post} />}
                  >
                    <MyButton variant="faded" radius="full">
                      <div className="flex items-center gap-2">
                        {$defaultCollection.name}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 20"
                          width={24}
                          height={24}
                          color={"currentColor"}
                          fill={"none"}
                        >
                          <path
                            d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </MyButton>
                  </DropdownContainer>
                )}

                {$defaultCollection ? (
                  <ButtonSave id={$defaultCollection._id} post={post} />
                ) : (
                  <MyButton radius="full">Save</MyButton>
                )}
              </div>

              {/* BODY ------------------------------------ */}
              <div className="">
                <div className="flex items-center gap-3 mt-5">
                  <div className="bg-rose-400 lg:mt-0 w-12 h-12 rounded-full grid place-content-center uppercase font-semibold text-white">
                    {post?.owner.split("")[0]}
                  </div>
                  <p className="font-semibold dark:text-white">{post?.owner}</p>
                </div>

                {/* TAGS CONTENT */}
                <div className="lg:flex mt-5 pl-1 hidden">
                  <div className="">
                    {post.tags.some((e: TagAttributes) => e.type === 1) && (
                      <div className="">
                        <h2 className=" font-semibold capitalize text-sm dark:text-white/50">
                          artist
                        </h2>
                        <div className="my-2 flex gap-1 flex-wrap">
                          {post.tags.map((el: TagAttributes, i: number) => {
                            if (el.type === 1) {
                              return (
                                <TagButton
                                  action={() => {
                                    window.location.href = `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22${el.name}%20${el.count}%22%2C%22type%22%3A%22${el.type}%22%2C%22value%22%3A%22${el.name}%22%7D%5D`;
                                  }}
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

                    {post.tags.some((e: TagAttributes) => e.type === 3) && (
                      <div>
                        <h2 className=" font-semibold capitalize text-sm dark:text-white/50">
                          copyright
                        </h2>
                        <div className="my-2 flex flex-wrap gap-2">
                          {post.tags.map((el: TagAttributes, i: number) => {
                            if (el.type === 3) {
                              return (
                                <TagButton
                                  action={() => {
                                    window.location.href = `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22${el.name}%20${el.count}%22%2C%22type%22%3A%22${el.type}%22%2C%22value%22%3A%22${el.name}%22%7D%5D`;
                                  }}
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

                    {post.tags.some((e: TagAttributes) => e.type === 4) && (
                      <div>
                        <h2 className=" font-semibold capitalize text-sm dark:text-white/50">
                          character
                        </h2>
                        <div className="my-2 flex flex-wrap gap-2">
                          {post.tags.map((el: TagAttributes, i: number) => {
                            if (el.type === 4) {
                              return (
                                <TagButton
                                  action={() => {
                                    window.location.href = `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22${el.name}%20${el.count}%22%2C%22type%22%3A%22${el.type}%22%2C%22value%22%3A%22${el.name}%22%7D%5D`;
                                  }}
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

                    {post.tags.some((e: TagAttributes) => e.type === 5) && (
                      <div>
                        <h2 className=" font-semibold capitalize text-sm dark:text-white/50">
                          meta
                        </h2>
                        <div className="my-2 flex flex-wrap gap-2">
                          {post.tags.map((el: TagAttributes, i: number) => {
                            if (el.type === 5) {
                              return (
                                <TagButton
                                  action={() => {
                                    window.location.href = `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22${el.name}%20${el.count}%22%2C%22type%22%3A%22${el.type}%22%2C%22value%22%3A%22${el.name}%22%7D%5D`;
                                  }}
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
                    {post.tags.some((e: TagAttributes) => e.type === 0) && (
                      <div className="">
                        <h2 className=" font-semibold capitalize text-sm dark:text-white/50">
                          general
                        </h2>
                        <div className="">
                          {post.tags_length < 30 ? (
                            <div className="flex flex-wrap my-2 gap-1">
                              {post.tags.map((el: TagAttributes, i: number) => {
                                if (el.type === 0) {
                                  return (
                                    <TagButton
                                      action={() => {
                                        window.location.href = `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22${el.name}%20${el.count}%22%2C%22type%22%3A%22${el.type}%22%2C%22value%22%3A%22${el.name}%22%7D%5D`;
                                      }}
                                      key={
                                        String(i) + String(el.id) + extension
                                      }
                                      type={el.type}
                                    >
                                      {el.name}
                                    </TagButton>
                                  );
                                }
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div
                                style={{
                                  maskImage:
                                    "linear-gradient(black 50%, transparent)",
                                }}
                                className="flex flex-wrap my-2 gap-1"
                              >
                                {post.tags
                                  .slice(0, 30)
                                  .map((el: TagAttributes, i: number) => {
                                    if (el.type === 0) {
                                      return (
                                        <TagButton
                                          action={() => {
                                            window.location.href = `/extensions/${extension}/search/tags=%5B%7B%22label%22%3A%22${el.name}%20${el.count}%22%2C%22type%22%3A%22${el.type}%22%2C%22value%22%3A%22${el.name}%22%7D%5D`;
                                          }}
                                          key={
                                            String(i) +
                                            String(el.id) +
                                            extension
                                          }
                                          type={el.type}
                                        >
                                          {el.name}
                                        </TagButton>
                                      );
                                    }
                                  })}
                              </div>
                              <MyButton
                                onClick={() => setShowAllTags(true)}
                                variant="flat"
                                radius="full"
                              >
                                show all tags ({post.tags_length})
                              </MyButton>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTENT TO SAVED IN MOBILE */}
                <div className="lg:hidden flex  mt-5 ">
                  {/* {post && post.tags.tags.length} */}
                  {post && (
                    <div className="flex items-center justify-center gap-3 w-full">
                      <DownloadButton url={post.file_url} />
                      <MyButton
                        radius="full"
                        variant="flat"
                        onClick={() => {
                          setShowSourceModal(true);
                        }}
                      >
                        Source
                      </MyButton>
                      {defaultCollection ? (
                        <MyButton
                          onClick={() => setShowSaveCollectionModal(true)}
                          radius="full"
                          variant="shadow"
                        >
                          save
                        </MyButton>
                      ) : (
                        // CUANDO NO HAY UNA CUENTA
                        <MyButton
                          onClick={() => STORE_auth_modal.set(true)}
                          radius="full"
                        >
                          save
                        </MyButton>
                      )}
                      <MyButton
                        radius="full"
                        variant="light"
                        onClick={() => setShowAllTags(true)}
                      >
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
                      </MyButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* DESKTOP */}
              <div className="lg:flex md:flex-col hidden">
                <div className="animate-card-squeleton w-2/3 self-end h-12 rounded-full mt-10"></div>
                <div className="w-full mt-5 flex gap-3">
                  <div className="w-12 h-12 min-w-12 min-h-12 animate-card-squeleton rounded-full"></div>
                  <div className="w-1/2 h-12 animate-card-squeleton rounded-full"></div>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <div className="animate-card-squeleton w-1/2 h-12 rounded-full"></div>
                  <div className="animate-card-squeleton w-full h-12 rounded-full"></div>
                  <div className="animate-card-squeleton w-full h-12 rounded-full"></div>
                </div>
              </div>
              {/* mobile */}
              <div className="lg:hidden flex flex-col ">
                <div className="w-full mt-5 flex gap-3 items-center">
                  <div className="w-12 h-12 min-w-12 min-h-12 animate-card-squeleton rounded-full"></div>
                  <div className="w-1/2 h-8 animate-card-squeleton rounded-full"></div>
                </div>
                <div className=" mt-5 flex gap-3">
                  <div className="animate-card-squeleton flex-1 h-12 rounded-full"></div>
                  <div className="animate-card-squeleton flex-1 h-12 rounded-full"></div>
                  <div className="animate-card-squeleton flex-1 h-12 rounded-full"></div>
                  <div className="animate-card-squeleton flex-1 h-12 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* MODALS !--------------------> */}
      {showSaveCollectionModal && (
        // TODO save image in collection - modal
        <ModalContainer
          onClose={() => setShowSaveCollectionModal(false)}
          height="65%"
        >
          <div className="flex gap-5 pb-2 flex-col">
            <div className="w-full py-5 sticky top-0 bg-white dark:bg-neutral-900/90 backdrop-blur-2xl">
              <h2 className="text-center text-xl font-[500] dark:text-white ">
                Save image
              </h2>
            </div>
            <div className="flex flex-col overflow-auto px-2">
              <div className="dark:text-white text-sm font-ui flex mb-2 ml-2">
                Your collections
              </div>
              {$user &&
                post &&
                $user.collections.map((collection: Collection) => (
                  <ButtonSave
                    key={collection._id}
                    id={collection._id}
                    post={post}
                    isContainer
                  >
                    <div
                      key={collection._id}
                      className="flex items-center gap-2 rounded-xl p-2 active:bg-neutral-600 select-none"
                    >
                      <div className="w-16 h-16 overflow-hidden rounded-lg">
                        <img
                          src={collection.images[0].preview_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1 text-lg font-semibold dark:text-white">
                        <h3>{collection.name}</h3>
                      </div>
                    </div>
                  </ButtonSave>
                ))}
            </div>
          </div>
        </ModalContainer>
      )}
      {showSourceModal && post && (
        <ModalContainer height="65%" onClose={() => setShowSourceModal(false)}>
          <div className="flex flex-col">
            <div className="w-full py-5 sticky top-0 bg-white dark:bg-neutral-900/90 backdrop-blur-2xl">
              <h2 className="text-center text-xl font-[500] dark:text-white ">
                Search Image
              </h2>
            </div>
            <div className="flex flex-col">
              {post.source && (
                <a
                  target="_blank"
                  href={post.source}
                  className="whitespace-nowrap text-ellipsis font-semibold px-3 py-4 w-full text-start flex items-center gap-3 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 border-b border-t dark:border-neutral-700"
                >
                  <i className="w-6 h-6 max-w-6 max-h-6 min-w-6 min-h-6 rounded-md overflow-hidden">
                    <img
                      className="w-full h-full"
                      src={`https://icons.duckduckgo.com/ip2/${searchSource(
                        post.source
                      )}.ico`}
                      alt=""
                    />
                  </i>
                  <span>Original source</span>
                </a>
              )}
              <a
                target="_blank"
                href={`https://saucenao.com/search.php?db=999&url=${post.file_url}`}
                className="whitespace-nowrap text-ellipsis font-semibold px-3 py-4 w-full text-start flex items-center gap-3 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <i className="w-6 h-6 max-w-6 max-h-6 min-w-6 min-h-6 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/saucenao.com.ico`}
                    alt=""
                  />
                </i>
                <span>Search with Saoucenao</span>
              </a>
              <a
                target="_blank"
                href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
                  post.file_url
                )}`}
                className="whitespace-nowrap text-ellipsis font-semibold px-3 py-4 w-full text-start flex items-center gap-3 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/google.com.ico`}
                    alt=""
                  />
                </i>
                <span>Search with Google lens</span>
              </a>
              <a
                target="_blank"
                href={`https://ascii2d.net/search/url/${post.file_url}`}
                className="whitespace-nowrap text-ellipsis font-semibold px-3 py-4 w-full text-start flex items-center gap-3 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/ascii2d.net.ico`}
                    alt=""
                  />
                </i>
                <span>Search with ASCII2D</span>
              </a>
              <a
                target="_blank"
                href={`https://iqdb.org/?url=${post.file_url}`}
                className="whitespace-nowrap text-ellipsis font-semibold px-3 py-4 w-full text-start flex items-center gap-3 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/iqdb.org.ico`}
                    alt=""
                  />
                </i>
                <span>Search with IQDB</span>
              </a>
              <a
                target="_blank"
                href={`https://yandex.ru/images/search?rpt=imageview&img_url=${post.file_url}`}
                className="whitespace-nowrap text-ellipsis font-semibold px-3 py-4 w-full text-start flex items-center gap-3 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/yandex.com.ico`}
                    alt=""
                  />
                </i>
                <span>Search with Yandex</span>
              </a>
            </div>
          </div>
        </ModalContainer>
      )}
      {/* FOOTER (more posts) */}
      <section></section>
    </div>
  );
}

export default PostById;
