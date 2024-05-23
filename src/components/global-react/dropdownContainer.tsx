import React, { useState, useEffect, useRef } from "react";

interface DropdownContainerProps {
  children: React.ReactNode;
  dropdownContent: React.ReactNode;
  className?:string
  classNamePather?:string
  props?:any
  classNameDropdown?:string
  position?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

function DropdownContainer({
  children,
  dropdownContent,
  position = "bottom",
  classNameDropdown,
  props,
  classNamePather
}: DropdownContainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const getDropdownStyles = () => {
    switch (position) {
      case "top":
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { top: "100%", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { top: "50%", right: "100%", transform: "translateY(-50%)" };
      case "right":
        return { top: "50%", left: "100%", transform: "translateY(-50%)" };
      case "top-left":
        return { bottom: "100%", left: 0 };
      case "top-right":
        return { bottom: "100%", right: 0 };
      case "bottom-left":
        return { top: "100%", left: 0 };
      case "bottom-right":
        return { top: "100%", right: 0 };
      default:
        return {};
    }
  };

  return (
    <div
      ref={dropdownRef}
      // style={{ position: "relative", display: "flex" }}
      className={`${classNamePather ? classNamePather : "relative flex"}`}
    >
      <div
        {...props}
        className="w-full"
        onClick={toggleDropdown}
      >
        {children}
      </div>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            ...getDropdownStyles(),
          }}
          className={`${classNameDropdown ? classNameDropdown : ""}`}
        >
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

export default DropdownContainer;
