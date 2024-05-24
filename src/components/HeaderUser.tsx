import { useEffect, useState } from "react";
// import DropDown from "./dropDown";
import {
  STORE_username,
  STORE_name,
  STORE_auth_modal,
  STORE_user,
  STORE_defaultCollection,
  STORE_location,
  STORE_global_default_extension,
} from "../store/userStore";
import { useStore } from "@nanostores/react";
import Button from "./global-react/button";
import ModalContainer from "./global-react/modalContainer";
import LoginRegister from "./loginRegister";
import DropdownContainer from "./global-react/dropdownContainer";
import type { UserProps } from "../types/UserProps";
import refreshToken from "../api/user/get/refreshToken";

function HeaderUser() {
  // !GLOBAL STATES
  const $username = useStore(STORE_username);
  const $name = useStore(STORE_name);
  const $auth_modal = useStore(STORE_auth_modal);
  const logout = () => {};

  useEffect(() => {
    if (localStorage.length > 0) {
      if (
        localStorage.getItem("defaultCollection") &&
        localStorage.getItem("user")
      ) {
        if (localStorage.getItem("default_extension")) {
          STORE_global_default_extension.set(
            localStorage.getItem("default_extension")
          );
        }
        const defaultCollection = JSON.parse(
          localStorage.getItem("defaultCollection") as string
        );
        const user = JSON.parse(
          localStorage.getItem("user") as string
        ) as UserProps;
        STORE_user.set(user);
        STORE_username.set(user.username);
        STORE_name.set(user.name);

        if (defaultCollection) {
          STORE_defaultCollection.set(defaultCollection);
        } else {
          if (user.collections) {
            STORE_defaultCollection.set(user.collections[0]);
          }
        }
        // !CURRENT TIME FOR REFRESH TOKEN
        if (localStorage.getItem("time")) {
          const time = JSON.parse(localStorage.getItem("time") as string);
        }
        refreshToken();
      }
    }
    STORE_location.set(`${window.location.pathname}`);
  }, []);
  return (
    <>
      {$username ? (
        <div className="ml-2 flex items-center">
          <a
            href={`/${$username}`}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 w-12 h-12 rounded-full grid place-content-center font-semibold uppercase cursor-pointer"
          >
            <div className="bg-gradient-to-t from-rose-500 to-pink-400 text-white w-9 h-9 rounded-full grid place-content-center font-semibold uppercase">
              {$username.split("")[0]}
            </div>
          </a>
          <DropdownContainer
            position="bottom-right"
            dropdownContent={
              <div className="ring-2 bg-white/60 dark:bg-black/70 backdrop-blur-2xl mt-5 rounded-xl w-[300px] p-2 dark:text-white z-50 relative">
                <a
                  href={`/${$username}`}
                  className="bg-gradient-to-tr to-white from-neutral-600/10 dark:from-black/50 dark:to-blue-500/40 dark:ring-1 dark:ring-neutral-500 ring-2 ring-white rounded-xl  py-2 px-4 cursor-pointer 
                active:scale-[0.98] transition-transform w-full flex flex-col items-start select-none "
                >
                  <h2 className="text-xl font-semibold">{$name}</h2>
                  <h2 className="">@{$username}</h2>
                </a>

                <div className=" select-none transition-colors hover:bg-white/70 dark:hover:bg-neutral-500/50 gap-2 cursor-pointer w-full px-3 py-3 flex items-center rounded-xl mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.3rem"
                    height="1.3rem"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"
                    />
                  </svg>
                  <span>Settings</span>
                </div>
                <div className=" select-none transition-colors hover:bg-rose-500/80 hover:text-white  gap-2  cursor-pointer w-full px-3 py-3 flex items-center rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.3rem"
                    height="1.3rem"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="currentColor"
                      d="M23 4H7a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6h-9.37a1 1 0 0 1-1-1a1 1 0 0 1 1-1H25V6a2 2 0 0 0-2-2"
                      className="clr-i-solid clr-i-solid-path-1"
                    />
                    <path
                      fill="currentColor"
                      d="M28.16 17.28a1 1 0 0 0-1.41 1.41L30.13 22H25v2h5.13l-3.38 3.46a1 1 0 1 0 1.41 1.41l5.84-5.8Z"
                      className="clr-i-solid clr-i-solid-path-2"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                  <span>Logout</span>
                </div>
              </div>
            }
          >
            <svg
              className="text-black dark:text-white ml-2"
              xmlns="http://www.w3.org/2000/svg"
              width="1rem"
              height="1rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z"
              />
            </svg>
          </DropdownContainer>
          {/* <DropDown data={{ name: $name, username: $username }} /> */}
        </div>
      ) : (
        <div className="flex gap-2 ml-2">
          <Button onClick={() => STORE_auth_modal.set(true)}>Login</Button>
          <Button onClick={() => STORE_auth_modal.set(true)} variant="solid">
            Register
          </Button>

          {$auth_modal && (
            <ModalContainer
              onClose={() => STORE_auth_modal.set(false)}
              height="80%"
            >
              <LoginRegister />
            </ModalContainer>
          )}
        </div>
      )}
    </>
  );
}
export default HeaderUser;
