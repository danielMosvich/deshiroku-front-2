// import type React from "react";
// // TYPES TAGS
// //               0 = general
// //               1 = artist
// //               3 = Copyright
// //               4 = character
// //               5 = meta

interface TagButtonProps {
  children: React.ReactNode | string;
  flat?: boolean;
  type: number;
  action?: () => void;
}
function TagButton({ children, type, action }: TagButtonProps) {
  let globalStyles =
    "w-fit cursor-pointer select-none rounded-full px-1 text-sm h-7 flex items-center font-[500] focus:outline-none focus:ring-2 dark:focus:ring-neutral-500 focus:ring-neutral-300 whitespace-nowrap";
  if (type === 0) {
    return (
      <button
        onClick={action}
        className={`${globalStyles} bg-neutral-200/60 text-black/80 dark:bg-neutral-800 dark:text-white`}
      >
        <span className="px-2 text-inherit font-ui">{children}</span>
      </button>
    );
  }
  if (type === 3) {
    return (
      <button
        onClick={action}
        className={`${globalStyles}  text-rose-500 bg-rose-800/20  dark:bg-rose-900/40 dark:text-rose-400`}
      >
        <span className="pr-2 text-inherit font-ui flex gap-1 items-center">
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.3rem"
              height="1.3rem"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M152 112a16 16 0 0 1-16 16h-24V96h24a16 16 0 0 1 16 16m80 16A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88m-16 0a72 72 0 1 1-72-72a72.08 72.08 0 0 1 72 72m-33.34 35.56l-15.57-23.35A32 32 0 0 0 136 80h-32a8 8 0 0 0-8 8v80a8 8 0 0 0 16 0v-24h22.39l19 28.44a8 8 0 0 0 13.32-8.88Z"
              />
            </svg>
          </i>
          {children}
        </span>
      </button>
    );
  }
  if (type === 1) {
    return (
      <button
        onClick={action}
        className={`${globalStyles} text-purple-600 bg-purple-500/20  dark:bg-purple-900/40 dark:text-purple-400`}
      >
        <span className="pr-2 pl-1 text-inherit font-ui flex gap-1 items-center">
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.1rem"
              height="1.1rem"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="5" fill="currentColor" />
                <path d="M20 21a8 8 0 1 0-16 0" />
                <path
                  fill="currentColor"
                  d="M12 13a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8"
                />
              </g>
            </svg>
          </i>
          {children}
        </span>
      </button>
    );
  }
  if (type === 4) {
    return (
      <button
        onClick={action}
        className={`${globalStyles} text-lime-600 bg-lime-500/20  dark:bg-lime-900/40 dark:text-lime-500`}
      >
        <span className="pr-2 pl-1 text-inherit font-ui flex gap-1 items-center">
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2rem"
              height="1.2rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M17.25 13a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M22 12c0 5.5-4.5 10-10 10H2V12C2 6.5 6.5 2 12 2s10 4.5 10 10M7 18c1.41 1.23 3 2 5 2c4.41 0 8-3.59 8-8c0-.79-.12-1.55-.33-2.26c-.72.17-1.47.26-2.25.26c-2 0-3.85-.6-5.42-1.61c0 0-1.46 5.37-3.97 4.61c-.66-.2-1.03.31-1.03 1"
              />
            </svg>
          </i>
          {children}
        </span>
      </button>
    );
  }
  if (type === 5 || type === 2) {
    return (
      <button
        onClick={action}
        className={`${globalStyles} text-yellow-600 bg-yellow-500/20  dark:bg-yellow-900/40 dark:text-yellow-500`}
      >
        <span className="pr-2 pl-1 text-inherit font-ui flex gap-1 items-center">
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.3rem"
              height="1.3rem"
              viewBox="0 0 256 256"
            >
              <g fill="currentColor">
                <path
                  d="m128.49 114.6l-18.71 32.75C93.88 175.86 77.52 200 58.56 200C-3.16 200 27.7 56 74 56c20.25 0 37.56 27.58 54.49 58.6M182 56c-12.62 0-24.1 10.7-35 26.27l-18.51 32.33c21.76 39.86 42.91 85.4 68.95 85.4C259.16 200 228.3 56 182 56"
                  opacity=".2"
                />
                <path d="M240 149.31c0 16.11-3.17 29.89-9.17 39.84c-7.43 12.33-19 18.85-33.39 18.85c-27.94 0-47.78-37-68.78-76.22C111.64 100 92.35 64 74 64c-9.38 0-19.94 10-28.25 26.67A138.18 138.18 0 0 0 32 149.31c0 13.2 2.38 24.12 6.88 31.58S49.82 192 58.56 192c15.12 0 30.85-24.54 44.23-48.55a8 8 0 0 1 14 7.8C101.46 178.71 83.07 208 58.56 208c-14.41 0-26-6.52-33.39-18.85c-6-10-9.17-23.73-9.17-39.84a154.81 154.81 0 0 1 15.42-65.77C42.82 60.62 57.94 48 74 48c27.94 0 47.77 37 68.78 76.22C159.79 156 179.08 192 197.44 192c8.74 0 15.18-3.63 19.68-11.11s6.88-18.38 6.88-31.58a138.18 138.18 0 0 0-13.74-58.64C202 74 191.39 64 182 64c-8.36 0-17.68 7.48-28.51 22.88a8 8 0 1 1-13.08-9.21c9-12.74 23-29.67 41.59-29.67c16.05 0 31.17 12.62 42.57 35.54A154.81 154.81 0 0 1 240 149.31" />
              </g>
            </svg>
          </i>
          {children}
        </span>
      </button>
    );
  }
}
export default TagButton;