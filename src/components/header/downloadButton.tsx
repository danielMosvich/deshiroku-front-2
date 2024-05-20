import { useState } from "react";
import Alert from "../../components/global-native/alert";

function DownloadButton({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleDownloadClick = async (imageUrl: string): Promise<void> => {
    try {
      const proxyUrl = `${
        import.meta.env.PUBLIC_SERVER_URL
      }/proxy?imageUrl=${encodeURIComponent(imageUrl)}`;

      // Descarga la imagen
      const response = await fetch(proxyUrl, {
        headers: { "Content-Type": "image/png" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Crea un enlace para descargar la imagen
      const link = document.createElement("a");
      link.href = url;
      const extension = imageUrl.split(".").pop();
      if (extension) {
        link.setAttribute(
          "download",
          `${extension}-${Date.now()}.${extension}`
        );
      }
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      // Obtiene el tamaño del archivo de imagen
      const sizeResponse = await fetch(
        `${
          import.meta.env.PUBLIC_SERVER_URL
        }/proxy/size?imageUrl=${encodeURIComponent(imageUrl)}`
      );
      if (!sizeResponse.ok) {
        throw new Error(`HTTP error! status: ${sizeResponse.status}`);
      }
      const sizeData = await sizeResponse.json();
      if (sizeData.success) {
        Alert("bottom", 3000, "success", "Image downloaded", sizeData.data);
        setIsLoading(false);
      } else {
        throw new Error(`Server error: ${sizeData.message}`);
      }
    } catch (error: any) {
      console.error("Error downloading or fetching image size:", error);
      Alert("bottom", 2000, "error", "Download error", error.message);
    }
  };
  return (
    <button
      disabled={isLoading}
      onClick={() => {
        handleDownloadClick(url);
        setIsLoading(true);
      }}
      className={`hover:bg-neutral-300 p-2 grid place-content-center w-10 h-10 rounded-full capitalize text-black font-semibold dark:text-white dark:hover:bg-white dark:hover:text-black ${
        isLoading ? "opacity-30" : "opacity-100"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5rem"
        height="1.5rem"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"
        />
      </svg>
    </button>
  );
}
export default DownloadButton;
