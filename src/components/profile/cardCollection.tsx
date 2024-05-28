import type { Collection } from "../../types/UserProps";

function CardCollection({ item, href }: { item: Collection,href:string }) {
  return (
    item && (
      <a href={href} className="flex flex-col">
        <div
          style={{ gridTemplateColumns: "2fr 1fr", gridAutoRows: "120px" }}
          className="md:w-60 md:h-40 min-w-40 h-[120px] md:max-h-40 md:min-h-40 bg-white ring-1 ring-white shadow-md rounded-2xl grid grid-rows-1 gap-[1px] overflow-hidden"
        >
          <div className="h-full">
            {item.images[0]?.preview_url ? (
              <img
                className="h-full w-full object-cover"
                src={item.images[0].preview_url}
                alt=""
              />
            ) : (
              <div className="bg-neutral-300 w-full h-full" />
            )}
          </div>
          <div className="grid grid-cols-1 grid-rows-2 h-full gap-[1px]">
            {item.images[1]?.preview_url ? (
              <img
                className="h-full object-cover w-full"
                src={item.images[1].preview_url}
                alt=""
              />
            ) : (
              <div className="bg-neutral-300 w-full h-full" />
            )}
            {item.images[2]?.preview_url ? (
              <img
                className="h-full object-cover w-full"
                src={item.images[2].preview_url}
                alt=""
              />
            ) : (
              <div className="bg-neutral-300 w-full h-full" />
            )}
          </div>
        </div>
        <h2 className="font-semibold text-lg overflow-hidden whitespace-nowrap text-ellipsis mt-2 font-ui dark:text-neutral-50">
          {item.name}
        </h2>
        <p className="text-xs text-neutral-600 font-semibold dark:text-neutral-400">
          {item.images.length} images
        </p>
      </a>
    )
  );
}

export default CardCollection;
