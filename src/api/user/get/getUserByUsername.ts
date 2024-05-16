// import type { UserProps } from "types/UserProps";

// interface GetUserProps {
//   success: boolean;
//   data: UserProps | null;
//   message?: string; // Hacer message opcional
// }

async function fetchUserDataFromServer(
  username: string
): Promise<any> {
  try {
    const responseApi = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL}/api/user/${username}`,
      {
        method: "GET",
      }
    );
    const data = await responseApi.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
}

async function getUserByUsername(username: string): Promise<any> {
  try {
    const response = await fetchUserDataFromServer(username);
    return response;
  } catch (error) {
    return { success: false, message: "fetch failed", data: null };
  }
}

export default getUserByUsername;
