import { useEffect, useState } from "react";
import HeaderUser from "../../components/HeaderUser";

function MobileHeader({ extension }: { extension?: string }) {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      setIsScrollingDown(currentScrollTop > lastScrollTop);
      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  useEffect(() => {
    if (isScrollingDown && !hidden) {
      setHidden(true);
    } else if (!isScrollingDown && hidden) {
      setHidden(false);
    }
  }, [isScrollingDown, hidden]);

  return (
    <div
      style={{ transform: hidden ? "translateY(100%)" : "translateY(0%)" }}
      className="md:hidden flex justify-center gap-4 items-center fixed bottom-0 bg-white dark:bg-black/90 backdrop-blur-lg w-full h-14 z-40 transition-transform duration-400"
    >
      <a href="/" className="dark:text-white w-fit h-fit rounded-full p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z" />
        </svg>
      </a>
      {extension ? (
        <button className="dark:text-white w-fit h-fit rounded-full p-2 font-semibold capitalize">
          {extension}
        </button>
      ) : (
        <button className="dark:text-white w-fit h-fit rounded-full p-2 font-semibold capitalize">
          Extensions
        </button>
      )}
      <button className="dark:text-white w-fit h-fit rounded-full p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
          />
        </svg>
      </button>

      <button className="dark:text-white w-fit h-fit rounded-full p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 640 512"
        >
          <path
            fill="currentColor"
            d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882M112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48s-21.49 48-48 48m513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882"
          />
        </svg>
      </button>
      <HeaderUser />
    </div>
  );
}
export default MobileHeader;
