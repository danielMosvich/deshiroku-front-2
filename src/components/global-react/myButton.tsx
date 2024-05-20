import React from "react";
import "./styles/myButton.css";

interface MyButtonProps {
  variant?:
    | "solid"
    | "faded"
    | "outline"
    | "light"
    | "flat"
    | "ghost"
    | "shadow";
  color?: "primary" | "secondary" | "warning" | "danger";
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "2xl" | "3xl" | "full";
  icon?: boolean;
}
const MyButton: React.FC<MyButtonProps> = ({
  variant = "solid",
  color = "primary",
  size = "md",
  radius = "lg",
  children,
  onClick,
  disabled,
  icon,
  ...props
}) => {
  const getSizeStyles = () => {
    if (icon) {
      switch (size) {
        case "sm":
          return {
            padding: "0px",
            height: "32px",
            minHeight: "32px",
            maxHeight: "32px",
            width: "32px",
            minWidth: "32px",
            maxWidth: "32px",
            fontSize: "0.8rem",
          };
        case "lg":
          return {
            padding: "0px",
            height: "48px",
            minHeight: "48px",
            maxHeight: "48px",
            width: "48px",
            minWidth: "48px",
            maxWidth: "48px",
            fontSize: "1.2rem",
          };
        default:
          return {
            padding: "0px",
            height: "40px",
            minHeight: "40px",
            maxHeight: "40px",
            width: "40px",
            minWidth: "40px",
            maxWidth: "40px",
            fontSize: "1rem",
          };
      }
    }
    switch (size) {
      case "sm":
        return {
          padding: "0 12px",
          height: "32px",
          minHeight: "32px",
          maxHeight: "32px",
          fontSize: "0.875rem",
        };
      case "lg":
        return {
          padding: "0 24px",
          height: "48px",
          minHeight: "48px",
          maxHeight: "48px",
          fontSize: "1.2rem",
        };
      default:
        return {
          padding: "0 16px",
          height: "40px",
          minHeight: "40px",
          maxHeight: "40px",
          fontSize: "1rem",
        };
    }
  };

  const getRadiusStyles = () => {
    switch (radius) {
      case "sm":
        return { borderRadius: "2px" };
      case "md":
        return { borderRadius: "4px" };
      case "lg":
        return { borderRadius: "8px" };
      case "2xl":
        return { borderRadius: "12px" };
      case "3xl":
        return { borderRadius: "16px" };
      case "full":
        return { borderRadius: "9999px" };
      default:
        return { borderRadius: "0px" };
    }
  };

  const buttonClassName = `my-button ${variant} font-semibold ${color}`;

  return (
    <button
      className={buttonClassName}
      style={{ ...getSizeStyles(), ...getRadiusStyles() }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default MyButton;
