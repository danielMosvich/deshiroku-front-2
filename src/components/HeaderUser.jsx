import { useEffect, useState } from "react";
import DropDown from "./dropDown";

function HeaderUser() {
  const [data, setData] = useState(null);
  function obtenerCookies() {
    const cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [nombre, valor] = cookie.split("=").map((part) => part.trim());
      cookies[nombre] = decodeURIComponent(valor);
    });
    return cookies;
  }
  function getCookieByName(name) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Verificar si la cookie comienza con el nombre buscado
      if (cookie.startsWith(name + "=")) {
        // Devolver el valor de la cookie
        return cookie.substring(name.length + 1);
      }
    }
    // Si no se encuentra la cookie, devolver null
    return null;
  }
  useEffect(() => {
    const localStorageData = localStorage.getItem("user");
    const localStorageCollection = localStorage.getItem("defaultCollection");

    if (getCookieByName("token")) {
      if (localStorageData) {
        const data = JSON.parse(localStorageData);
        setData(data);
        if (!localStorageCollection) {
          const firstCollection = {
            name: data.collections[0].name,
            id: data.collections[0]._id,
          };
          localStorage.setItem(
            "defaultCollection",
            JSON.stringify(firstCollection)
          );
        }
      } else {
        async function getProfile() {
          const token = obtenerCookies();
          // console.log(token.token);
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
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data.data));
          window.location.reload();
        }
        getProfile();
      }
    } else {
      setData(undefined);
    }
  }, []);
  return (
    <div className="flex gap-1 ml-3 items-center">
      {data === null ? (
        <div className="bg-neutral-200 w-20 h-full rounded-xl"></div>
      ) : data ? (
        <div className="flex items-center">
          <a
            href={`/${data.username}`}
            className="hover:bg-neutral-200 w-12 h-12 rounded-full grid
          place-content-center font-semibold uppercase"
          >
            <div
              className="bg-gradient-to-t
          from-rose-500 to-pink-400 text-white w-9 h-9 rounded-full grid
          place-content-center font-semibold uppercase"
            >
              {data.name.split("")[0]}
            </div>
          </a>
          <DropDown data={data} />
        </div>
      ) : (
        <div className="flex gap-2">
          <a
            href="/login"
            className="bg-neutral-200 px-5 py-2 rounded-full font-semibold"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-rose-500 text-white px-5 py-2 rounded-full font-semibold"
          >
            Register
          </a>
        </div>
      )}
    </div>
  );
}
export default HeaderUser;
