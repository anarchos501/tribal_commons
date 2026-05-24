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
    <p
      style={{
        margin: "0.35rem 0",
        fontSize: "0.82rem",
        color: theme.colors.textSecondary
      }}
    >
      <span
        style={{
          color: theme.colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginRight: "0.4rem",
          fontSize: "0.72rem"
        }}
      >
        {label}
      </span>

      <span style={{ color }}>
        {value}
      </span>
    </p>
  );
}

export default MetadataRow;