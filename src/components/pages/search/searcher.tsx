import { useStore } from "@nanostores/react";
import { useRef, useState } from "react";
import { STORE_global_default_extension } from "../../../store/userStore";
import SelectExtensions from "./selectExtensions";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import "./styles.css";
import DropdownContainer from "../../../components/global-react/dropdownContainer";
import TagButton from "../../../components/header/TagButton";

function Searcher() {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const $default_extension = useStore(STORE_global_default_extension);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const getTags = async (query: string) => {
    if (query !== "") {
      try {
        const response = await fetch(
          `${
            import.meta.env.PUBLIC_SERVER_URL
          }/api/deshiroku/${$default_extension}/autocomplete/${query}`
        );
        const data = await response.json();
        if (data.success) {
          setResults(data.data);
          console.log(data.data);
        }
      } catch (error) {}
    }
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== "") {
      getTags(value);
    }
  };
  return (
    <>
      <div className="flex items-center relative h-10 rounded-full mx-auto mt-5 gap-2 px-2">
        <DropdownContainer
          dropdownContent={
            <div className="bg-white/70 backdrop-blur-2xl ring-2 flex flex-col gap-2  w-full left-0 mt-2 rounded-xl p-2">
              {results.length > 0 &&
                results.map((item, index) => (
                  // <TagButton type={item.type}>{item.value}</TagButton>
                  <TagButton action={() => {}} type={1}>
                    {item.value}
                  </TagButton>
                ))}
            </div>
          }
          // position="bottom"
          classNameDropdown="w-full relative z-20"
          classNamePather="w-full relative h-full flex"
          className="w-full"
        >
          <div className="w-full bg-neutral-200 h-full rounded-full relative flex items-center">
            <svg
              className="text-neutral-700 z-10 absolute left-3"
              xmlns="http://www.w3.org/2000/svg"
              width="1.3rem"
              height="1.3rem"
              viewBox="0 0 16 16"
            >
              <g fill="currentColor">
                <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018c-5.825-3.764-1.664-6.69 0-5.018"></path>
                <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11"></path>
              </g>
            </svg>
            <input
              value={inputValue}
              ref={inputRef}
              onChange={handleInput}
              className="w-full h-full rounded-full bg-transparent placeholder:text-neutral-600 text-sm font-ui font-[500] outline-offset-4 outline-sky-500 pl-10 pr-4"
              type="text"
              placeholder={`Search in ${$default_extension}`}
            />
          </div>
        </DropdownContainer>
        <SelectExtensions />
      </div>
      {/* <section>tags selected</section> */}
      <section className="mt-10">
        {/* <ul className="bg-rose-500 mt-5"> */}
        <Swiper
          slidesPerView={2.5}
          spaceBetween={8}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <li className="flex flex-col relative  h-[240px] ">
              <img
                // style={{background }}
                className="w-full h-full object-cover rounded-xl rounded-b-2xl"
                src="https://res.cloudinary.com/dnr4oeapp/image/upload/v1716413240/deshiroku/rule34/popular_1.png"
                alt=""
              />
              <div
                style={{
                  background: "linear-gradient(transparent 50%, black 100%)",
                }}
                className="w-full font-semibold absolute text-center text-white  h-full flex items-end justify-center rounded-b-xl"
              >
                <span className="mb-2">Most Popular</span>
              </div>
            </li>
          </SwiperSlide>
          <SwiperSlide>
            <li className="flex flex-col relative  h-[240px] ">
              <img
                // style={{background }}
                className="w-full h-full object-cover rounded-xl rounded-b-2xl"
                src="https://res.cloudinary.com/dnr4oeapp/image/upload/v1716413240/deshiroku/rule34/popular_1.png"
                alt=""
              />
              <div
                style={{
                  background: "linear-gradient(transparent 50%, black 100%)",
                }}
                className="w-full font-semibold absolute text-center text-white  h-full flex items-end justify-center rounded-b-xl"
              >
                <span className="mb-2">Most Popular</span>
              </div>
            </li>
          </SwiperSlide>
          <SwiperSlide>
            <li className="flex flex-col relative  h-[240px] ">
              <img
                // style={{background }}
                className="w-full h-full object-cover rounded-xl rounded-b-2xl"
                src="https://res.cloudinary.com/dnr4oeapp/image/upload/v1716413240/deshiroku/rule34/popular_1.png"
                alt=""
              />
              <div
                style={{
                  background: "linear-gradient(transparent 50%, black 100%)",
                }}
                className="w-full font-semibold absolute text-center text-white  h-full flex items-end justify-center rounded-b-xl"
              >
                <span className="mb-2">Most Popular</span>
              </div>
            </li>
          </SwiperSlide>
          <SwiperSlide>
            <li className="flex flex-col relative  h-[240px] ">
              <img
                // style={{background }}
                className="w-full h-full object-cover rounded-xl rounded-b-2xl"
                src="https://res.cloudinary.com/dnr4oeapp/image/upload/v1716413240/deshiroku/rule34/popular_1.png"
                alt=""
              />
              <div
                style={{
                  background: "linear-gradient(transparent 50%, black 100%)",
                }}
                className="w-full font-semibold absolute text-center text-white  h-full flex items-end justify-center rounded-b-xl"
              >
                <span className="mb-2">Most Popular</span>
              </div>
            </li>
          </SwiperSlide>
        </Swiper>
        {/* </ul> */}
      </section>
    </>
  );
}
export default Searcher;
