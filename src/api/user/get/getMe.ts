import type { UserProps } from "types/UserProps";
import getCookieByName from "../../../helpers/getCookieByName";

interface GetMeProps {
  success: boolean;
  data: UserProps | null;
  message?: string | null; // Hacer message opcional
}

async function fetchUserDataFromServer(
  token: string
): Promise<{ success: boolean; data: UserProps }> {
  // Quitar 'message' de la respuesta de la promesa
  try {
    const responseApi = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL}/api/user/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.stringify({ token: token })}`,
        },
      }
    );
    const data = await responseApi.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
}

async function getMe(): Promise<GetMeProps> {
  const token = getCookieByName("token");
  if (!token) {
    return { success: false, data: null, message: "cookies is not there" };
  }

  try {
    const response = await fetchUserDataFromServer(token);
    return response;
  } catch (error) {
    return { success: false, message: "fetch failed", data: null };
  }
}

export default getMe;
