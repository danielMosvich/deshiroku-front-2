import { useEffect, useState } from "react";
import type { UserProps } from "../../types/UserProps";

function headerUserMobile() {
  const [user, setUser] = useState<null | UserProps>(null);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user") as string));
      console.log(JSON.parse(localStorage.getItem("user") as string));
    }
  }, []);

  // USEFFECT PARA EL LOGIN DEL USER SI ES QUE ESTA O NO
  useEffect(() => {
    interface Cookies {
      [key: string]: string;
    }

    function obtenerCookies(): Cookies {
      const cookies: Cookies = {};
      document.cookie.split(";").forEach((cookie) => {
        const [nombre, valor] = cookie.split("=").map((part) => part.trim());
        cookies[nombre] = decodeURIComponent(valor);
      });
      return cookies;
    }

    function getCookieByName(name: string) {
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
            setUser(null);
            localStorage.clear();
            return;
          }
        }
        refreshToken();
      } else {
        setUser(null);
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
    const localStorageData = localStorage.getItem("user");
    const localStorageCollection = localStorage.getItem("defaultCollection");
    const localTime = localStorage.getItem("time");

    if (localTime) {
      // Recuperar los datos del almacenamiento local
      const storedData = JSON.parse(localStorage.getItem("time") as string);
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
        setUser(data);
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
      } else {
        if (
          localStorage.getItem("user") ||
          localStorage.getItem("defaultCollection") ||
          localStorage.getItem("time")
        ) {
          logout();
        }
      }
    }
  }, []);
  return (
    <>
      {user ? (
        <a
          href={`/${user.username}`}
          className="uppercase w-8 h-8 min-w-8 min-h-8  bg-gradient-to-tr from-sky-700 to-sky-400 hover:ring-2 hover:ring-sky-800/50  text-white rounded-full flex items-center justify-center font-bold text-sm"
        >
          {user.username.split("")[0]}
        </a>
      ) : (
        <a href="/unauth-profile" className="p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            color={"#000000"}
            fill={"none"}
          >
            <path
              d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </a>
      )}
    </>
  );
}
export default headerUserMobile;
