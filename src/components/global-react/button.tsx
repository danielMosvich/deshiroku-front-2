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
  href?: string;
  disabled?: boolean;
}
function Button({
  children,
  icon,
  variant = "normal",
  active = false,
  size = 1,
  text,
  href,
  disabled,
}: ButtonProps) {
  if (variant === "normal") {
    return (
      <>
        {icon ? (
          <button
            disabled={disabled}
            className={`${
              active ? styles.button_active_icon : styles.button_icon
            }`}
            onClick={() => {
              href && (window.location.href = href);
            }}
          >
            {children ? children : text}
          </button>
        ) : (
          <button
            disabled={disabled}
            className={`${active ? styles.button_active : styles.button}`}
            onClick={() => {
              href && (window.location.href = href);
            }}
          >
            {children ? children : text}
          </button>
        )}
      </>
    );
  }
  if (variant === "solid") {
    return (
      <>
        {icon ? (
          <button
            disabled={disabled}
            className={`${
              active ? styles.button_solid_active_icon : styles.button_solid_icon
            }`}
            onClick={() => {
              href && (window.location.href = href);
            }}
          >
            {children ? children : text}
          </button>
        ) : (
          <button
            disabled={disabled}
            className={`${
              active ? styles.button_solid_active : styles.button_solid
            }`}
            onClick={() => {
              href && (window.location.href = href);
            }}
          >
            {children ? children : text}
          </button>
        )}
      </>
    );
  }
}
export default Button;
