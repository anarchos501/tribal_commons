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

type Contribution = {
  id: number;
  contributorName: string;
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
  contributions: Contribution[];
};

const statuses = [
  "proposal",
  "staging",
  "sustained",
  "completed",
  "failed",
  "archived"
];

const formatStatus = (status: string) => {
  if (status === "active") {
    return "Staging";
  }

  return status
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

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

    const statusColors: Record<string, string> = {
      proposal: "#888888",
      staging: "#d4a63a",
      sustained: "#4fa36d",
      completed: "#2f7f91",
      failed: "#b04a4a",
      archived: "#666666"
    };

    return (
      <Card key={project.id}>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
            gap: "1rem"
          }}
        >

          <div>

            <h2
              style={{
                margin: 0,
                marginBottom: "0.35rem"
              }}
            >
              {project.title}
            </h2>

            <div
              style={{
                fontSize: "0.78rem",
                color: theme.colors.textMuted,
                letterSpacing: "0.04em",
                textTransform: "uppercase"
              }}
            >
              Operational Project
            </div>

          </div>

          <div
            style={{
              padding: "0.3rem 0.7rem",
              borderRadius: "999px",
              backgroundColor:
                "rgba(255,255,255,0.04)",
              border: `1px solid ${
                statusColors[project.status]
              }`,
              color:
                statusColors[project.status],
              fontSize: "0.74rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 600
            }}
          >
            {formatStatus(project.status)}
          </div>

        </div>

        <div
          style={{
            marginBottom: "1rem"
          }}
        >

          <MetadataRow
            label="Petitions"
            value={String(
              project.petitions.length
            )}
            color={
              theme.colors.primaryActionMuted
            }
          />

          <MetadataRow
            label="Contributions"
            value={String(
              project.contributions.length
            )}
            color={
              theme.colors.primaryActionMuted
            }
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

        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
            paddingTop: "0.5rem",
            borderTop:
              "1px solid rgba(255,255,255,0.04)"
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
                {formatStatus(status)}
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
            Open Discussion
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
                "1px solid rgba(255,255,255,0.06)"
            }}
          >

            <h3
              style={{
                marginBottom: "0.75rem"
              }}
            >
              Petition Support
            </h3>

            {project.petitions.length === 0 && (
              <p>
                No petition support yet.
              </p>
            )}

            {project.petitions.map(
              (petition) => (
                <div
                  key={petition.id}
                  style={{
                    padding: "0.4rem 0",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.03)"
                  }}
                >
                  {petition.signer}
                </div>
              )
            )}

            <h3
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.75rem"
              }}
            >
              Contributions
            </h3>

            {project.contributions.length === 0 && (
              <p>
                No contributions yet.
              </p>
            )}

            {project.contributions.map(
              (contribution) => (
                <div
                  key={contribution.id}
                  style={{
                    padding: "0.4rem 0",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.03)"
                  }}
                >
                  <strong>
                    {contribution.contributorName}
                  </strong>

                  {" — "}

                  {contribution.amount}
                  {" "}
                  {contribution.resourceType}
                </div>
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