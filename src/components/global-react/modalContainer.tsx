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
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = () => {
    if (window.innerWidth < 768) {
      if (modalRef.current && modalContainerRef.current) {
        modalContainerRef.current.style.animation =
          "fade-out 0.4s forwards cubic-bezier(0.4, 0, 0, 1)";
        modalRef.current.style.animation =
          "slide-down 0.4s forwards cubic-bezier(0.4, 0, 0, 1)";
        modalRef.current.addEventListener("animationend", () => {
          if (modalRef.current) {
            onClose();
            document.body.style.overflow = "auto";
          }
        });
      }
    } else {
      onClose();
      document.body.style.overflow = "auto";
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);
  return (
    <div
      ref={modalContainerRef}
      className="my_modal-overlay fixed w-full h-full top-0 left-0 z-50 flex justify-center items-center"
      onClick={handleClickOutside}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my_modal overflow-auto absolute bottom-0 rounded-t-2xl md:rounded-2xl w-full md:relative md:w-4/5 lg:w-3/5 xl:w-2/4 bg-white dark:bg-neutral-900"
        style={{ height: height, paddingTop: icon ? "2.2rem" : "0" }}
        ref={modalRef}
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
