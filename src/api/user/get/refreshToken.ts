import getCookieByName from "../../../helpers/getCookieByName";

async function fetchRefreshTokenServer(url: string) {
  try {
    const responseApi = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL}/api/user/refresh-token`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.stringify({ token: url })}`,
        },
      }
    );
    const data = await responseApi.json();
    if (data) {
      function transformCookies(
        name: string,
        token: string,
        expires_in: number
      ) {
        const currentTime = new Date(); // <== tiempo actual
        const token_expiration = expires_in; // <== una hora
        const token_expirationDate = new Date(
          currentTime.getTime() + token_expiration
        );
        const token_expirationString = token_expirationDate.toUTCString();
        const access_token = `${name}=${token}; expires=${token_expirationString}; path=/`;
        return access_token;
      }
      const access_token = transformCookies(
        "access_token",
        data.access_token.token,
        data.access_token.expires_in
      );
      const refresh_token = transformCookies(
        "refresh_token",
        data.refresh_token.token,
        data.refresh_token.expires_in
      );

      document.cookie = access_token;
      document.cookie = refresh_token;
      window.location.reload();
    }
  } catch (error) {
    localStorage.clear();
    window.location.reload();
  }
}

async function refreshToken() {
  const accessTokenString = getCookieByName("access_token") as string;
  const refreshTokenString = getCookieByName("refresh_token") as string;

  if (refreshTokenString && !accessTokenString) {
    // console.log("SOLO HAY REFRESH TOKEN");
    fetchRefreshTokenServer(refreshTokenString);
  }
  if (!refreshTokenString && !accessTokenString) {
    // console.log("NO HAY COKKIES");
    localStorage.clear();
    window.location.reload();
  }
  if (!refreshTokenString && accessTokenString) {
    document.cookie.split(";").forEach(function (cookie) {
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    });
    console.log("XD")
    localStorage.clear();
    window.location.reload();
  }
}
export default refreshToken;
