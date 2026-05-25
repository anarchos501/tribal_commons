import { useEffect, useState } from "react";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";

type Petition = {
  id: number;
  signer: string;
};

type Donation = {
  id: number;
  donorName: string;
  resourceType: string;
  amount: number;
};

type Project = {
  id: number;
  title: string;
  status: string;
  tribeId: number;

  createdAt: string;

  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  archivedAt?: string;

  petitions: Petition[];
  donations: Donation[];
};

const statuses = [
  "proposal",
  "active",
  "sustained",
  "completed",
  "failed",
  "archived"
];

function CoordinationHubPage() {

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [expandedProjects, setExpandedProjects] =
    useState<number[]>([]);

  const loadProjects = () => {
    fetch("http://localhost:3000/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const updateStatus = (
    projectId: number,
    status: string
  ) => {

    fetch(
      `http://localhost:3000/projects/${projectId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status
        })
      }
    ).then(() => loadProjects());
  };

  const toggleExpanded = (
    projectId: number
  ) => {

    setExpandedProjects((current) => {

      if (current.includes(projectId)) {
        return current.filter(
          (id) => id !== projectId
        );
      }

      return [...current, projectId];
    });
  };

  return (
    <PageLayout
      title="Coordination Hub"
      description="Coordinate projects, logistics, and long-term tribal operations."
    >

      {projects.map((project) => {

        const expanded =
          expandedProjects.includes(project.id);

        return (
          <Card key={project.id}>

            <h2>{project.title}</h2>

            <MetadataRow
              label="Status"
              value={project.status}
              color={theme.colors.primaryActionMuted}
            />

            <MetadataRow
              label="Petitions"
              value={String(project.petitions.length)}
              color={theme.colors.primaryActionMuted}
            />

            <MetadataRow
              label="Donations"
              value={String(project.donations.length)}
              color={theme.colors.primaryActionMuted}
            />

            <MetadataRow
              label="Tribe ID"
              value={String(project.tribeId)}
              color={theme.colors.textMuted}
            />

            <MetadataRow
              label="Created"
              value={new Date(
                project.createdAt
              ).toLocaleString()}
              color={theme.colors.textMuted}
            />

            {project.startedAt && (
              <MetadataRow
                label="Started"
                value={new Date(
                  project.startedAt
                ).toLocaleString()}
                color={theme.colors.textMuted}
              />
            )}

            {project.completedAt && (
              <MetadataRow
                label="Completed"
                value={new Date(
                  project.completedAt
                ).toLocaleString()}
                color={theme.colors.textMuted}
              />
            )}

            {project.failedAt && (
              <MetadataRow
                label="Failed"
                value={new Date(
                  project.failedAt
                ).toLocaleString()}
                color={theme.colors.textMuted}
              />
            )}

            {project.archivedAt && (
              <MetadataRow
                label="Archived"
                value={new Date(
                  project.archivedAt
                ).toLocaleString()}
                color={theme.colors.textMuted}
              />
            )}

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap"
              }}
            >

              <select
                value={project.status}
                onChange={(event) =>
                  updateStatus(
                    project.id,
                    event.target.value
                  )
                }
              >

                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}

              </select>

              <Button
                onClick={() =>
                  toggleExpanded(project.id)
                }
              >
                {expanded
                  ? "Hide Details"
                  : "Open"}
              </Button>

              <Button>
                Discuss
              </Button>

              <Button variant="primary">
                Contribute
              </Button>

            </div>

            {expanded && (

              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop:
                    "1px solid rgba(255,255,255,0.1)"
                }}
              >

                <h3>Petitions</h3>

                {project.petitions.length === 0 && (
                  <p>
                    No petition support yet.
                  </p>
                )}

                {project.petitions.map(
                  (petition) => (
                    <p key={petition.id}>
                      {petition.signer}
                    </p>
                  )
                )}

                <h3
                  style={{
                    marginTop: "1rem"
                  }}
                >
                  Donations
                </h3>

                {project.donations.length === 0 && (
                  <p>
                    No donations yet.
                  </p>
                )}

                {project.donations.map(
                  (donation) => (
                    <p key={donation.id}>
                      {donation.donorName}
                      {" — "}
                      {donation.amount}
                      {" "}
                      {donation.resourceType}
                    </p>
                  )
                )}

              </div>
            )}

          </Card>
        );
      })}

    </PageLayout>
  );
}

export default CoordinationHubPage;