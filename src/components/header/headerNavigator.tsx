import { useStore } from "@nanostores/react";
import {
  STORE_auth_modal,
  STORE_location,
  STORE_username,
} from "../../store/userStore";
import MyButton from "../../components/global-react/myButton";
import { useEffect, useState } from "react";
import ModalContainer from "../../components/global-react/modalContainer";
import LoginRegister from "../../components/loginRegister";
// import LoginRegister from "@components/loginRegister";
// import Alert from "../../components/global-react/alert";

const HOME_ROUTE = "/";
const TAGS_ROUTE = "/tags";
const SEARCH_ROUTE = "/search";
const EXTENSIONS_ROUTE = "/extensions";

function HeaderNavigator({ extension }: { extension?: string }) {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const $location = useStore(STORE_location);
  const $username = useStore(STORE_username);
  const $auth_modal = useStore(STORE_auth_modal);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <>
      <nav className="md:items-center  hidden md:flex">
        {/* <h2 className="text-white" onClick={()=> Alert("top-right", 5000, "success", "Success!", "Your operation completed successfully.") }>XD</h2> */}
        <a href={HOME_ROUTE} className="mr-3 rounded-full text-white">
          <MyButton radius="full" icon variant="light">
            <img className="w-24 h-24" src="/favicon.svg" alt="logo" />
          </MyButton>
        </a>

        {extension ? (
          <a href={`${EXTENSIONS_ROUTE}/${extension}`}>
            <MyButton
              radius="full"
              variant={
                $location.includes(`${EXTENSIONS_ROUTE}/${extension}`)
                  ? "solid"
                  : "light"
              }
            >
              {extension}
            </MyButton>
          </a>
        ) : (
          <a href={"/"}>
            <MyButton radius="full" variant="light">
              Extensions
            </MyButton>
          </a>
        )}

        <a href={TAGS_ROUTE}>
          <MyButton
            radius="full"
            variant={$location === TAGS_ROUTE ? "solid" : "light"}
          >
            Tags
          </MyButton>
        </a>
      </nav>
      {/* MOBILE => */}
      <nav
        onMouseMove={() => {
          setVisible(true);
        }}
        style={{ opacity: visible ? "1" : "0.3" }}
        className="items-center justify-evenly transition-opacity duration-300  flex md:hidden w-full h-14 bg-white/70 dark:bg-black/70 backdrop-blur-2xl"
      >
        <a href={HOME_ROUTE}>
          <MyButton
            radius="full"
            variant={$location === HOME_ROUTE ? "solid" : "light"}
            icon
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12.707 2.293a1 1 0 0 0-1.414 0l-7 7l-2 2a1 1 0 1 0 1.414 1.414L4 12.414V19a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-6.586l.293.293a1 1 0 0 0 1.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </MyButton>
        </a>

        {extension ? (
          <a href={`${EXTENSIONS_ROUTE}/${extension}`}>
            <MyButton
              radius="full"
              variant={
                $location.includes(`${EXTENSIONS_ROUTE}/${extension}`)
                  ? "solid"
                  : "light"
              }
            >
              {extension}
            </MyButton>
          </a>
        ) : (
          <a href={"/"}>
            <MyButton radius="full" variant="light">
              Extensions
            </MyButton>
          </a>
        )}

        <a href={SEARCH_ROUTE}>
          <MyButton
            radius="full"
            variant={$location === SEARCH_ROUTE ? "solid" : "light"}
            icon
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 24 24"
            >
              <g fill="currentColor">
                <path d="M10 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16" />
                <path
                  fillRule="evenodd"
                  d="M21.707 21.707a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 0 1 1.414-1.414l3.5 3.5a1 1 0 0 1 0 1.414"
                  clipRule="evenodd"
                />
              </g>
            </svg>
          </MyButton>
        </a>
        <a href={TAGS_ROUTE}>
          <MyButton
            radius="full"
            variant={$location === TAGS_ROUTE ? "solid" : "light"}
            icon
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59s1.05-.23 1.41-.59l.42-.41C11.6 20.9 9 18.26 9 15c0-3.31 2.69-6 6-6c3.26 0 5.9 2.6 6 5.83l.41-.42c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42M5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4S7 4.67 7 5.5S6.33 7 5.5 7m9.61 3.61c2.5 0 4.5 2 4.5 4.5c0 .89-.25 1.71-.69 2.39L22 20.61L20.61 22l-3.11-3.07c-.7.43-1.5.68-2.39.68c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5m0 2a2.5 2.5 0 1 0 2.5 2.5c0-1.39-1.11-2.5-2.5-2.5"
              />
            </svg>
          </MyButton>
        </a>
        {$username ? (
          <a
            href={`/${$username}`}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 w-12 h-12 rounded-full grid place-content-center font-semibold uppercase cursor-pointer"
          >
            <div className="bg-gradient-to-t from-rose-500 to-pink-400 text-white w-9 h-9 rounded-full grid place-content-center font-semibold uppercase">
              {$username.split("")[0]}
            </div>
          </a>
        ) : (
          <a onClick={() => STORE_auth_modal.set(true)}>
            <MyButton icon radius="full" variant="light">
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
            </MyButton>
          </a>
        )}
      </nav>
      {$auth_modal && (
        <ModalContainer
          onClose={() => STORE_auth_modal.set(false)}
          height="80%"
        >
          <LoginRegister />
        </ModalContainer>
      )}
    </>
  );
}

export default HeaderNavigator;
