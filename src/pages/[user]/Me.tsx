import { useEffect, useState } from "react";
import type { UserProps } from "types/UserProps";
import "./user.css";
import CardCollection from "../../components/profile/cardCollection";
function Me() {
  const [user, setUser] = useState<null | UserProps>(null);
  useEffect(() => {
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
    async function getData() {
      const token = getCookieByName("token");
      const response = await fetch(
        `${import.meta.env.PUBLIC_SERVER_URL}/api/user/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${JSON.stringify({
              token: token,
            })}`,
          },
        }
      );
      const data = await response.json();
      setUser(data.data);
      console.log(data, "res");
    }
    getData();
  }, []);
  return (
    <>
      {user && (
        <div>
          <div className="flex flex-col items-center">
            {/* <div className="bg-rose-500 w-32 h-32 rounded-full flex items-center justify-center font-semibold font-ui text-5xl capitalize">
              {user.username.split("")[0]}
            </div> */}
            <button className="button-profile uppercase font-semibold text-6xl">
              {user.username.split("")[0]}
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>

            <h2 className="font-semibold text-2xl mt-5">{user.name}</h2>
            <h3 className=" text-lg">@{user.username}</h3>
          </div>

          <div className="md:px-10 px-4">
            <aside className="mt-5">
              <div className="flex gap-3">
                <button className="flex bg-transparent border border-black hover:bg-gradient-to-tr hover:from-lime-500/30 hover:to-white p-3 rounded-full">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      color={"#000000"}
                      fill={"none"}
                    >
                      <path
                        d="M14.236 5.29178C14.236 4.77191 14.236 4.51198 14.1789 4.29871C14.0238 3.71997 13.5717 3.26793 12.9931 3.11285C12.4315 2.96238 11.5684 2.96238 11.0068 3.11285C10.4281 3.26793 9.97609 3.71997 9.82101 4.29871C9.76387 4.51198 9.76387 4.77191 9.76387 5.29178C9.76387 6.34588 9.76387 9.109 9.43641 9.43647C9.10894 9.76393 6.34582 9.76393 5.29172 9.76393C4.77185 9.76393 4.51192 9.76393 4.29865 9.82107C3.71991 9.97615 3.26787 10.4282 3.11279 11.0069C2.96232 11.5685 2.96232 12.4315 3.11279 12.9931C3.26787 13.5718 3.71991 14.0239 4.29865 14.1789C4.51192 14.2361 4.77185 14.2361 5.29172 14.2361C6.34582 14.2361 9.10894 14.2361 9.43641 14.5635C9.76387 14.891 9.76387 15.418 9.76387 16.4721C9.76387 16.992 9.76387 19.4881 9.82101 19.7013C9.97609 20.28 10.4281 20.7321 11.0068 20.8871C11.5684 21.0376 12.4315 21.0376 12.9931 20.8871C13.5717 20.7321 14.0238 20.28 14.1789 19.7013C14.236 19.4881 14.236 16.992 14.236 16.4721C14.236 15.418 14.236 14.891 14.5635 14.5635C14.8909 14.2361 17.654 14.2361 18.7082 14.2361C19.228 14.2361 19.488 14.2361 19.7013 14.1789C20.28 14.0239 20.732 13.5718 20.8871 12.9931C21.0376 12.4315 21.0376 11.5685 20.8871 11.0069C20.732 10.4282 20.28 9.97615 19.7013 9.82107C19.488 9.76393 19.228 9.76393 18.7082 9.76393C17.654 9.76393 14.8909 9.76393 14.5635 9.43647C14.236 9.109 14.236 6.34588 14.236 5.29178Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </i>
                </button>
                <button className="flex bg-transparent border border-black hover:bg-gradient-to-tr hover:from-lime-500/30 hover:to-white p-3 rounded-full">
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      color={"#000000"}
                      fill={"none"}
                    >
                      <path
                        d="M2 6L6 6.00003"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 13H6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 21H21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.4 13.4L22 16M20.7 8.85C20.7 5.6191 18.0809 3 14.85 3C11.6191 3 9 5.6191 9 8.85C9 12.0809 11.6191 14.7 14.85 14.7C18.0809 14.7 20.7 12.0809 20.7 8.85Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </i>
                </button>
              </div>
            </aside>
            <section className="mt-5">
              <ul className="flex gap-5 flex-wrap">
                {user.collections.map((item) => (
                    <CardCollection item={item} key={item._id}/>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
export default Me;
