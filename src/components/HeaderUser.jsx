import { useEffect, useState } from "react";
import DropDown from "./dropDown";
import LoginComponent from "../components/header/login";
import RegisterComponent from "../components/header/register";

function HeaderUser() {
  const [data, setData] = useState(undefined);
  const [activeLogin, setActiveLogin] = useState(false);
  const [activeRegister, setActiveRegister] = useState(false);
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

  function whenExpiresToken() {
    if (getCookieByName("refresh_token")) {
      async function refreshToken() {
        try {
          const { refresh_token } = obtenerCookies();
          const res = await fetch(
            `${import.meta.env.PUBLIC_SERVER_URL}/api/user/refresh-token`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JSON.stringify({
                  token: refresh_token,
                })}`,
              },
            }
          );
          const data = await res.json();
          console.log(data);
          if (data) {
            const currentTime = new Date(); // <== tiempo actual

            const dataCookie = data;
            const expirationTime = dataCookie.access_token.expires_in; // <== una hora
            const expirationDate = new Date(
              currentTime.getTime() + expirationTime
            );
            const expirationDateString = expirationDate.toUTCString();
            const access_token = `token=${dataCookie.access_token.token}; expires=${expirationDateString}; path=/`;

            // * REFRESH TOKEN ---------
            const expirationTimeRefresh = dataCookie.refresh_token.expires_in;
            const expirationDateRefresh = new Date(
              currentTime.getTime() + expirationTimeRefresh
            );
            const expirationDateStringRefresh = expirationDateRefresh;
            const refresh_token = `refresh_token=${dataCookie.refresh_token.token}; expires=${expirationDateStringRefresh}; path=/`;
            document.cookie = access_token;
            document.cookie = refresh_token;

            // !LO QUE HACE UNA VEZ TENGA EL COOKIE XD
            localStorage.clear();
            window.location.reload();
            return;
          }
        } catch (error) {
          setData(undefined);
          localStorage.clear();
          return;
        }
      }
      refreshToken();
    } else {
      setData(undefined);
      localStorage.clear();
      window.location.reload();
    }
  }
  function logout() {
    localStorage.clear();
    const cookies = document.cookie.split(";");

    // Iterar sobre todas las cookies y eliminarlas
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const igualPos = cookie.indexOf("=");
      const nombre = igualPos > -1 ? cookie.slice(0, igualPos) : cookie;
      document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
    alert("LOGOUT");
    window.location.href = "/";
  }
  //!!! LOGIN STATE
  useEffect(() => {
    const localStorageData = localStorage.getItem("user");
    const localStorageCollection = localStorage.getItem("defaultCollection");
    const localTime = localStorage.getItem("time");

    if (localTime) {
      // Recuperar los datos del almacenamiento local
      const storedData = JSON.parse(localStorage.getItem("time"));
      const currentTimeMillis = new Date().getTime();
      const expirationTime = storedData.current_time + storedData.expires_in;
      const tenMinutesBeforeExpiration = expirationTime - 10 * 60 * 1000;
      if (currentTimeMillis >= tenMinutesBeforeExpiration) {
        whenExpiresToken();
      } else {
        console.log(
          "Todavía faltan más de 10 minutos para que expire el token"
        );
      }
    }

    if (getCookieByName("token") && getCookieByName("refresh_token")) {
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
          console.log(token);
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
      if (getCookieByName("refresh_token")) {
        whenExpiresToken();
      }
      if (getCookieByName("token")) {
        logout();
      }
    }
  }, []);

  return (
    <>
      <div className="hidden gap-1 ml-3 items-center md:flex">
        {data === null ? (
          <div className="bg-neutral-200 w-20 py-2 rounded-xl text-center text-transparent">
            loading
          </div>
        ) : data ? (
          <div className="flex items-center">
            <a
              href={`/${data.username}`}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-700 w-12 h-12 rounded-full grid
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
            <button
              // href="/login"
              onClick={() => setActiveLogin(true)}
              className="bg-neutral-200 dark:bg-white px-5 py-2 rounded-full font-semibold cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => setActiveRegister(true)}
              className="bg-rose-500 text-white px-5 py-2 rounded-full font-semibold cursor-pointer"
            >
              Register
            </button>
            {activeLogin && (
              <LoginComponent close={() => setActiveLogin(false)} />
            )}
            {activeRegister && (
              <RegisterComponent close={() => setActiveRegister(false)} />
            )}
          </div>
        )}
      </div>
      {data ? (
        <div className="flex items-center md:hidden">
          <a
            href={`/${data.username}`}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 w-12 h-12 rounded-full grid
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
        <a href="/login" className="flex md:hidden">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-semibold">
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5rem"
                height="1.5rem"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M230.93 220a8 8 0 0 1-6.93 4H32a8 8 0 0 1-6.92-12c15.23-26.33 38.7-45.21 66.09-54.16a72 72 0 1 1 73.66 0c27.39 8.95 50.86 27.83 66.09 54.16a8 8 0 0 1 .01 8"
                />
              </svg>
            </i>
          </div>
        </a>
      )}
    </>
  );
}
export default HeaderUser;
