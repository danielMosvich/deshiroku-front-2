interface DropDownProps {
  position: "center" | "left" | "right";
  children: React.ReactNode | JSX.Element;
  close: () => void;
  padding?:boolean
}
function DropDown({ position = "left", children, close, padding=true }: DropDownProps) {
  const getPosition = () => {
    if (position === "left") {
      return {
        top: "calc(100% + 10px)",
        left: "0px",
      };
    }
    if (position === "right") {
      return {
        top: "calc(100% + 10px)",
        right: "0px",
      };
    }
    if (position === "center") {
      return {
        top: "calc(100% + 10px)",
        right: "0px",
        left: "0px",
        margin: "0px auto",
      };
    }
  };
  return (
    <div
      style={getPosition()}
      className="absolute w-fit z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{padding: padding ? "20px" : "0px"}} className="bg-white dark:bg-neutral-900 shadow-xl ring-2 rounded-xl w-fit h-fit absolute top-0 left-0 z-20 pointer-events-auto overflow-hidden">
        {children}
      </div>
      <div onClick={close} className="bg-black/40 w-full  h-screen fixed top-0 left-0" />
    </div>
  );
}
export default DropDown;
