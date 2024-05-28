import { useEffect, useRef, type HTMLAttributes } from "react";
import "./styles/modalContainer.css";
interface ModalQuestionProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  props?: any;
  onClose: () => void;
}
function ModalQuestion({ children, props, onClose }: ModalQuestionProps) {
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
            document.body.style.overflow = "auto";
            onClose();
          }
        });
      }
    } else {
      document.body.style.overflow = "auto";
      onClose();
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div
      ref={modalContainerRef}
      className="my_modal-overlay  fixed w-full h-screen top-0 left-0 z-50 grid place-content-center"
      onClick={handleClickOutside}
    >
      <div onClick={(e) => e.stopPropagation()} ref={modalRef} {...props}>
        {children}
      </div>
    </div>
  );
}
export default ModalQuestion;
