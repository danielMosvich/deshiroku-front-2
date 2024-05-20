import React, { useEffect, useRef } from "react";
import "./styles/modalContainer.css";
import MyButton from "./myButton";

type ModalProps = {
  height: string;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  icon?: boolean;
};

const ModalContainer: React.FC<ModalProps> = ({
  onClose,
  children,
  height,
  title,
  icon,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       modalRef.current &&
  //       !modalRef.current.contains(event.target as Node)
  //     ) {
  //       onClose();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [onClose]);

  //   const getModalPosition = (): React.CSSProperties => {
  //     switch (position) {
  //       case "top":
  //         return { top: "10%", left: "50%", transform: "translate(-50%, 0)" };
  //       case "left":
  //         return { top: "50%", left: "10%", transform: "translate(0, -50%)" };
  //       case "right":
  //         return {
  //           top: "50%",
  //           right: "10%",
  //         //   height: "1000px",
  //           transform: "translate(0, -50%)",
  //         };
  //       case "bottom":
  //         return { bottom: "10%", left: "50%", transform: "translate(-50%, 0)" };
  //       case "center":
  //       default:
  //         return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  //     }
  //   };

  return (
    <div className="modal-overlay fixed w-full h-full top-0 left-0 z-50 flex justify-center items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal absolute bottom-0 rounded-t-2xl md:rounded-2xl md:relative md:w-4/5 lg:w-3/5 xl:w-2/4 bg-white dark:bg-neutral-900"
        ref={modalRef}
        style={{ height: height, paddingTop: icon ? "2.2rem" : "0" }}
      >
        {title && (
          <h2 className="text-2xl  font-semibold w-[90%] pl-3 dark:text-white">
            {title}
          </h2>
        )}
        {icon && (
          <div onClick={onClose} className="absolute right-1 top-1">
            <MyButton icon radius="full" size="sm" variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2rem"
                height="2rem"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z"
                />
              </svg>
            </MyButton>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
