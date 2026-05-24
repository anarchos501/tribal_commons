import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { theme } from "../styles/theme";

type ButtonProps = {
  children: ReactNode;
  variant?: "default" | "primary" | "muted";
  onClick?: () => void;
};

function Button({ children, variant = "default", onClick }: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const backgroundColors = {
    default: theme.colors.panelSecondary,
    primary: theme.colors.primaryAction,
    muted: theme.colors.primaryActionMuted
  };

  const hoverColors = {
    default: "#2a2a2a",
    primary: "#ff8f26",
    muted: "#b66a24"
  };

  const buttonStyle: CSSProperties = {
    marginRight: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: hovered ? hoverColors[variant] : backgroundColors[variant],
    color: theme.colors.textPrimary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.button,
    cursor: "pointer",
    transition: "background-color 120ms ease, border-color 120ms ease"
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={buttonStyle}
    >
      {children}
    </button>
  );
}

export default Button;