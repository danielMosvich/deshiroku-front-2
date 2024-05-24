async function getRecomendations(extension: string) {
  try {
    const response = await fetch(
      `${
        import.meta.env.PUBLIC_SERVER_URL
      }/api/deshiroku/${extension}/search/recomendations`
    );
    const data = (await response.json()) as {
      data: { url: string; name: string; image: string }[];
      success: boolean;
    };
    return data;
  } catch (error) {
    return { success: false, data: null };
  }
}
export default getRecomendations;
