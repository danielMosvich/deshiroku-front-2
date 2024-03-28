// import type { ImagesProps } from "../types/ImagesProps";

async function getCollection(id: string) {
  // console.log(id, "xd");
  const res = await fetch(`${import.meta.env.PUBLIC_SERVER_URL}/api/user/collection/some`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
  // console.log(data);
  // return data;
}

export default getCollection;
