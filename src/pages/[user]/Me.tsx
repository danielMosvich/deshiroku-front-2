import { useEffect, useState } from "react";
import type { Collection, UserProps } from "../../types/UserProps";
import "./user.css";
import CardCollection from "../../components/profile/cardCollection";
import getMe from "../../api/user/get/getMe";
import { STORE_user } from "../../store/userStore";
import { useStore } from "@nanostores/react";
import MyButton from "../../components/global-react/myButton";
function Me() {
  const [user, setUser] = useState<null | UserProps>(null);
  const $user = useStore(STORE_user) as UserProps;
  useEffect(() => {
      getMe().then((res) => {
        if (res.success) {
          setUser(res.data);
        }
      });
  }, []);
  return (
    <>
      {user && (
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
                <MyButton icon radius="full">
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
            <section className="mt-8">
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
      )}
    </>
  );
}
export default Me;
