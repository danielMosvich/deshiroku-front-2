import { useState, useEffect } from "react";
import Masonry from "react-layout-masonry";

function Collection({ id, user }) {
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
  useEffect(() => {
    async function getCollection() {
      const res = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/user/collection/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      setData(data);
    }
    getCollection();
  }, []);
  return (
    <div>
      {data ? (
        <div>
          <h2
            onClick={handleEditCollection}
            className="text-3xl mt-10 mb-5 text-center capitalize font-semibold hover:underline cursor-pointer w-fit mx-auto"
          >
            {data.name}
          </h2>
          {/* AVATAR */}
          <div className="bg-red-500 w-12 h-12 rounded-full grid place-content-center font-bold uppercase mx-auto">
            {data.name.split("")[0]}
          </div>
          <div className="flex justify-center gap-3 my-5">
            <div className="bg-neutral-100 p-3 w-fit font-semibold rounded-xl">
              {String(data.images.length)} images
            </div>
            <button
              onClick={handleDeleteCollection}
              className="bg-rose-500 text-white py-3 px-4 w-fit font-semibold rounded-xl flex items-center gap-1"
            >
              {/* <p>delete</p> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zM7 6h10v13H7zm2 2v9h2V8zm4 0v9h2V8z"
                />
              </svg>
            </button>
          </div>
          {data.images ? (
            <div className="lg:px-20 sm:px-10  px-5">
              <Masonry
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
                {data.images.map((e, index) => {
                  return (
                    <a
                      href={`/extensions/${e.extension}/post/${e.id}`}
                      key={e.id}
                      className=""
                    >
                      <img
                        className="w-full rounded-xl max-h-[500px] object-cover"
                        src={e.preview_url}
                        alt={e.owner + "image"}
                        loading="lazy"
                      />
                      <div className="flex gap-1 items-center mt-2">
                        <div className="rounded-full bg-neutral-200 w-8 h-8 grid place-content-center">
                          <p className="uppercase font-semibold">
                            {e.owner.split("")[0]}
                            {index}
                          </p>
                        </div>
                        <h2>{e.owner}</h2>
                      </div>
                    </a>
                  );
                })}
              </Masonry>
            </div>
          ) : (
            <div>loading</div>
          )}
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
}
export default Collection;
