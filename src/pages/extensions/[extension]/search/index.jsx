import getImagesByQuery from "@/services/getImagesByQuery";
import { useState, useEffect } from "react";
import Masonry from "react-layout-masonry";
function Extension({ extension }) {
  const [loadClient, setClientLoad] = useState(false);
  const [loadImages, setLoadImages] = useState(false);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState(null);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function GetImages() {
    // console.log(page, query);
    if (query && page) {
      getImagesByQuery(extension, query, page).then((res) => {
        if (page === 1) {
          if (res.success) {
            setData(res.data);
            // console.log(res.data);
          }
        } else {
          // console.log(res.data);
          if (res.success) {
            setData((prevData) => [...prevData, ...res.data]);
          }
        }
      });
    }
  }
  useEffect(() => {
    const href =
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ];
    const tags = href.split("&").map((e) => e.split("?")[1]);
    setQuery(tags.join("+"));
    if (extension) {
      setClientLoad(true);
      GetImages(page, tags.join("+"));
    }
  }, [query, page]);

  useEffect(() => {
    if (data) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - scrollHeight / 4) {
          setIsLoadingMore(true);
        }
      };
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);
  useEffect(() => {
    if (data && isLoadingMore) {
      console.log(page + 1, "CARGAR MAS");
      GetImages(page + 1);
      setPage(page + 1);
      setTimeout(() => {
        setIsLoadingMore(false);
      }, 1000);
    }
  }, [isLoadingMore]);
  return (
    <div className="">
      {loadClient ? (
        <div className="lg:px-20 sm:px-10  px-5">
          <Masonry
            columns={{
              200: 1,
              400: 2,
              700: 3,
              1000: 4,
              1250: 5,
              1500: 6,
              1750: 7,
            }}
            gap={16}
          >
            {data.map((e, index) => {
              return (
                <a
                  href={`/extensions/${extension}/post/${e.id}`}
                  key={e.id}
                  className=""
                >
                  <img
                    className="w-full rounded-xl max-h-[500px] object-cover"
                    src={e.preview_url}
                    alt={e.owner + "image"}
                    loading="lazy"
                  />
                  <div className="flex gap-1 items-center mt-2">
                    <div className="rounded-full bg-neutral-200 w-8 h-8 grid place-content-center">
                      <p className="uppercase font-semibold">
                        {e.owner.split("")[0]}
                      </p>
                    </div>
                    <h2>{e.owner}</h2>
                  </div>
                </a>
              );
            })}
          </Masonry>
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
}
export default Extension;
