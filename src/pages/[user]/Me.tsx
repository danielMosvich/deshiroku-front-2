import { useEffect, useState } from "react";
import type { Collection, UserProps } from "../../types/UserProps";
import "./user.css";
import CardCollection from "../../components/profile/cardCollection";
import getMe from "../../api/user/get/getMe";
import { STORE_user } from "../../store/userStore";
import { useStore } from "@nanostores/react";
import MyButton from "../../components/global-react/myButton";
import PageLoader from "../../components/loaders/pageLoader";
import createCollection from "../../api/user/post/createCollection";
import ModalQuestion from "../../components/global-react/modalQuestion";
function Me() {
  const [user, setUser] = useState<null | UserProps>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showAddButton, setShowAddButton] = useState(true);
  const $user = useStore(STORE_user) as UserProps;
  useEffect(() => {
    getMe().then((res) => {
      if (res.success) {
        setUser(res.data);
      }
    });
  }, [$user]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueUnfilter = e.target.value;
    const value = valueUnfilter.replace(/[^a-zA-Z0-9\s\-_]+/g, "");
    setInputValue(value);
  };

  const handleCreateCollection = () => {
    if (inputValue === "") return;
    const sanitizedCollectionName = inputValue.replace(
      /[^a-zA-Z0-9\s\-_]+/g,
      ""
    );
    setShowAddButton(false);
    createCollection(sanitizedCollectionName).then(
      (e:any) => {
        if (e.success) {
          setInputValue("");
          setShowAddModal(false);
          setShowAddButton(true);
        } else{
          setShowAddButton(true);

        }
      }
    );
  };

  return (
    <>
      {user ? (
        <div>
          <div className="flex flex-col items-center">
            <button className="button-profile uppercase font-semibold text-6xl">
              {user.username.split("")[0]}
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>

            <h2 className="font-semibold text-2xl mt-5 dark:text-neutral-50">
              {user.name}
            </h2>
            <h3 className=" text-lg dark:text-neutral-50">@{user.username}</h3>

            <div className="flex gap-3 mt-5">
              <MyButton variant="solid">Share profile</MyButton>
              <MyButton variant="flat" color="warning" disabled>
                Edit profile
              </MyButton>
            </div>
          </div>

          <div className="md:px-10 px-4">
            <section className="flex items-center justify-between border-b mt-10  pb-2">
              <h2 className="sm:text-2xl text-xl font-ui font-semibold dark:text-neutral-50">
                Your collections
              </h2>
              <aside className="flex gap-2 items-center justify-center h-full">
                <MyButton
                  icon
                  radius="full"
                  onClick={() => setShowAddModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5rem"
                    height="1.5rem"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M417.4 224H288V94.6c0-16.9-14.3-30.6-32-30.6s-32 13.7-32 30.6V224H94.6C77.7 224 64 238.3 64 256s13.7 32 30.6 32H224v129.4c0 16.9 14.3 30.6 32 30.6s32-13.7 32-30.6V288h129.4c16.9 0 30.6-14.3 30.6-32s-13.7-32-30.6-32z"
                      fill="currentColor"
                    />
                  </svg>
                </MyButton>
                <MyButton icon disabled radius="full" color="secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5rem"
                    height="1.5rem"
                    viewBox="0 0 12 12"
                  >
                    <path
                      fill="currentColor"
                      d="M1 2.75A.75.75 0 0 1 1.75 2h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 1 2.75m2 3A.75.75 0 0 1 3.75 5h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 3 5.75M5.25 8a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5z"
                    />
                  </svg>
                </MyButton>
              </aside>
            </section>
            <section className="my-8">
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:flex 2xl:w-full w-fit gap-5 mx-auto  2xl:flex-wrap">
                {user.collections.map((item: Collection) => (
                  <CardCollection
                    href={`/${user.username}/${item.name}`}
                    item={item}
                    key={item._id}
                  />
                ))}
              </ul>
            </section>
          </div>
        </div>
      ) : (
        <PageLoader></PageLoader>
      )}
      {showAddModal && (
        <ModalQuestion onClose={() => setShowAddModal(false)}>
          <div className="bg-neutral-100/90 backdrop-blur-2xl p-4 rounded-xl md:min-w-[400px] w-full mx-auto">
            <h3 className=" font-semibold text-md">New name collection</h3>
            <input
              className="bg-white px-3 py-3 outline-offset-4 outline-2 outline-sky-500 rounded-xl border-none mt-2 w-full"
              type="text"
              placeholder="new name collection"
              name="input-new-collection-name"
              value={inputValue}
              onChange={handleInput}
            />
            <div className="flex justify-end gap-2 mt-3">
              <MyButton
                radius="2xl"
                variant="light"
                onClick={() => {setShowAddModal(false);}}
                color="danger"
              >
                Cancel
              </MyButton>

              <MyButton
                radius="2xl"
                variant="light"
                onClick={handleCreateCollection}
                disabled={!showAddButton}
              >
                Create
              </MyButton>
            </div>
          </div>
        </ModalQuestion>
      )}
    </>
  );
}
export default Me;
