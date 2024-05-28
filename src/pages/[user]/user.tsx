import { useEffect, useState } from "react";
import type { UserProps } from "../../types/UserProps";
import Me from "./Me";
import Other from "./Other";
// import { STORE_user } from "../../store/userStore";
// import { useStore } from "@nanostores/react";

function User({ user }: { user?: string }) {
  const [localUser, setLocalUser] = useState<UserProps | null>(null);
  // const $user = useStore(STORE_user) as UserProps;
  useEffect(() => {
    if (localStorage.getItem("user"))
      setLocalUser(JSON.parse(localStorage.getItem("user") as string));
  }, []);

  return (
    <div>
      {localUser ? (
        String(localUser.username.toLowerCase()) ===
        String(user?.toLocaleLowerCase()) ? (
          <div>
            <Me />
          </div>
        ) : (
          <div>
            <Other user={user as string} />
          </div>
        )
      ) : (
        <div>
          <Other user={user as string} />
        </div>
      )}
    </div>
  );
}
export default User;
