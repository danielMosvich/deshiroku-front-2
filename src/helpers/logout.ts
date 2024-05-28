function logout() {
  localStorage.clear();
  const cookies = document.cookie.split(";");

  // Itera sobre cada cookie
  for (let i = 0; i < cookies.length; i++) {
    // Obtiene el nombre de la cookie
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;

    // Establece la cookie con una fecha de expiración pasada
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
  window.location.href = "/";
}
export default logout;