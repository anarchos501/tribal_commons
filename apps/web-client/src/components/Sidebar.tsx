import { theme } from "../styles/theme";

type SidebarProps = {
  activePage: string;
  setActivePage: (page: string) => void;
};

const navItems = [
  "Dashboard",
  "Activity Feed",
  "Tribes",
  "Coordination Hub"
];

function Sidebar({
  activePage,
  setActivePage
}: SidebarProps) {
  return (
    <aside
      style={{
        width: "260px",
        backgroundColor: theme.colors.panel,
        padding: "1rem",
        borderRight: `1px solid ${theme.colors.border}`
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            margin: 0,
            color: theme.colors.textPrimary,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "1rem"
          }}
        >
          Tribal Commons
        </h2>

        <p
          style={{
            marginTop: "0.5rem",
            color: theme.colors.textMuted,
            fontSize: "0.8rem"
          }}
        >
          Federation operations console
        </p>
      </div>

      <nav>
        {navItems.map((item) => {
          const isActive = activePage === item;

          return (
            <button
              key={item}
              onClick={() => setActivePage(item)}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "0.5rem",
                backgroundColor: isActive
                  ? theme.colors.panelSecondary
                  : "transparent",
                color: isActive
                  ? theme.colors.primaryAction
                  : theme.colors.textSecondary,
                border: "none",
                borderLeft: isActive
                  ? `3px solid ${theme.colors.primaryAction}`
                  : `3px solid transparent`,
                cursor: "pointer",
                textAlign: "left",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontSize: "0.78rem"
              }}
            >
              {item}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;