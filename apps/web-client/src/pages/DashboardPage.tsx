import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import type {
  CharacterProfile,
  CommonsPool,
  Membership,
  Project,
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
  const [commonsPools, setCommonsPools] = useState<
    CommonsPool[]
  >([]);
  const [supportFormOpen, setSupportFormOpen] =
    useState(false);
  const [supportForm, setSupportForm] = useState({
    title: "",
    description: "",
    resourceType: "",
    amountRequested: 1,
    supportType: "peer",
    tribeId: "",
    requestedFromType: "individuals",
    commonsPoolId: ""
  });

  const loadDashboard = useCallback(() => {
    const query = currentCharacter
      ? `?characterProfileId=${currentCharacter.id}`
      : "";

    fetch(apiPath(`/dashboard${query}`))
      .then((response) => response.json())
      .then((data) => setDashboard(data));
  }, [currentCharacter]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    fetch(apiPath("/commons"))
      .then((response) => response.json())
      .then((data) => setCommonsPools(data));
  }, []);

  const submitSupportRequest = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    fetch(apiPath("/support/requests"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...supportForm,
        tribeId: supportForm.tribeId
          ? Number(supportForm.tribeId)
          : null,
        commonsPoolId: supportForm.commonsPoolId
          ? Number(supportForm.commonsPoolId)
          : null,
        requestedFromType: supportForm.requestedFromType,
        supportType:
          supportForm.requestedFromType === "individuals"
            ? "peer"
            : "commons",
        requesterName:
          currentCharacter?.characterName ??
          dashboard?.character ??
          "Unscoped Character",
        requesterCharacterId: currentCharacter?.id,
        amountRequested: Number(
          supportForm.amountRequested
        )
      })
    }).then(() => {
      setSupportForm({
        title: "",
        description: "",
        resourceType: "",
        amountRequested: 1,
        supportType: "peer",
        tribeId: "",
        requestedFromType: "individuals",
        commonsPoolId: ""
      });
      setSupportFormOpen(false);
      loadDashboard();
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
            dashboard?.character ??
            "Unscoped Character",
          supporterCharacterId: currentCharacter?.id
        })
      }
    );

    loadDashboard();
  };

  const formatSource = (support: SupportRequest) => {
    if (support.requestedFromType === "individuals") {
      return "Individuals";
    }

    if (
      support.requestedFromType ===
      "tribal_commons_pool"
    ) {
      return "Tribal Commons Pool";
    }

    return "Project Resource Pool";
  };

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem"
            }}
          >
            <h2 style={{ margin: 0, marginBottom: "0.35rem" }}>
              Support Requests
            </h2>

            <Button
              onClick={() =>
                setSupportFormOpen((open) => !open)
              }
            >
              {supportFormOpen ? "Close" : "New Request"}
            </Button>
          </div>

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

        {supportFormOpen && (
          <form
            onSubmit={submitSupportRequest}
            style={formPanelStyle}
          >
            <div style={formHeaderStyle}>
              <div>
                <h3 style={formTitleStyle}>
                  New Support Request
                </h3>
                <p style={formHintStyle}>
                  Record a resource or logistics need for the selected character.
                </p>
              </div>

              <Button onClick={() => setSupportFormOpen(false)}>
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
              placeholder="Request title"
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
              placeholder="Describe the need"
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
                    requestedFromType: event.target.value,
                    commonsPoolId: ""
                  })
                }
              >
                <option value="individuals">
                  Individuals
                </option>
                <option value="tribal_commons_pool">
                  Tribal Commons Pool
                </option>
              </select>

              <select
                style={fieldStyle}
                value={supportForm.tribeId}
                onChange={(event) =>
                  setSupportForm({
                    ...supportForm,
                    tribeId: event.target.value
                  })
                }
                required={
                  supportForm.requestedFromType ===
                  "tribal_commons_pool"
                }
              >
                <option value="">No tribe context</option>

                {dashboard.memberships.map((membership) => (
                  <option
                    key={membership.id}
                    value={membership.tribeId}
                  >
                    {membership.tribe.name}
                  </option>
                ))}
              </select>

              {supportForm.requestedFromType ===
                "tribal_commons_pool" && (
                <select
                  style={fieldStyle}
                  value={supportForm.commonsPoolId}
                  onChange={(event) =>
                    setSupportForm({
                      ...supportForm,
                      commonsPoolId: event.target.value
                    })
                  }
                  required
                >
                  <option value="">
                    Select commons pool
                  </option>

                  {commonsPools
                    .filter(
                      (pool) =>
                        !supportForm.tribeId ||
                        pool.tribeId ===
                          Number(supportForm.tribeId)
                    )
                    .map((pool) => (
                      <option
                        key={pool.id}
                        value={pool.id}
                      >
                        {pool.name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div style={formActionsStyle}>
              <Button type="submit" variant="primary">
                Submit Request
              </Button>
            </div>
          </form>
        )}

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

            <MetadataRow
              label="Requested From"
              value={formatSource(support)}
              color={theme.colors.textMuted}
            />

            {support.fulfillment && (
              <>
                <MetadataRow
                  label="Contributed"
                  value={`${support.fulfillment.contributedAmount} / ${support.fulfillment.amountRequested} ${support.resourceType}`}
                  color={theme.colors.textMuted}
                />

                <MetadataRow
                  label="Remaining"
                  value={`${support.fulfillment.remainingAmount} ${support.resourceType}`}
                  color={theme.colors.textMuted}
                />
              </>
            )}

            {support.approvalRequired && support.readiness && (
              <>
                <MetadataRow
                  label="Approval"
                  value={`${support.readiness.currentSupportCount} / ${support.readiness.requiredSignatureCount}`}
                  color={theme.colors.primaryActionMuted}
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
      </Card>
    </PageLayout>
  );
}

export default DashboardPage;
