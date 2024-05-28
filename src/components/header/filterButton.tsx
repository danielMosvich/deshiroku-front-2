import DropdownContainer from "../../components/global-react/dropdownContainer";
import { useState } from "react";
interface tagProps {
  label: string;
  value: string;
  type: string;
}
type RatingTypes =
  | "all"
  | "safe"
  | "general"
  | "sensitive"
  | "questionable"
  | "explicit";
interface FilterParams {
  sort: { q: string; type: string; order: string };
  score: {
    value: number;
  };
  rating: RatingTypes;
}
interface FilterButtonProps {
  filters: FilterParams | null;
  setFilters: React.Dispatch<React.SetStateAction<FilterParams | null>>;
  extension: string;
  selectedTags: tagProps[];
}
interface QueryParams {
  tags: tagProps[];
  filter: FilterParams;
}
function FilterButton({
  filters,
  setFilters,
  extension,
  selectedTags,
}: FilterButtonProps) {
  function handleGo(newValue: FilterParams) {
    if (extension) {
      const queryParams: QueryParams = {
        tags: selectedTags,
        filter: newValue,
      };

      const queryString = Object.keys(queryParams)
        .map((key: string) => {
          const encodedValue = encodeURIComponent(
            JSON.stringify(queryParams[key as keyof QueryParams])
          );
          return `${encodeURIComponent(key)}=${encodedValue}`;
        })
        .join("&");

      if (queryString) {
        setFilters(queryParams.filter);
        window.location.href = `/extensions/${extension}/search/${queryString}`;
      }
    }
  }
  const toggleSort = () => {
    setFilters((prev: FilterParams | null) => {
      if (!prev) return prev; // Manejo para cuando prev es null

      const newValue = {
        ...prev,
        sort:
          prev.sort.type === "updated"
            ? { ...prev.sort, type: "score" }
            : { ...prev.sort, type: "updated" },
      };
      handleGo(newValue);

      return newValue;
    });
  };
  const toggleDate = () => {
    setFilters((prev: FilterParams | null) => {
      if (!prev) return prev; // Manejo para cuando prev es null
      const newValue = {
        ...prev,
        sort:
          prev.sort.order === "desc"
            ? { ...prev.sort, order: "asc" }
            : { ...prev.sort, order: "desc" },
      };
      handleGo(newValue);
      return newValue;
    });
  };

  const handleScore = () => {
    const scoreInput = prompt("Ingrese un número:") || ""; // Si el usuario cancela, se asigna una cadena vacía
    const score = parseFloat(scoreInput); // Intenta convertir la entrada a un número

    if (!isNaN(score)) {
      setFilters((prev: FilterParams | null) => {
        if (!prev) return prev;
        if (prev.score.value !== score) {
          const newValue = {
            ...prev,
            score: { value: score },
          };
          handleGo(newValue);
          return newValue;
        } else {
          handleGo(prev);
          return prev;
        }
      });
    } else {
    }
  };
  return (
    <DropdownContainer
      position="bottom-left"
      dropdownContent={
        <div className="bg-white/70 dark:bg-black/70 backdrop-blur-2xl p-5 mt-3 rounded-xl ring-1">
          <div className="flex flex-col items-start">
            <h2 className="font-semibold text-lg dark:text-white">
              Filters to search
            </h2>
            <p className="text-sm text-start font-semibold text-neutral-600 dark:text-neutral-300">
              this will remain in the other searches
            </p>
            <p></p>
            <div className=" w-full flex gap-3 items-center mt-5">
              <button
                onClick={toggleSort}
                className={
                  filters?.sort.type === "score"
                    ? `bg-black px-3 py-2 rounded-full font-semibold font-mono flex gap-2 items-center
                bg-gradient-to-tr from-rose-800 to-red-400
                ring-4 ring-rose-300
                text-white shadow-xl shadow-rose-500/40
                transition-all
            `
                    : `bg-black px-3 py-2 rounded-full font-semibold font-mono flex gap-2 items-center
            bg-gradient-to-tr from-neutral-800 to-neutral-700
            text-neutral-300
            `
                }
              >
                {filters?.sort.type === "score" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 15c4.875 0 7-2.051 7-7c0 4.949 2.11 7 7 7c-4.89 0-7 2.11-7 7c0-4.89-2.125-7-7-7ZM2 6.5c3.134 0 4.5-1.318 4.5-4.5c0 3.182 1.357 4.5 4.5 4.5c-3.143 0-4.5 1.357-4.5 4.5c0-3.143-1.366-4.5-4.5-4.5Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 15c4.875 0 7-2.051 7-7c0 4.949 2.11 7 7 7c-4.89 0-7 2.11-7 7c0-4.89-2.125-7-7-7ZM2 6.5c3.134 0 4.5-1.318 4.5-4.5c0 3.182 1.357 4.5 4.5 4.5c-3.143 0-4.5 1.357-4.5 4.5c0-3.143-1.366-4.5-4.5-4.5Z"
                    />
                  </svg>
                )}
                <span>Popular</span>
              </button>
              <button
                onClick={toggleDate}
                className=" px-3 py-2 rounded-full w-[120px] justify-center font-semibold font-mono flex gap-2 items-center
                      bg-gradient-to-tr from-blue-800 to-sky-600
                      text-white
                      "
              >
                {filters?.sort.order === "desc" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14"
                    />
                  </svg>
                )}
                <span>{filters?.sort.order === "desc" ? "latest" : "old"}</span>
              </button>
              <button
                onClick={handleScore}
                className=" bg-black px-3 py-2 rounded-full font-semibold font-mono flex gap-1 items-center
                      bg-gradient-to-tr from-neutral-800 to-neutral-700
                      text-neutral-300 whitespace-nowrap
                      "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2q-.225-.175-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562q.1-.275.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15q.275 0 .537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45q.1.275.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437q-.225.175-.525.2t-.575-.15z"
                  />
                </svg>
                {filters
                  ? filters?.score.value > 0
                    ? `score > ${filters?.score.value}`
                    : "score"
                  : "score"}
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div
        className=" bg-neutral-200 hover:bg-neutral-300 rounded-full p-2 relative dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-600 cursor-pointer"
        // onClick={() => setActive((prev) => !prev)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.3"
          >
            <path d="M3 5h4m14 0H11m-8 7h12m6 0h-2M3 19h2m16 0H9" />
            <circle cx="9" cy="5" r="2" />
            <circle cx="17" cy="12" r="2" />
            <circle cx="7" cy="19" r="2" />
          </g>
        </svg>
      </div>
    </DropdownContainer>
  );
}

export default FilterButton;
