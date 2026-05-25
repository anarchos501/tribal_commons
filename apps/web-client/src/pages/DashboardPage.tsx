import { useEffect, useState } from "react";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";

function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/dashboard/Anarchos")
      .then((response) => response.json())
      .then((data) => setDashboard(data));
  }, []);

  if (!dashboard) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <PageLayout
      title="Dashboard"
      description="Personal overview, memberships, active projects, and open support needs."
    >
      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, marginBottom: "0.35rem" }}>
            Memberships
          </h2>

          <div
            style={{
              fontSize: "0.78rem",
              color: theme.colors.textMuted,
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
          >
            Tribal affiliations
          </div>
        </div>

        {dashboard.memberships.map((membership: any) => (
          <div
            key={membership.tribeId}
            style={{
              padding: "0.75rem 0",
              borderTop: "1px solid rgba(255,255,255,0.04)"
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>
              {membership.tribeName}
            </h3>

            <MetadataRow
              label="Affiliation"
              value="Member"
              color={theme.colors.primaryActionMuted}
            />
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, marginBottom: "0.35rem" }}>
            Projects
          </h2>

          <div
            style={{
              fontSize: "0.78rem",
              color: theme.colors.textMuted,
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
          >
            Current operational commitments
          </div>
        </div>

        {dashboard.myProjects.map((project: any) => (
          <div
            key={project.id}
            style={{
              padding: "0.75rem 0",
              borderTop: "1px solid rgba(255,255,255,0.04)"
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>
              {project.title}
            </h3>

            <MetadataRow
              label="Status"
              value={project.status}
              color={theme.colors.primaryActionMuted}
            />
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, marginBottom: "0.35rem" }}>
            Aid Requests
          </h2>

          <div
            style={{
              fontSize: "0.78rem",
              color: theme.colors.textMuted,
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
          >
            Open support and recovery needs
          </div>
        </div>

        {dashboard.openAidRequests.map((aid: any) => (
          <div
            key={aid.id}
            style={{
              padding: "0.75rem 0",
              borderTop: "1px solid rgba(255,255,255,0.04)"
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>
              {aid.title}
            </h3>

            <MetadataRow
              label="Status"
              value={aid.status}
              color={theme.colors.primaryActionMuted}
            />
          </div>
        ))}
      </Card>
    </PageLayout>
  );
}

export default DashboardPage;