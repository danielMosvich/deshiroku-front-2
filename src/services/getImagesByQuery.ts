import type { ImagesProps } from "../types/ImagesProps";

async function getImagesByQuery(
  extension: string,
  query: string,
  page: number
) {
  const res = await fetch(
    `${import.meta.env.PUBLIC_SERVER_URL}/api/deshiroku/${extension}/search/${String(
      query
    )}/${page}`
  );
  const data: { success: boolean; data: ImagesProps[] } = await res.json();
  return data;
}

export default getImagesByQuery;
