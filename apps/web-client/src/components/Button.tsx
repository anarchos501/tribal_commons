import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { theme } from "../styles/theme";

type ButtonProps = {
  children: ReactNode;
  variant?: "default" | "primary" | "muted";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

function Button({
  children,
  variant = "default",
  onClick,
  type = "button"
}: ButtonProps) {

  const [hovered, setHovered] =
    useState(false);

  const backgroundColors = {
    default: theme.colors.panelSecondary,
    primary: theme.colors.primaryAction,
    muted: theme.colors.primaryActionMuted
  };

  const hoverColors = {
    default: "#2b2b2b",
    primary: "#ff8f26",
    muted: "#b66a24"
  };

  const borderColors = {
    default: "rgba(255,255,255,0.06)",
    primary: "rgba(255,122,0,0.35)",
    muted: "rgba(255,122,0,0.18)"
  };

  const buttonStyle: CSSProperties = {
    marginRight: "0.5rem",
    padding: "0.55rem 1rem",

    backgroundColor:
      hovered
        ? hoverColors[variant]
        : backgroundColors[variant],

    color: theme.colors.textPrimary,

    border: `1px solid ${
      hovered
        ? "rgba(255,255,255,0.12)"
        : borderColors[variant]
    }`,

    borderRadius:
      theme.borderRadius.button,

    cursor: "pointer",

    fontSize: "0.82rem",
    fontWeight: 500,
    letterSpacing: "0.02em",

    transition:
      "background-color 140ms ease, border-color 140ms ease, transform 140ms ease",

    transform:
      hovered
        ? "translateY(-1px)"
        : "translateY(0px)"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      style={buttonStyle}
    >
      {children}
    </button>
  );
}

export default Button;
