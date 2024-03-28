import type { UserProps } from "@/types/UserProps";
// import type { ImagesProps } from "@/types/ImagesProps";

async function getUser(extension: string) {
  const res = await fetch(
    `${import.meta.env.PUBLIC_SERVER_URL}/api/user/search/${extension}`,
    { credentials: "include" }
  );
  const data: { success: boolean; data: UserProps } = await res.json();
  //   console.log(data);
  return data;
}

export default getUser;
