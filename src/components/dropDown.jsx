import { useState } from "react";

function DropDownProfile({ data }) {
  const [active, setActive] = useState(false);
  function toggleActive() {
    setActive((prev) => !prev);
  }
  function resetAplication() {
    localStorage.clear();
    window.location.reload();
    // setActive(false)
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
  return (
    <div className="relative">
      <button
        className="flex items-center w-8 h-8 justify-center rounded-full hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-700 cursor-pointer relative"
        onClick={toggleActive}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.3rem"
          height="1.3rem"
          viewBox="0 0 512 512"
        >
          <path d="M128 192l128 128 128-128z" fill="currentColor"></path>
        </svg>
      </button>
      {active && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white shadow-xl absolute top-[115%] z-50 right-0 rounded-lg w-72 p-2 text-start cursor-default ring-2"
        >
          {/* CARD */}
          <div className="hover:bg-neutral-200 p-3 rounded-xl flex gap-3 cursor-pointer">
            <div className="bg-gradient-to-t from-rose-500 to-pink-400 text-white min-w-14 min-h-14 rounded-full grid place-content-center font-bold uppercase">
              {data.name.slice("")[0]}
            </div>
            <div className="w-full overflow-hidden flex flex-col justify-center">
              <h2 className="whitespace-nowrap text-ellipsis overflow-hidden font-semibold">
                {data.name}
              </h2>
              <p className="whitespace-nowrap text-ellipsis overflow-hidden text-neutral-500">
                {data.username}
              </p>
            </div>
          </div>
          {/* LIST */}
          <ul className="flex flex-col">
            <li className="hover:bg-neutral-200 px-3 py-2 rounded-xl font-semibold cursor-pointer flex gap-2 items-center select-none">
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12q0-1.45-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12q0 1.45 1.013 2.475T12.05 15.5"
                  />
                </svg>
              </i>
              <p>Configuracion</p>
            </li>
            <li
              className="hover:bg-neutral-200 px-3 py-2 rounded-xl font-semibold cursor-pointer flex gap-2 items-center select-none"
              onClick={resetAplication}
            >
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m16.325 18.8l-2.2 2.2L12 18.875l2.2-2.2q-.1-.275-.15-.575t-.05-.6q0-1.45 1.025-2.475T17.5 12q.45 0 .875.113t.8.312L16.8 14.8l1.4 1.4l2.375-2.35q.2.375.313.788T21 15.5q0 1.45-1.025 2.475T17.5 19q-.325 0-.612-.05t-.563-.15m4.45-8.8H18.7q-.65-2.2-2.475-3.6T12 5Q9.075 5 7.037 7.038T5 12q0 1.8.813 3.3T8 17.75V15h2v6H4v-2h2.35Q4.8 17.75 3.9 15.938T3 12q0-1.875.713-3.512t1.924-2.85q1.213-1.213 2.85-1.925T12 3q3.225 0 5.663 1.988T20.775 10"
                  />
                </svg>
              </i>
              <p>Reset aplication</p>
            </li>
            <li
              className="hover:bg-neutral-200 px-3 py-2 rounded-xl font-semibold cursor-pointer flex gap-2 items-center select-none text-red-500"
              onClick={logout}
            >
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
                  />
                </svg>
              </i>
              <p>Cerrar sesion</p>
            </li>
          </ul>
        </div>
      )}
      {active && (
        <div
          className="fixed w-full h-screen left-0 top-[80px]"
          onClick={toggleActive}
        ></div>
      )}
    </div>
  );
}
export default DropDownProfile;
