import { useState } from "react";
import DropDown from "../../components/global-react/dropDown";

interface MagicSearchProps {
  type: string;
  file_url: string | undefined;
  source: string | undefined;
}

function MagicSearch({ type, file_url, source }: MagicSearchProps) {
  const [active, setActive] = useState(false);

  function searchSource(url: string) {
    if (url) {
      try {
        const dominio = new URL(url).origin;
        return dominio.split("//")[1];
      } catch (error) {
        return "https://icons.duckduckgo.com/ip2/.ico";
      }
    }
  }
  if (type !== "mp4" && type !== "webm") {
    return (
      <button
        onClick={() => {
          setActive(true);
        }}
        className="dark:text-white flex relative dark:hover:bg-white dark:hover:text-black dark:hover:shadow-md dark:hover:shadow-white/20  rounded-full p-2 items-center justify-center cursor-pointer"
      >
        <i className="-translate-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M10 4a6 6 0 1 0 0 12a6 6 0 0 0 0-12m-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10"
            />
          </svg>
        </i>
        <i className="absolute right-1 top-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.8rem"
            height="0.8rem"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m10 19l-2.5-5.5L2 11l5.5-2.5L10 3l2.5 5.5L18 11l-5.5 2.5L10 19Zm8 2l-1.25-2.75L14 17l2.75-1.25L18 13l1.25 2.75L22 17l-2.75 1.25L18 21Z"
            />
          </svg>
        </i>
        {active && (
          <DropDown
            padding={false}
            position="left"
            close={() => setActive(false)}
          >
            <div className="flex flex-col justify-start max-w-72">
              {source && (
                <a
                  target="_blank"
                  href={source}
                  className="whitespace-nowrap px-3 py-3 w-full text-start flex items-center gap-3 bg-neutral-900 text-white border-b-2 border-blue-500/50"
                >
                  
                  <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                    <img
                      className="w-full h-full"
                      src={`https://icons.duckduckgo.com/ip2/${searchSource(
                        source
                      )}.ico`}
                      alt=""
                    />
                  </i>
                  <span>Original source</span>
                </a>
              )}

              <a
                target="_blank"
                href={`https://saucenao.com/search.php?db=999&url=${file_url}`}
                className="whitespace-nowrap px-3 py-3 w-full text-start flex items-center gap-3 bg-neutral-900 text-white"
              >
                <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/saucenao.com.ico`}
                    alt=""
                  />
                </i>
                <span>Search with Saoucenao</span>
              </a>

              <a
                target="_blank"
                href={`https://lens.google.com/uploadbyurl?url=${file_url}`}
                className="whitespace-nowrap px-3 py-3 w-full text-start flex items-center gap-3 bg-neutral-900 text-white"
              >
                <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/google.com.ico`}
                    alt=""
                  />
                </i>
                <span>Search with Google lens</span>
              </a>
              <a
                target="_blank"
                href={`https://ascii2d.net/search/url/${file_url}`}
                className="whitespace-nowrap px-3 py-3 w-full text-start flex items-center gap-3 bg-neutral-900 text-white"
              >
                <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/ascii2d.net.ico`}
                    alt=""
                  />
                </i>
                <span>Search with ASCII2D</span>
              </a>
              <a
                target="_blank"
                href={`https://iqdb.org/?url=${file_url}`}
                className="whitespace-nowrap px-3 py-3 w-full text-start flex items-center gap-3 bg-neutral-900 text-white"
              >
                <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                  <img
                    className="w-full h-full"
                    src={`https://icons.duckduckgo.com/ip2/iqdb.org.ico`}
                    alt=""
                  />
                </i>
                <span>Search with IQDB</span>
              </a>
              <a
                target="_blank"
                href={`https://yandex.ru/images/search?rpt=imageview&img_url=${file_url}`}
                className="whitespace-nowrap px-3 py-3 w-full text-start flex items-center gap-3 bg-neutral-900 text-white"
                >
                  <i className="w-5 h-5 max-w-5 max-h-5 min-w-5 min-h-5 rounded-md overflow-hidden">
                    <img
                      className="w-full h-full"
                      src={`https://icons.duckduckgo.com/ip2/yandex.com.ico`}
                      alt=""
                    />
                  </i>
                  <span>Search with Yandex</span>
              </a>
            </div>
          </DropDown>
        )}
      </button>
    );
  }
}
export default MagicSearch;
