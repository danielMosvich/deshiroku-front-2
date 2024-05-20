import { useEffect, useState } from "react";
import type { Collection, UserProps } from "../../types/UserProps";
import "./user.css";
import CardCollection from "../../components/profile/cardCollection";
import Button from "../../components/global-react/button";
import getUserByUsername from "../../api/user/get/getUserByUsername";
function Other({ user: username }: { user: string }) {
  const [user, setUser] = useState<null | UserProps>(null);
  useEffect(() => {
    getUserByUsername(username).then((res) => {
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
            {/* <div className="bg-rose-500 w-32 h-32 rounded-full flex items-center justify-center font-semibold font-ui text-5xl capitalize">
              {user.username.split("")[0]}
            </div> */}
            <button className="button-profile uppercase font-semibold text-6xl">
              {user.username.split("")[0]}
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>

            <h2 className="font-semibold text-2xl mt-5 dark:text-neutral-50">{user.name}</h2>
            <h3 className=" text-lg dark:text-neutral-50">@{user.username}</h3>

            <div className="flex gap-3 mt-5">
              <Button variant="solid">Share profile</Button>
            </div>
          </div>

          <div className="md:px-10 px-4">
            <section className="flex items-center justify-between border-b mt-10  pb-2">
              <h2 className="sm:text-2xl text-xl font-ui font-semibold dark:text-neutral-50">
                collections
              </h2>
            </section>
            <section className="mt-8">
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:flex 2xl:w-full w-fit gap-5 mx-auto  2xl:flex-wrap">
                {user.collections.map((item: Collection) => (
                  <CardCollection
                    href={`/${user.username}/${item.name}/${item._id}`}
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
export default Other;
