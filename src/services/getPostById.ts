import type { ImagesProps } from "../types/ImagesProps";

async function getPostById(
  extension: string | undefined,
  id: string | undefined
) {
  if (extension && id) {
    const res = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL}/api/deshiroku/${extension}/post/${id}`
    );
    const data: { success: boolean; data: ImagesProps } = await res.json();
    return data;
  }
}

export default getPostById;
