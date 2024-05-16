function getCookieByName(name: string) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Verificar si la cookie comienza con el nombre buscado
    if (cookie.startsWith(name + "=")) {
      // Devolver el valor de la cookie
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}
export default getCookieByName