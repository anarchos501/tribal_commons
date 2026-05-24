import { ReactNode } from "react";
import { theme } from "../styles/theme";

type PageLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function PageLayout({
  title,
  description,
  children
}: PageLayoutProps) {
  return (
    <div>
      <header
        style={{
          marginBottom: "1.75rem",
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: "1rem"
        }}
      >
        <h1
          style={{
            margin: 0,
            color: theme.colors.textPrimary,
            fontSize: "1.6rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 600
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              marginTop: "0.5rem",
              marginBottom: 0,
              color: theme.colors.textMuted,
              fontSize: "0.9rem",
              lineHeight: 1.5
            }}
          >
            {description}
          </p>
        )}
      </header>

      {children}
    </div>
  );
}

export default PageLayout;