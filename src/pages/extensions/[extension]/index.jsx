import getImages from "../../../services/getImages";
import { useState, useEffect } from "react";
import Masonry from "react-layout-masonry";
function Extension({ data: dataByAstro, extension }) {
  const [loadClient, setClientLoad] = useState(false);
  const [loadImages, setLoadImages] = useState(false);
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function GetImages(page) {
    getImages(extension, page).then((res) => {
      console.log(res);
      if (page === 1) {
        if (res) {
          setData(res.data);
        }
      } else {
        setData((prevData) => [...prevData, ...res.data]);
      }
    });
    const response = await getImages(extension, page)
    const data = response
    const url = (import.meta.env.PUBLIC_SERVER_URL)
    console.log(url)
    console.log(data)
  }
  useEffect(() => {
    if (extension) {
      setClientLoad(true);
      GetImages(page);
    }
  }, []);

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
