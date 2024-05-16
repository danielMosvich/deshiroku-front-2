interface Cookies {
  [key: string]: string;
}

function getCookies(): Cookies | null {
  const cookieString = document.cookie.trim();
  if (cookieString === "") {
    return null; // Devuelve null si no hay cookies presentes
  }

  const cookies: Cookies = {};
  cookieString.split(";").forEach((cookie) => {
    const [name, value] = cookie.split("=").map((part) => part.trim());
    cookies[name] = decodeURIComponent(value);
  });

  return cookies;
}
export default getCookies