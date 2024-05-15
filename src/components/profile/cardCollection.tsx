import type { Collection } from "../../types/UserProps";

function CardCollection({ item }: { item: Collection }) {
  return (
    item && (
      <a className="flex flex-col">
        <div
          style={{ gridTemplateColumns: "2fr 1fr" }}
          className="sm:w-60 h-40  sm:max-h-40 sm:min-h-40 bg-white ring-1 ring-white shadow-md rounded-2xl grid grid-rows-1 gap-[1px] overflow-hidden"
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
            {item.images[1]?.preview_url ? (
              <img
                className="h-full object-cover w-full"
                src={item.images[1].preview_url}
                alt=""
              />
            ) : (
              <div className="bg-neutral-300 w-full h-full" />
            )}
          </div>
        </div>
        <h2 className="font-semibold text-lg overflow-hidden whitespace-nowrap text-ellipsis mt-2 font-ui">
          {item.name}
        </h2>
        <p className="text-xs text-neutral-600 font-semibold">
          {item.images.length} images
        </p>
      </a>
    )
  );
}

export default CardCollection;
