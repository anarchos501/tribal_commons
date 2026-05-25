import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { theme } from "../styles/theme";

type CardProps = {
  children: ReactNode;
};

function Card({ children }: CardProps) {
  const [hovered, setHovered] = useState(false);

  const cardStyle: CSSProperties = {
    backgroundColor: theme.colors.panel,
    color: theme.colors.textSecondary,
    padding: theme.spacing.panelPadding,
    borderRadius: theme.borderRadius.panel,
    marginBottom: theme.spacing.sectionGap,
    border: `1px solid ${
      hovered
        ? "rgba(255, 122, 0, 0.18)"
        : theme.colors.border
    }`,
    boxShadow: hovered
      ? "0 0 0 1px rgba(255, 122, 0, 0.06)"
      : "0 0 0 1px rgba(255, 122, 0, 0.03)",
    transform: hovered
      ? "translateY(-1px)"
      : "translateY(0px)",
    transition:
      "border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease"
  };

  return (
    <section
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </section>
  );
}

export default Card;