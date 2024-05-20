import getCookieByName from "../../../helpers/getCookieByName";

interface GetCollectionProps {}
async function fetchUserDataFromServer(
  username: string,
  collectionName: string,
  token?: string | null
): Promise<any> {
  const res = await fetch(
    `${
      import.meta.env.PUBLIC_SERVER_URL
    }/api/user/collection/${username}/${collectionName}`,
    {
      method: "GET",
      headers: token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify({ token: token })}`,
          }
        : {
            "Content-Type": "application/json",
          },
    }
  );
  const data = await res.json();
  return data
//   console.log(data);
}

async function getCollectionByUsername(username: string, collection: string) {
  const token = getCookieByName("access_token") as string
//   if (!token) {
//     return { success: false, data: null, message: "cookies is not there" };
//   }
// console.log(token,"TOKEN")
  try {
    return await fetchUserDataFromServer(username, collection, token);
  } catch (error) {}
}
export default getCollectionByUsername
