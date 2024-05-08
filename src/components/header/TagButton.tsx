import type React from "react";
// TYPES TAGS
//               0 = general
//               1 = artist
//               3 = Copyright
//               4 = character
//               5 = meta

interface TagProps {
  children: string;
  flat?: boolean;
  type: number;
  action?: () => void;
}

function TagButton({ children, flat = false, type, action }: TagProps) {
  // console.log(children)
  function detectColorBG(type: number) {
    if (type === 0) {
      return "#e5e5e5";
    }
    if (type === 1) {
      return "#fecdd3";
    }
    if (type === 3) {
      return "#ddd6fe";
    }
    if (type === 4) {
      return "#ecfccb";
    }
    if (type === 5) {
      return "#ffedd5";
    }

    if (type === 2) {
      return "#ffedd5";
    }
    if (type === 6) {
      return "#ffedd5";
    }
  }
  function detectColorTEXT(type: number) {
    if (type === 0) {
      return "#000";
    }
    if (type === 1) {
      return "#e11d48";
    }
    if (type === 3) {
      return "#7c3aed";
    }
    if (type === 4) {
      return "#65a30d";
    }
    if (type === 5) {
      return "#d97706";
    }

    if (type === 2) {
      return "#d97706";
    }
    if (type === 6) {
      return "#d97706";
    }
  }

  function detectColorBG_flat(type: number) {
    if (type === 0) {
      return "#3b82f6";
    }
    if (type === 1) {
      return "#f43f5e";
    }
    if (type === 3) {
      return "#8b5cf6";
    }
    if (type === 4) {
      return "#84cc16";
    }
    if (type === 5) {
      return "#f97316";
    }

    if (type === 2) {
      return "#f97316";
    }
    if (type === 6) {
      return "#f97316";
    }
  }
  function detectColorTEXT_flat(type: number) {
    if (type === 0) {
      return "#f0f9ff";
    }
    if (type === 1) {
      return "#ffe4e6";
    }
    if (type === 3) {
      return "#f5f3ff";
    }
    if (type === 4) {
      return "#f0fdf4";
    }
    if (type === 5) {
      return "#fefce8";
    }

    if (type === 2) {
      return "#fefce8";
    }
    if (type === 6) {
      return "#fefce8";
    }
  }
  function detectTextType() {
    if (children === "sort:updated:desc") {
      return "recent";
    }
    if (children === "sort:updated:asc") {
      return "ancient";
    }
    if (children === "sort:score:asc") {
      return "old popular";
    }
    if(children === "sort:score:desc"){
      return "popular"
    }
    if (children.includes("score:%3E=")) {
      return (
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2q-.225-.175-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562q.1-.275.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15q.275 0 .537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45q.1.275.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437q-.225.175-.525.2t-.575-.15z"
            />
          </svg>
          {children.split("=")[1]}
        </div>
      );
    }
    return children;
  }
  if (flat) {
    return (
      <button
        onClick={action}
        style={{
          backgroundColor: detectColorBG_flat(type),
          color: detectColorTEXT_flat(type),
        }}
        className={`px-3 py-2 rounded-full w-fit font-semibold whitespace-nowrap`}
      >
        {detectTextType()}
      </button>
    );
  } else {
    return (
      <button
        onClick={action}
        style={{
          backgroundColor: detectColorBG(type),
          color: detectColorTEXT(type),
          // border: ` 1px solid ${detectColorTEXT(type)}`,
        }}
        className={`px-3 py-2 rounded-full w-fit font-semibold whitespace-nowrap flex items-center gap-2`}
      >
        {children}
      </button>
    );
  }
}

export default TagButton;
