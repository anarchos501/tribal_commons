import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import type {
  CharacterProfile,
  Contribution,
  Petition,
  Project as SharedProject,
  SupportRequest
} from "@tribal-commons/shared-types";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";
import { apiPath } from "../api";
import {
  fieldGridStyle,
  fieldStyle,
  formActionsStyle,
  formHeaderStyle,
  formHintStyle,
  formPanelStyle,
  formTitleStyle,
  textAreaStyle
} from "../styles/forms";

type Project = SharedProject & {
  petitions: Petition[];
  contributions: Contribution[];
  supportRequests?: SupportRequest[];
};

type CoordinationHubPageProps = {
  currentCharacter: CharacterProfile | null;
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

const formatPetitionReadiness = (petition: Petition) => {
  if (!petition.readiness) {
    return null;
  }

  return {
    supportValue: `${petition.readiness.currentSupportCount} / ${petition.readiness.requiredSignatureCount}`,
    thresholdValue: `${petition.readiness.requiredSignaturePercentage}%`,
    statusValue: petition.readiness.thresholdMet
      ? "Ready"
      : `${petition.readiness.readinessPercentage}% ready`
  };
};

function CoordinationHubPage({
  currentCharacter
}: CoordinationHubPageProps) {

  const [projects, setProjects] =
    useState<Project[]>([]);
  const [projectPetitions, setProjectPetitions] =
    useState<Petition[]>([]);

  const [expandedProjects, setExpandedProjects] =
    useState<number[]>([]);
  const [supportProjectId, setSupportProjectId] =
    useState<number | null>(null);
  const [supportForm, setSupportForm] = useState({
    title: "",
    description: "",
    resourceType: "",
    amountRequested: 1,
    supportType: "peer",
    requestedFromType: "individuals"
  });

  const loadProjects = useCallback(() => {
    fetch(apiPath("/projects"))
      .then((response) => response.json())
      .then((data) => setProjects(data));

    const query = currentCharacter
      ? `?type=project&currentCharacterId=${currentCharacter.id}`
      : "?type=project";

    fetch(apiPath(`/petitions${query}`))
      .then((response) => response.json())
      .then((data) => setProjectPetitions(data));
  }, [currentCharacter]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const requestSponsorship = async (
    petitionId: number
  ) => {
    await fetch(
      apiPath(`/petitions/${petitionId}/sponsor-requests`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requesterName:
            currentCharacter?.characterName ??
            "Unscoped Character",
          requesterCharacterId: currentCharacter?.id
        })
      }
    );

    loadProjects();
  };

  const respondToInvite = async (
    sponsorRequestId: number,
    response: "accepted" | "declined"
  ) => {
    await fetch(
      apiPath(
        `/petitions/sponsor-requests/${sponsorRequestId}/respond`
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          responderName:
            currentCharacter?.characterName ??
            "Unscoped Character",
          responderCharacterId: currentCharacter?.id,
          response
        })
      }
    );

    loadProjects();
  };

  const leaveSponsorship = async (
    petitionId: number
  ) => {
    await fetch(
      apiPath(`/petitions/${petitionId}/sponsors/leave`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sponsorName:
            currentCharacter?.characterName ??
            "Unscoped Character",
          sponsorCharacterId: currentCharacter?.id
        })
      }
    );

    loadProjects();
  };

  const updateStatus = (
    projectId: number,
    status: string
  ) => {

    fetch(
      apiPath(`/projects/${projectId}/status`),
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

  const submitProjectSupportRequest = (
    event: FormEvent<HTMLFormElement>,
    project: Project
  ) => {
    event.preventDefault();

    fetch(apiPath("/support/requests"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...supportForm,
        requesterName:
          currentCharacter?.characterName ??
          "Unscoped Character",
        requesterCharacterId: currentCharacter?.id,
        tribeId: project.tribeId,
        projectId: project.id,
        requestedFromType: supportForm.requestedFromType,
        supportType:
          supportForm.requestedFromType ===
          "project_resource_pool"
            ? "commons"
            : "peer",
        amountRequested: Number(
          supportForm.amountRequested
        )
      })
    }).then(() => {
      setSupportProjectId(null);
      setSupportForm({
        title: "",
        description: "",
        resourceType: "",
        amountRequested: 1,
        supportType: "peer",
        requestedFromType: "individuals"
      });
    });
  };

  const supportApproval = async (
    supportRequestId: number
  ) => {
    await fetch(
      apiPath(
        `/support/requests/${supportRequestId}/support`
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          supporterName:
            currentCharacter?.characterName ??
            "Unscoped Character",
          supporterCharacterId: currentCharacter?.id
        })
      }
    );

    loadProjects();
  };

  return (
    <PageLayout
  title="Coordination Hub"
  description="Coordinate projects, logistics, and long-term tribal operations."
>
  <Card>
    <h2 style={{ marginTop: 0 }}>Project Petitions</h2>

    {projectPetitions.length === 0 && (
      <p>No project petitions visible to the selected character.</p>
    )}

    {projectPetitions.map((petition) => {
      const readiness = formatPetitionReadiness(petition);
      const isCurrentSponsor =
        petition.sponsors?.some(
          (sponsor) =>
            sponsor.sponsorCharacterId ===
              currentCharacter?.id ||
            sponsor.sponsorName ===
              currentCharacter?.characterName
        ) ?? false;
      const pendingInvite =
        petition.sponsorRequests?.find(
          (request) =>
            request.requestType === "invite" &&
            request.status === "pending" &&
            (request.recipientCharacterId ===
              currentCharacter?.id ||
              request.recipientName ===
                currentCharacter?.characterName)
        );
      const pendingSponsorRequests =
        petition.sponsorRequests?.filter(
          (request) =>
            request.requestType === "request" &&
            request.status === "pending"
        ) ?? [];

      return (
        <div
          key={petition.id}
          style={{
            padding: "0.75rem 0",
            borderTop: "1px solid rgba(255,255,255,0.04)"
          }}
        >
          <h3 style={{ margin: 0 }}>{petition.title}</h3>

          <MetadataRow
            label="Status"
            value={formatStatus(petition.status)}
            color={theme.colors.primaryActionMuted}
          />

          <MetadataRow
            label="Sponsors"
            value={
              petition.sponsors?.length
                ? petition.sponsors
                    .map((sponsor) => sponsor.sponsorName)
                    .join(", ")
                : "No active sponsors"
            }
            color={theme.colors.textMuted}
          />

          {readiness && (
            <MetadataRow
              label="Readiness"
              value={readiness.statusValue}
              color={theme.colors.textMuted}
            />
          )}

          {pendingSponsorRequests.map((request) => (
            <MetadataRow
              key={request.id}
              label="Sponsor Request"
              value={`${request.requesterName}: ${
                request.readiness
                  ? `${request.readiness.approval.currentSupportCount}/${request.readiness.approval.requiredSignatureCount} approve, ${request.readiness.decline.currentSupportCount}/${request.readiness.decline.requiredSignatureCount} decline`
                  : "pending"
              }`}
              color={theme.colors.textMuted}
            />
          ))}

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.5rem"
            }}
          >
            {petition.status === "open" && !isCurrentSponsor && (
              <Button
                onClick={() =>
                  requestSponsorship(petition.id)
                }
              >
                Request Sponsorship
              </Button>
            )}

            {pendingInvite && (
              <>
                <Button
                  onClick={() =>
                    respondToInvite(
                      pendingInvite.id,
                      "accepted"
                    )
                  }
                >
                  Accept Invite
                </Button>

                <Button
                  onClick={() =>
                    respondToInvite(
                      pendingInvite.id,
                      "declined"
                    )
                  }
                >
                  Decline Invite
                </Button>
              </>
            )}

            {isCurrentSponsor &&
              ["draft", "open"].includes(petition.status) && (
                <Button
                  onClick={() =>
                    leaveSponsorship(petition.id)
                  }
                >
                  Leave Sponsorship
                </Button>
              )}
          </div>
        </div>
      );
    })}
  </Card>

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

          <Button
            onClick={() =>
              setSupportProjectId(
                supportProjectId === project.id
                  ? null
                  : project.id
              )
            }
          >
            Request Support
          </Button>

        </div>

        {supportProjectId === project.id && (
          <form
            onSubmit={(event) =>
              submitProjectSupportRequest(
                event,
                project
              )
            }
            style={formPanelStyle}
          >
            <div style={formHeaderStyle}>
              <div>
                <h3 style={formTitleStyle}>
                  Project Support Request
                </h3>
                <p style={formHintStyle}>
                  Link a resource or logistics need directly to this project.
                </p>
              </div>

              <Button onClick={() => setSupportProjectId(null)}>
                Close
              </Button>
            </div>

            <input
              style={fieldStyle}
              value={supportForm.title}
              onChange={(event) =>
                setSupportForm({
                  ...supportForm,
                  title: event.target.value
                })
              }
              placeholder="Support request title"
              required
            />

            <textarea
              style={textAreaStyle}
              value={supportForm.description}
              onChange={(event) =>
                setSupportForm({
                  ...supportForm,
                  description: event.target.value
                })
              }
              placeholder="Describe the project support need"
              required
            />

            <div style={fieldGridStyle}>
              <input
                style={fieldStyle}
                value={supportForm.resourceType}
                onChange={(event) =>
                  setSupportForm({
                    ...supportForm,
                    resourceType: event.target.value
                  })
                }
                placeholder="Resource type"
                required
              />

              <input
                style={fieldStyle}
                type="number"
                min={1}
                value={supportForm.amountRequested}
                onChange={(event) =>
                  setSupportForm({
                    ...supportForm,
                    amountRequested: Number(
                      event.target.value
                    )
                  })
                }
                required
              />

              <select
                style={fieldStyle}
                value={supportForm.requestedFromType}
                onChange={(event) =>
                  setSupportForm({
                    ...supportForm,
                    requestedFromType: event.target.value
                  })
                }
              >
                <option value="individuals">
                  Individuals
                </option>
                <option value="project_resource_pool">
                  Project Resource Pool
                </option>
              </select>
            </div>

            <div style={formActionsStyle}>
              <Button type="submit" variant="primary">
                Submit Project Support Request
              </Button>
            </div>
          </form>
        )}

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
              Project Petitions
            </h3>

            {project.petitions.length === 0 && (
              <p>
                No project petitions yet.
              </p>
            )}

            {project.petitions.map(
              (petition) => {
                const readiness =
                  formatPetitionReadiness(petition);

                return (
                <div
                  key={petition.id}
                  style={{
                    padding: "0.4rem 0",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.03)"
                  }}
                >
                  <strong>{petition.title}</strong>

                  <MetadataRow
                    label="Signatures"
                    value={
                      readiness?.supportValue ??
                      String(petition.supports?.length ?? 0)
                    }
                    color={theme.colors.textMuted}
                  />

                  {readiness && (
                    <>
                      <MetadataRow
                        label="Threshold"
                        value={readiness.thresholdValue}
                        color={theme.colors.textMuted}
                      />

                      <MetadataRow
                        label="Readiness"
                        value={readiness.statusValue}
                        color={
                          petition.readiness?.thresholdMet
                            ? theme.colors.primaryActionMuted
                            : theme.colors.textMuted
                        }
                      />
                    </>
                  )}
                </div>
                );
              }
            )}

            <h3
              style={{
                marginTop: "1.5rem",
                marginBottom: "0.75rem"
              }}
            >
              Support Requests
            </h3>

            {(project.supportRequests ?? []).length === 0 && (
              <p>No project support requests yet.</p>
            )}

            {(project.supportRequests ?? []).map((support) => (
              <div
                key={support.id}
                style={{
                  padding: "0.4rem 0",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.03)"
                }}
              >
                <strong>{support.title}</strong>

                <MetadataRow
                  label="Requested From"
                  value={
                    support.requestedFromType ===
                    "project_resource_pool"
                      ? "Project Resource Pool"
                      : "Individuals"
                  }
                  color={theme.colors.textMuted}
                />

                {support.fulfillment && (
                  <MetadataRow
                    label="Fulfillment"
                    value={`${support.fulfillment.contributedAmount} / ${support.fulfillment.amountRequested} ${support.resourceType}`}
                    color={theme.colors.textMuted}
                  />
                )}

                {support.approvalRequired &&
                  support.readiness && (
                  <>
                    <MetadataRow
                      label="Approval"
                      value={`${support.readiness.currentSupportCount} / ${support.readiness.requiredSignatureCount}`}
                      color={
                        theme.colors.primaryActionMuted
                      }
                    />

                    <MetadataRow
                      label="Readiness"
                      value={
                        support.readiness.thresholdMet
                          ? "Ready"
                          : `${support.readiness.readinessPercentage}% ready`
                      }
                      color={theme.colors.textMuted}
                    />

                    <Button
                      onClick={() =>
                        supportApproval(support.id)
                      }
                    >
                      Support Approval
                    </Button>
                  </>
                )}
              </div>
            ))}

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
