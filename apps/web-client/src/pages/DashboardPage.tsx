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
    description="Personal overview and coordination access."
  >

      <Card>
        <h2>Memberships</h2>
        <ul>
          {dashboard.memberships.map((membership: any) => (
            <li key={membership.tribeId}>
  {membership.tribeName}

  <MetadataRow
    label="Affiliation"
    value="Member"
    color={theme.colors.primaryActionMuted}
  />
</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2>Projects</h2>
        <ul>
          {dashboard.myProjects.map((project: any) => (
<li key={project.id}>
  {project.title}

  <MetadataRow
    label="Status"
    value={project.status}
    color={theme.colors.primaryActionMuted}
  />
</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2>Aid Requests</h2>
        <ul>
          {dashboard.openAidRequests.map((aid: any) => (
<li key={aid.id}>
  {aid.title}

  <MetadataRow
    label="Status"
    value={aid.status}
    color={theme.colors.primaryActionMuted}
  />
</li>
          ))}
        </ul>
      </Card>
    </PageLayout>
  );
}

export default DashboardPage;