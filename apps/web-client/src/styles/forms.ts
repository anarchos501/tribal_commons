import type { CSSProperties } from "react";
import { theme } from "./theme";

export const formPanelStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  padding: "1rem",
  backgroundColor: theme.colors.panelSecondary,
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: theme.borderRadius.panel
};

export const formHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  marginBottom: "0.25rem"
};

export const formTitleStyle: CSSProperties = {
  margin: 0,
  color: theme.colors.textPrimary,
  fontSize: "0.95rem",
  fontWeight: 600
};

export const formHintStyle: CSSProperties = {
  margin: 0,
  color: theme.colors.textMuted,
  fontSize: "0.78rem",
  lineHeight: 1.4
};

export const fieldGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "0.75rem"
};

export const fieldStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.65rem 0.75rem",
  backgroundColor: theme.colors.background,
  color: theme.colors.textPrimary,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.button,
  font: "inherit",
  fontSize: "0.86rem"
};

export const textAreaStyle: CSSProperties = {
  ...fieldStyle,
  minHeight: "92px",
  resize: "vertical"
};

export const formActionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  alignItems: "center"
};
