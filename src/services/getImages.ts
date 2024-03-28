import type { ImagesProps } from "../types/ImagesProps";

async function getImages(extension:string, page:number) {
  const url = import.meta.env.PUBLIC_SERVER_URL
  // console.log(isProd)
  const res = await fetch(`${url}/api/deshiroku/${extension}/${String(page)}`);
  const data:{success:boolean, data:ImagesProps[]} = await res.json();
  return data
}

export default getImages

