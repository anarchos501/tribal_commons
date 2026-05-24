import { ReactNode } from "react";
import { theme } from "../styles/theme";

type ButtonProps = {
  children: ReactNode;
  variant?: "default" | "primary" | "warning";
  onClick?: () => void;
};

function Button({
  children,
  variant = "default",
  onClick
}: ButtonProps) {

  const backgroundColors = {
    default: theme.colors.panelSecondary,
    primary: theme.colors.primaryAction,
    warning: theme.colors.warning
  };

  return (
    <button
      onClick={onClick}
      style={{
        marginRight: "0.5rem",
        padding: "0.5rem 1rem",
        backgroundColor: backgroundColors[variant],
        color: theme.colors.textPrimary,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.button,
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
}

export default Button;