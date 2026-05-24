import { ReactNode } from "react";
import { theme } from "../styles/theme";

type CardProps = {
  children: ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <section
      style={{
        backgroundColor: theme.colors.panel,
        padding: theme.spacing.panelPadding,
        borderRadius: theme.borderRadius.panel,
        marginBottom: theme.spacing.sectionGap,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: "0 0 0 1px rgba(255, 122, 0, 0.03)"
      }}
    >
      {children}
    </section>
  );
}

export default Card;