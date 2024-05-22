function ImageNullFilter(images: [], data: [{}]) {
    const arrayImagesNull = images
    .map((img, index) => (img === null ? index : null))
    .filter((index) => index !== null);
    const filteredItems = data.filter(
    (_, index) => !arrayImagesNull.includes(index)
  );
  return filteredItems;
}
export default ImageNullFilter;
754947