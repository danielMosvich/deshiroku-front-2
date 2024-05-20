import { useEffect, useState } from "react";
import DropDown from "./dropDown";
import LoginComponent from "./header/login";
import RegisterComponent from "./header/register";
import {
  STORE_username,
  STORE_name,
  STORE_auth_modal,
} from "../store/userStore";
import { useStore } from "@nanostores/react";
import Button from "./global-react/button";
import ModalContainer from "./global-react/modalContainer";
import LoginRegister from "./loginRegister";

function HeaderUser() {
  // !GLOBAL STATES
  const $username = useStore(STORE_username);
  const $name = useStore(STORE_name);
  const $auth_modal = useStore(STORE_auth_modal);
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
          <DropDown data={{ name: $name, username: $username }} />
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
