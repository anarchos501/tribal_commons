import { useEffect, useState } from "react";
import type {
  CharacterProfile,
  Membership,
  Project,
  SupportRequest
} from "@tribal-commons/shared-types";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";
import { apiPath } from "../api";

type DashboardMembership = Membership & {
  tribe: {
    id: number;
    name: string;
  };
};

type DashboardData = {
  character: string | null;
  characterProfile: CharacterProfile | null;
  memberships: DashboardMembership[];
  myProjects: Project[];
  openSupportRequests: SupportRequest[];
};

type DashboardPageProps = {
  currentCharacter: CharacterProfile | null;
};

const formatStatus = (status: string) =>
  status
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

function DashboardPage({
  currentCharacter
}: DashboardPageProps) {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  useEffect(() => {
    const query = currentCharacter
      ? `?characterProfileId=${currentCharacter.id}`
      : "";

    fetch(apiPath(`/dashboard${query}`))
      .then((response) => response.json())
      .then((data) => setDashboard(data));
  }, [currentCharacter]);

  if (!dashboard) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <PageLayout
      title="Dashboard"
      description="Personal overview, memberships, active projects, and support needs."
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

        {dashboard.memberships.map((membership) => (
          <div
            key={membership.id}
            style={{
              padding: "0.75rem 0",
              borderTop: "1px solid rgba(255,255,255,0.04)"
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>
              {membership.tribe.name}
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

        {dashboard.myProjects.map((project) => (
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
              value={formatStatus(project.status)}
              color={theme.colors.primaryActionMuted}
            />
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, marginBottom: "0.35rem" }}>
            Support Requests
          </h2>

          <div
            style={{
              fontSize: "0.78rem",
              color: theme.colors.textMuted,
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
          >
            Open support needs
          </div>
        </div>

        {dashboard.openSupportRequests.map((support) => (
          <div
            key={support.id}
            style={{
              padding: "0.75rem 0",
              borderTop: "1px solid rgba(255,255,255,0.04)"
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "0.5rem" }}>
              {support.title}
            </h3>

            <MetadataRow
              label="Status"
              value={formatStatus(support.status)}
              color={theme.colors.primaryActionMuted}
            />
          </div>
        ))}
      </Card>
    </PageLayout>
  );
}

export default DashboardPage;
