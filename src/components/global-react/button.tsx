import { useState, type ReactNode } from "react";
import styles from "./styles/button.module.css";
type variant = "normal" | "solid";
interface ButtonProps {
  children?: ReactNode;
  icon?: boolean;
  variant?: variant;
  active?: boolean;
  size?: number;
  text?: string;
  href?:string
}
function Button({
  children,
  icon,
  variant = "normal",
  active = false,
  size = 1,
  text,
  href
}: ButtonProps) {
  if (variant === "normal") {
    return (
      <>
        <button className={`${active ? styles.button_active : styles.button}`}
        onClick={() => { href && (window.location.href = href); }}>
          {children ? children : text}
        </button>
      </>
    );
  }
  if (variant === "solid") {
    return (
      <button
        className={`${
          active ? styles.button_solid_active : styles.button_solid
        }`}
        onClick={() => { href && (window.location.href = href); }}
      >
        {children ? children : text}
      </button>
    );
  }
}
export default Button;
