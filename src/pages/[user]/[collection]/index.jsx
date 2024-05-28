import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Card from "../../../components/Card";
import getCollectionByUsername from "../../../api/user/get/getCollectionByUsername";
import MyButton from "../../../components/global-react/myButton";
import { STORE_user } from "../../../store/userStore";
import { useStore } from "@nanostores/react";
import deleteColletion from "../../../api/user/post/deleteColletion";
import editCollection from "../../../api/user/post/editCollection";
import ModalContainer from "../../../components/global-react/modalContainer";
import ModalQuestion from "../../../components/global-react/modalQuestion";
function Collection({ user, collection }) {
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showEditButton, setShowEditButton] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const $user = useStore(STORE_user);

  function handleInputChange(e) {
    const valueUnfilter = e.target.value;
    const value = valueUnfilter.replace(/[^a-zA-Z0-9\s\-_]+/g, "");
    setInputValue(value);
  }

  async function handleDeleteCollection() {
    const id = $user.collections.find((e) => e.name === collection)._id;
    setShowDeleteButton(false);
    deleteColletion(id, collection)
      .then(() => {
        setShowDeleteButton(true);
        setShowDelete(false);
      })
      .catch((e) => {
      });
  }
  async function handleEditCollection() {
    const sanitizedCollectionName = inputValue.replace(
      /[^a-zA-Z0-9\s\-_]+/g,
      ""
    );
    if (sanitizedCollectionName === collection) {
      setShowEditButton(true);
      setShowEdit(false);

      return;
    }
    const id = $user.collections.find((e) => e.name === collection)._id;
    setShowEditButton(false);
    editCollection(id, sanitizedCollectionName).then((e) => {
      if (e.success) {
        setShowEditButton(true);
        setShowEdit(false);
      } else {
        setShowEditButton(true);
      }
    });
  }
  function getHref(element, extension) {
    const queryParams = {
      preview_url: element.preview_url,
      file_url: element.file_url,
      width: element.width,
      height: element.height,
    };
    const queryString = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join("&");
    const url = `/extensions/${extension}/post/${element.id}?${queryString}`;
    return url;
  }
  useEffect(() => {
    getCollectionByUsername(user, collection).then((res) => {
      if (res.success) {
        setData(res.data);
        setInputValue(collection);
      }
    });
  }, [$user]);

  return (
    <div className="relative lg:px-20 sm:px-10  px-2">
      {data ? (
        <div className="flex items-center justify-center flex-col mt-10 mb-5">
          <h2 className="text-3xl font-semibold font-ui dark:text-neutral-50">
            {data.name}
          </h2>
          <h2 className=" dark:text-neutral-50">by @{user}</h2>

          {data.isOwner && (
            <div className="flex gap-3 mt-5">
              <MyButton
                onClick={() => setShowEdit(true)}
                radius="full"
                color="warning"
                variant="solid"
              >
                Edit name
              </MyButton>
              <MyButton
                onClick={() => setShowDelete(true)}
                radius="full"
                variant="flat"
                color="danger"
              >
                Delete
              </MyButton>
            </div>
          )}
        </div>
      ) : (
        <div className=" flex flex-col  mt-10 mb-5">
          <div className="w-full items-center flex flex-col gap-1">
            <div className="w-52 h-9 animate-card-squeleton rounded-full"></div>
            <div className="w-52 h-6 animate-card-squeleton rounded-full"></div>
          </div>
          <div className="w-full mt-[10px]  flex justify-center gap-2">
            <div className="w-28 h-12 animate-card-squeleton rounded-full"></div>
            <div className="w-20 h-12 animate-card-squeleton rounded-full"></div>
          </div>
        </div>
      )}
      {data ? (
        <div className="pb-3">
          <h2 className="font-semibold text-neutral-900 border-b w-fit border-neutral-900 md:text-lg dark:text-neutral-50 dark:border-neutral-50">
            {data.images.length} images
          </h2>
        </div>
      ) : (
        <div className="w-full pb-3 flex ">
          <div className="w-20 md:w-24 h-[29px] animate-card-squeleton rounded-full"></div>
        </div>
      )}
      {data ? (
        <div>
          {data.images.length !== 0 ? (
             <div>
             <Masonry
               breakpointCols={{
                 0: 2,
                 520: 2,
                 1000: 3,
                 1300: 4,
                 1550: 5,
                 1750: 6,
                 default: 7,
               }}
               className="my-mansory-grid flex gap-2 md:gap-4 w-auto"
               columnClassName="my-mansory-grid-column"
             >
               {data.images.map((e, index) =>
                 e.extension === "load" ? (
                   //! AQUI VA LAS CARTAS ROSAS (ESQUELETON)
                   <Card delay={index} key={`${index}-load-${page}`} />
                 ) : (
                   // AQUI LAS CARTAS NORMALES
                   <a
                     className="w-full"
                     href={getHref(e, e.extension)}
                     key={`${e.id}-page-${user}-index-${index}`}
                   >
                     {e.type_file === "mp4" || e.type_file === "webm" ? (
                       <div>
                         <div
                           style={{
                             backgroundImage:
                               " linear-gradient(144deg,#a241ff, #513bfa 50%,#3f89ff)",
                           }}
                           className="w-full rounded-[18px] p-[3px] shadow-xl shadow-blue-500/30 relative"
                         >
                           <img
                             className="w-full rounded-2xl max-h-[500px] object-cover"
                             src={e.preview_url}
                             alt={e.owner + "image"}
                             loading="lazy"
                           />
                           <i className="absolute top-3 right-3 text-neutral-500 bg-white/80 px-2 rounded-full">
                             <svg
                               xmlns="http://www.w3.org/2000/svg"
                               width="1.2rem"
                               height="1.2rem"
                               viewBox="0 0 24 24"
                             >
                               <path
                                 fill="currentColor"
                                 d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"
                               />
                             </svg>
                           </i>
                         </div>
                         <div className="flex gap-1 items-center mt-2 mb-4">
                           <h2 className="text-sm font-semibold dark:text-white">
                             {e.owner}
                           </h2>
                         </div>
                       </div>
                     ) : (
                       <div className="">
                         <img
                           style={{ filter: "brightness(0.95)" }}
                           className="w-full rounded-2xl max-h-[500px] object-cover"
                           src={e.preview_url}
                           alt={e.owner + "image"}
                           loading="lazy"
                         />
                         <div className="flex gap-1 items-center mt-2 mb-4">
                           <h2 className="text-sm font-semibold dark:text-white">
                             {e.owner}
                           </h2>
                         </div>
                       </div>
                     )}
                   </a>
                 )
               )}
             </Masonry>
           </div>
          ) : (
            <div>Not images yet</div>
          )}
        </div>
      ) : (
        <div className="md:max-h-[calc(100vh-223px-80px)]  md:min-h-[calc(100vh-223px-80px)] max-h-[calc(100vh-223px-56px)]  min-h-[calc(100vh-223px-56px)] overflow-y-clip">
          <div className="animate-fade-up">
            <Masonry
              breakpointCols={{
                0: 2,
                520: 2,
                1000: 3,
                1300: 4,
                1550: 5,
                1750: 6,
                default: 7,
              }}
              className="my-mansory-grid flex gap-2 md:gap-4 w-auto"
              columnClassName="my-mansory-grid-column"
            >
              {Array.from({ length: 35 }).map((_e, k) => {
                return <Card key={k} delay={k} />;
              })}
            </Masonry>
          </div>
        </div>
      )}
      {showEdit && (
        <ModalQuestion onClose={() => setShowEdit(false)}>
          <div className="bg-neutral-100/90 backdrop-blur-2xl p-4 rounded-xl md:min-w-[400px] w-full mx-auto">
            <h3 className=" font-semibold text-md">New name collection</h3>
            <input
              className="bg-white px-3 py-3 outline-offset-4 outline-2 outline-sky-500 rounded-xl border-none mt-2 w-full"
              type="text"
              placeholder="new name collection"
              name="input-new-collection-name"
              value={inputValue}
              onChange={handleInputChange}
              // id=""
            />
            <div className="flex justify-end gap-2 mt-3">
              <MyButton
                radius="2xl"
                variant="light"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </MyButton>

              <MyButton
                radius="2xl"
                variant="light"
                onClick={handleEditCollection}
                disabled={!showEditButton}
              >
                <div className="flex items-center gap-2">
                  <p>Edit</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
                    />
                  </svg>
                </div>
              </MyButton>
            </div>
          </div>
        </ModalQuestion>
      )}
      {showDelete && (
        <ModalQuestion onClose={() => setShowDelete(false)}>
          <ModalQuestion onClose={() => setShowDelete(false)}>
            <div className="bg-neutral-100/90 backdrop-blur-2xl p-4 py-5 rounded-xl md:min-w-[400px] w-[90%] mx-auto">
              <h3 className=" font-semibold text-md text-center">
                Are you sure to delete{" "}
                <b className="font-semibold text-blue-500">{collection}</b>{" "}
                collection?
              </h3>
              <div className="flex justify-center gap-2 mt-3">
                <MyButton
                  radius="2xl"
                  variant="light"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </MyButton>
                <MyButton
                  radius="2xl"
                  variant="light"
                  onClick={handleDeleteCollection}
                  color="danger"
                  disabled={!showDeleteButton}
                >
                  Delete
                </MyButton>
              </div>
            </div>
          </ModalQuestion>
        </ModalQuestion>
      )}
    </div>
  );
}
export default Collection;
