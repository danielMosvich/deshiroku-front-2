import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Card from "../../../components/Card";
import Button from "../../../components/global-react/button";
import getCollectionByUsername from "../../../api/user/get/getCollectionByUsername";
function Collection({ id, user, collection }) {
  const [data, setData] = useState(null);
  function obtenerCookies() {
    const cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [nombre, valor] = cookie.split("=").map((part) => part.trim());
      cookies[nombre] = decodeURIComponent(valor);
    });
    return cookies;
  }
  async function handleDeleteCollection() {
    const token = obtenerCookies();
    const response = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collections`,
      {
        method: "DELETE",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`,
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );
    const dat = await response.json();
    localStorage.setItem("user", JSON.stringify(dat));
    function detectDefaultCollection() {
      const localCollection = localStorage.getItem("defaultCollection");
      const parsedLocalCollection = JSON.parse(localCollection);
      const exist = dat.collections.some(
        (e) => e._id === parsedLocalCollection.id
      );
      console.log(exist);
      if (!exist) {
        if (dat.collections[0]) {
          localStorage.setItem(
            "defaultCollection",
            JSON.stringify(dat.collections[0])
          );
        } else {
          localStorage.removeItem("defaultCollection");
        }
      }
    }
    detectDefaultCollection();
    alert("deleted collection");
    window.location.href = `/${user}`;
  }
  async function handleEditCollection() {
    const newName = prompt("NUEVO NOMBRE DE LA COLECCION");
    if (newName) {
      const token = obtenerCookies();
      const response = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collections`,
        {
          method: "PUT",
          // credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
          body: JSON.stringify({
            id: id,
            name: newName,
          }),
        }
      );
      const dat = await response.json();
      if (dat.success) {
        localStorage.setItem("user", JSON.stringify(dat.r));
        window.location.reload();
      } else {
        alert(dat.message);
      }
    }
  }
  function getHref(element, extension) {
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
  function obtenerCookies() {
    const cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [nombre, valor] = cookie.split("=").map((part) => part.trim());
      cookies[nombre] = decodeURIComponent(valor);
    });
    return cookies;
  }
  useEffect(() => {
    getCollectionByUsername(user,collection).then(res =>{
      console.log(res)
      if(res.success){
        setData(res.data)
      }
    })
  }, []);

  return (
    <div className="relative lg:px-20 sm:px-10  px-2">
      {data ? (
        <div className="flex items-center justify-center flex-col mt-10 mb-5">
          <h2 className="text-3xl font-semibold font-ui">{data.name}</h2>
          <h2>by @{user}</h2>

          {data.isOwner && (
            <div className="flex gap-2 mt-5">
              <Button>Edit name</Button>
              <Button variant="solid">Delete</Button>
            </div>
          )}
        </div>
      ) : (
        <div className=" flex flex-col  mt-10 mb-5">
          <div className="w-full items-center flex flex-col gap-1">
            <div className="w-52 h-9 animate-card-squeleton rounded-full"></div>
            <div className="w-52 h-6 animate-card-squeleton rounded-full"></div>
          </div>
          <div className="w-full mt-[10px]  flex justify-center gap-2">
            <div className="w-28 h-12 animate-card-squeleton rounded-full"></div>
            <div className="w-20 h-12 animate-card-squeleton rounded-full"></div>
          </div>
        </div>
      )}
      {data ? (
        <div className="pb-3">
          <h2 className="font-semibold text-neutral-900 border-b w-fit border-neutral-900 md:text-lg">
            {data.images.length} images
          </h2>
        </div>
      ) : (
        <div className="w-full pb-3 flex ">
          <div className="w-20 md:w-24 h-[29px] animate-card-squeleton rounded-full"></div>
        </div>
      )}
      {data && data.images && data.images.length > 0 ? (
        <div>
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
            {data.images.map((e, index) =>
              e.extension === "load" ? (
                //! AQUI VA LAS CARTAS ROSAS (ESQUELETON)
                <Card delay={index} key={`${index}-load-${page}`} />
              ) : (
                // AQUI LAS CARTAS NORMALES
                <a
                  className="w-full"
                  href={getHref(e, e.extension)}
                  key={`${e.id}-page-${user}-index-${index}`}
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
        <div className="md:max-h-[calc(100vh-223px-80px)]  md:min-h-[calc(100vh-223px-80px)] max-h-[calc(100vh-223px-56px)]  min-h-[calc(100vh-223px-56px)] overflow-y-clip">
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
  );
}
export default Collection;
