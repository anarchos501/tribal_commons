import type { ReactNode } from "react";
import type { CSSProperties } from "react";
import { theme } from "../styles/theme";

type PageLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function PageLayout({ title, description, children }: PageLayoutProps) {
  const headerStyle: CSSProperties = {
    marginBottom: "1.75rem",
    borderBottom: `1px solid ${theme.colors.border}`,
    paddingBottom: "1rem"
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    color: theme.colors.textPrimary,
    fontSize: "1.6rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontWeight: 600
  };

  const descriptionStyle: CSSProperties = {
    marginTop: "0.5rem",
    marginBottom: 0,
    color: theme.colors.textMuted,
    fontSize: "0.9rem",
    lineHeight: 1.5
  };

  return (
    <div>
      <header style={headerStyle}>
        <h1 style={titleStyle}>{title}</h1>

        {description && <p style={descriptionStyle}>{description}</p>}
      </header>

      {children}
    </div>
  );
}

export default PageLayout;