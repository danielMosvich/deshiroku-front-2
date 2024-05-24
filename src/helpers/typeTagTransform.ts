const typeTagTransform = (type: string): number => {
  if (type === "general" || type === "0") return 0;
  if (type === "artist" || type === "1") return 1;
  if (type === "copyrigth" || type === "3") return 3;
  if (type === "character" || type === "4") return 4;
  if (type === "meta" || type === "5") return 5;
  if (type === "metadata" || type === "2") return 5;
  return 0;
};

export default typeTagTransform;
