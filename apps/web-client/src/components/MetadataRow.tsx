import { theme } from "../styles/theme";

type MetadataRowProps = {
  label: string;
  value: string;
  color?: string;
};

function MetadataRow({
  label,
  value,
  color = theme.colors.textSecondary
}: MetadataRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        padding: "0.3rem 0",
        borderBottom:
          "1px solid rgba(255,255,255,0.03)"
      }}
    >
      <span
        style={{
          color: theme.colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "0.68rem",
          fontWeight: 600,
          opacity: 0.9
        }}
      >
        {label}
      </span>

      <span
        style={{
          color,
          fontSize: "0.86rem",
          fontWeight: 500,
          textAlign: "right"
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default MetadataRow;