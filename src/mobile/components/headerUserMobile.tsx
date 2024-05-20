import { useEffect, useState } from "react";
import type { UserProps } from "../../types/UserProps";
import { STORE_user } from "../../store/userStore";
import { useStore } from "@nanostores/react";

function HeaderUserMobile() {
  const [user, setUser] = useState<null | UserProps>(null);
  const $user = useStore(STORE_user) as UserProps;
  // const $username = useStore(STORE_username);
  // const $name = useStore(STORE_name);

  useEffect(() => {
    setUser($user);
  }, []);
  return (
    <div>
      {user ? (
        <a
          href={`/${$user.username}`}
          className="uppercase w-8 h-8 min-w-8 min-h-8  bg-gradient-to-tr from-sky-700 to-sky-400 hover:ring-2 hover:ring-sky-800/50  text-white rounded-full flex items-center justify-center font-bold text-sm"
        >
          {$user.name.split("")[0]}
        </a>
      ) : (
        <a href="/unauth-profile" className="p-2 rounded-full dark:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            color={"currentColor"}
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
      {/* {$user  ? (
        <a
          href={`/${$username}`}
          className="uppercase w-8 h-8 min-w-8 min-h-8  bg-gradient-to-tr from-sky-700 to-sky-400 hover:ring-2 hover:ring-sky-800/50  text-white rounded-full flex items-center justify-center font-bold text-sm"
        >
          {$username.split("")[0]}
        </a>
      ) : (
        <a href="/unauth-profile" className="p-2 rounded-full dark:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            color={"currentColor"}
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
      )} */}
    </div>
  );
}
export default HeaderUserMobile;
