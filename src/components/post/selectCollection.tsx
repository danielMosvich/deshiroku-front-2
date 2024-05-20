import { useStore } from "@nanostores/react";
import { STORE_defaultCollection, STORE_user } from "../../store/userStore";
import type { Collection, UserProps } from "types/UserProps";
// import Button from "../../components/global-react/button";
import ButtonSave from "./buttonSave";
import type { ImagesProps } from "../../types/ImagesProps";

function SelectCollection({ post }: { post: ImagesProps }) {
  const $user = useStore(STORE_user) as UserProps;
  const handleDefaultCollection = (collection: Collection) => {
    STORE_defaultCollection.set(collection);
    localStorage.setItem("defaultCollection", JSON.stringify(collection));
  };
  return (
    $user && (
      <div className="bg-white mt-3 dark:bg-neutral-950/70 backdrop-blur-2xl ring-1 rounded-xl overflow-hidden max-w-xl w-72 max-h-[400px] flex flex-col p-2 select-none">
        <h2 className="text-center text-lg dark:text-neutral-50 font-semibold">
          Guardar
        </h2>
        <p className="text-xs ml-2 dark:text-neutral-300 font-semibold mt-2">
          Save it in your collections
        </p>
        <ul className="flex flex-col mt-1">
          {$user.collections.map((collection:Collection) => (
            <li
              key={collection._id}
              className="h-16 flex flex-row gap-2 items-center hover:bg-neutral-800 px-2 rounded-lg "
            >
              <div className="h-12 w-12 min-w-12 min-h-12 rounded-lg overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src={collection.images[0].preview_url}
                  alt=""
                />
              </div>
              <h2
                className="dark:text-white hover:underline cursor-pointer"
                onClick={() => {
                  handleDefaultCollection(collection);
                }}
              >
                {collection.name}
              </h2>

              <div className="ml-auto">
                <ButtonSave id={collection._id} post={post} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
export default SelectCollection;
