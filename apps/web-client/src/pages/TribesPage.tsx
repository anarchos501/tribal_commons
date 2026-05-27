import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type {
  CharacterProfile,
  GovernanceTemperature,
  GovernanceTopic,
  Petition,
  Tribe
} from "@tribal-commons/shared-types";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";
import { apiPath } from "../api";
import {
  fieldStyle,
  formActionsStyle,
  formHeaderStyle,
  formHintStyle,
  formPanelStyle,
  formTitleStyle,
  textAreaStyle
} from "../styles/forms";

type FederationRelationship = {
  id: number;
  sourceTribeId: number;
  targetTribeId: number;
  relationshipType: string;
  note?: string;
  createdAt: string;
};

type TribesPageProps = {
  currentCharacter: CharacterProfile | null;
};

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

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

function TribesPage({
  currentCharacter
}: TribesPageProps) {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [expandedTribeId, setExpandedTribeId] = useState<number | null>(null);
  const [topicsByTribe, setTopicsByTribe] = useState<Record<number, GovernanceTopic[]>>({});
  const [temperaturesByTopic, setTemperaturesByTopic] = useState<Record<number, GovernanceTemperature>>({});
  const [federationByTribe, setFederationByTribe] = useState<Record<number, FederationRelationship[]>>({});
  const [petitionsByTribe, setPetitionsByTribe] = useState<Record<number, Petition[]>>({});
  const [activePetitionForm, setActivePetitionForm] =
    useState<{
      tribeId: number;
      type: "project" | "federation";
    } | null>(null);
  const [petitionForm, setPetitionForm] = useState({
    title: "",
    description: "",
    targetTribeId: "",
    publishDuration: "3d"
  });
  const [activeSponsorInviteId, setActiveSponsorInviteId] =
    useState<number | null>(null);
  const [sponsorInviteName, setSponsorInviteName] =
    useState("");

  useEffect(() => {
    fetch(apiPath("/tribes"))
      .then((response) => response.json())
      .then((data) => setTribes(data));
  }, []);

  const loadTribeDetails = async (tribeId: number) => {
    const topicsResponse = await fetch(apiPath(`/policies/${tribeId}`));
    const topics = await topicsResponse.json();

    const federationResponse = await fetch(apiPath(`/federation/${tribeId}`));
    const federation = await federationResponse.json();

    const petitionQuery = currentCharacter
      ? `/petitions?tribeId=${tribeId}&currentCharacterId=${currentCharacter.id}`
      : `/petitions?tribeId=${tribeId}`;

    const petitionsResponse = await fetch(
      apiPath(petitionQuery)
    );
    const petitions = await petitionsResponse.json();

    const temperatures: Record<number, GovernanceTemperature> = {};

    for (const topic of topics) {
      const temperatureResponse = await fetch(
        apiPath(`/policies/topics/${topic.id}/temperature`)
      );

      temperatures[topic.id] = await temperatureResponse.json();
    }

    setTopicsByTribe((current) => ({
      ...current,
      [tribeId]: topics
    }));

    setFederationByTribe((current) => ({
      ...current,
      [tribeId]: federation
    }));

    setPetitionsByTribe((current) => ({
      ...current,
      [tribeId]: petitions
    }));

    setTemperaturesByTopic((current) => ({
      ...current,
      ...temperatures
    }));
  };

  const toggleTribe = async (tribeId: number) => {
    if (expandedTribeId === tribeId) {
      setExpandedTribeId(null);
      return;
    }

    setExpandedTribeId(tribeId);
    await loadTribeDetails(tribeId);
  };

  const openPetitionForm = (
    tribeId: number,
    type: "project" | "federation"
  ) => {
    if (
      activePetitionForm?.tribeId === tribeId &&
      activePetitionForm.type === type
    ) {
      setActivePetitionForm(null);
      return;
    }

    setActivePetitionForm({ tribeId, type });
    setPetitionForm({
      title: "",
      description: "",
      targetTribeId: "",
      publishDuration: "3d"
    });
  };

  const submitPetition = (
    event: FormEvent<HTMLFormElement>,
    tribeId: number,
    type: "project" | "federation"
  ) => {
    event.preventDefault();

    fetch(apiPath("/petitions"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        title: petitionForm.title,
        description: petitionForm.description,
        tribeId,
        targetTribeId:
          type === "federation" &&
          petitionForm.targetTribeId
            ? Number(petitionForm.targetTribeId)
            : null,
        proposerName:
          currentCharacter?.characterName ??
          "Unscoped Character",
        proposerCharacterId: currentCharacter?.id,
        publishDuration:
          type === "project"
            ? petitionForm.publishDuration
            : undefined,
        metadata:
          type === "federation"
            ? {
                targetTribeId:
                  petitionForm.targetTribeId
              }
            : undefined
      })
    }).then(async () => {
      setActivePetitionForm(null);
      setPetitionForm({
        title: "",
        description: "",
        targetTribeId: "",
        publishDuration: "3d"
      });
      await loadTribeDetails(tribeId);
    });
  };

  const supportPetition = async (
    tribeId: number,
    petitionId: number
  ) => {
    await fetch(apiPath(`/petitions/${petitionId}/support`), {
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
    });

    await loadTribeDetails(tribeId);
  };

  const inviteSponsor = async (
    tribeId: number,
    petitionId: number
  ) => {
    await fetch(
      apiPath(`/petitions/${petitionId}/sponsor-invites`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inviterName:
            currentCharacter?.characterName ??
            "Unscoped Character",
          inviterCharacterId: currentCharacter?.id,
          recipientName: sponsorInviteName
        })
      }
    );

    setActiveSponsorInviteId(null);
    setSponsorInviteName("");
    await loadTribeDetails(tribeId);
  };

  const respondToInvite = async (
    tribeId: number,
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

    await loadTribeDetails(tribeId);
  };

  const requestSponsorship = async (
    tribeId: number,
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

    await loadTribeDetails(tribeId);
  };

  const setSponsorRequestPreference = async (
    tribeId: number,
    sponsorRequestId: number,
    value: 1 | -1
  ) => {
    await fetch(
      apiPath(
        `/petitions/sponsor-requests/${sponsorRequestId}/preference`
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          voterName:
            currentCharacter?.characterName ??
            "Unscoped Character",
          voterCharacterId: currentCharacter?.id,
          value
        })
      }
    );

    await loadTribeDetails(tribeId);
  };

  const leaveSponsorship = async (
    tribeId: number,
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

    await loadTribeDetails(tribeId);
  };

  return (
    <PageLayout
      title="Tribes"
      description="Memberships, governance context, federation, and institutional identity."
    >
      {tribes.map((tribe) => {
        const expanded = expandedTribeId === tribe.id;
        const topics = topicsByTribe[tribe.id] || [];
        const federation = federationByTribe[tribe.id] || [];
        const petitions = petitionsByTribe[tribe.id] || [];

        return (
          <Card key={tribe.id}>
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
                  {tribe.name}
                </h2>

                <div
                  style={{
                    fontSize: "0.78rem",
                    color: theme.colors.textMuted,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase"
                  }}
                >
                  Tribal Institution
                </div>
              </div>

              <div
                style={{
                  padding: "0.3rem 0.7rem",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${theme.colors.primaryActionMuted}`,
                  color: theme.colors.primaryActionMuted,
                  fontSize: "0.74rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600
                }}
              >
                {tribe.role || "Member"}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <MetadataRow
                label="Locality"
                value={tribe.locality}
                color={theme.colors.textMuted}
              />

              <MetadataRow
                label="Tribe ID"
                value={String(tribe.id)}
                color={theme.colors.textMuted}
              />

              {tribe.createdAt && (
                <MetadataRow
                  label="Created"
                  value={new Date(tribe.createdAt).toLocaleString()}
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
                borderTop: "1px solid rgba(255,255,255,0.04)"
              }}
            >
              <Button onClick={() => toggleTribe(tribe.id)}>
                {expanded ? "Hide Tribe" : "View Tribe"}
              </Button>

              <Button
                onClick={() =>
                  openPetitionForm(tribe.id, "project")
                }
              >
                Propose Project
              </Button>

              <Button
                onClick={() =>
                  openPetitionForm(tribe.id, "federation")
                }
              >
                Propose Federation
              </Button>

              <Button>Logs / Audits</Button>
              <Button>Standings</Button>
            </div>

            {activePetitionForm?.tribeId === tribe.id && (
              <form
                onSubmit={(event) =>
                  submitPetition(
                    event,
                    tribe.id,
                    activePetitionForm.type
                  )
                }
                style={formPanelStyle}
              >
                <div style={formHeaderStyle}>
                  <div>
                    <h3 style={formTitleStyle}>
                      {activePetitionForm.type === "project"
                        ? "Project Petition"
                        : "Federation Petition"}
                    </h3>
                    <p style={formHintStyle}>
                      {activePetitionForm.type === "project"
                        ? "Create a private draft, invite initial sponsors, and publish it automatically after the draft window."
                        : "Open a typed petition for members to support before it becomes operational work."}
                    </p>
                  </div>

                  <Button
                    onClick={() => setActivePetitionForm(null)}
                  >
                    Close
                  </Button>
                </div>

                <input
                  style={fieldStyle}
                  value={petitionForm.title}
                  onChange={(event) =>
                    setPetitionForm({
                      ...petitionForm,
                      title: event.target.value
                    })
                  }
                  placeholder={
                    activePetitionForm.type === "project"
                      ? "Project petition title"
                      : "Federation petition title"
                  }
                  required
                />

                <textarea
                  style={textAreaStyle}
                  value={petitionForm.description}
                  onChange={(event) =>
                    setPetitionForm({
                      ...petitionForm,
                      description: event.target.value
                    })
                  }
                  placeholder="Describe the proposal"
                  required
                />

                {activePetitionForm.type ===
                  "federation" && (
                  <select
                    style={fieldStyle}
                    value={petitionForm.targetTribeId}
                    onChange={(event) =>
                      setPetitionForm({
                        ...petitionForm,
                        targetTribeId: event.target.value
                      })
                    }
                    required
                  >
                    <option value="">
                      Select target tribe
                    </option>

                    {tribes
                      .filter(
                        (targetTribe) =>
                          targetTribe.id !== tribe.id
                      )
                      .map((targetTribe) => (
                        <option
                          key={targetTribe.id}
                          value={targetTribe.id}
                        >
                          {targetTribe.name}
                        </option>
                      ))}
                  </select>
                )}

                {activePetitionForm.type === "project" && (
                  <select
                    style={fieldStyle}
                    value={petitionForm.publishDuration}
                    onChange={(event) =>
                      setPetitionForm({
                        ...petitionForm,
                        publishDuration:
                          event.target.value
                      })
                    }
                  >
                    <option value="24h">Publish in 24 hours</option>
                    <option value="3d">Publish in 3 days</option>
                    <option value="7d">Publish in 7 days</option>
                  </select>
                )}

                <div style={formActionsStyle}>
                  <Button type="submit" variant="primary">
                    {activePetitionForm.type === "project"
                      ? "Create Draft"
                      : "Open Petition"}
                  </Button>
                </div>
              </form>
            )}

            {expanded && (
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)"
                }}
              >
                <h3 style={{ marginBottom: "0.75rem" }}>
                  Governance Temperatures
                </h3>

                {topics.length === 0 && (
                  <p>No governance topics configured yet.</p>
                )}

                {topics.map((topic) => {
                  const temperature = temperaturesByTopic[topic.id];

                  return (
                    <div
                      key={topic.id}
                      style={{
                        padding: "0.75rem 0",
                        borderBottom: "1px solid rgba(255,255,255,0.03)"
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          marginBottom: "0.4rem"
                        }}
                      >
                        {topic.title}
                      </h4>

                      <p
                        style={{
                          marginTop: 0,
                          color: theme.colors.textSecondary
                        }}
                      >
                        {topic.description}
                      </p>

                      <MetadataRow
                        label="Temperature"
                        value={
                          temperature
                            ? `${temperature.temperatureScore} - ${temperature.temperatureLabel}`
                            : "50 - Neutral"
                        }
                        color={theme.colors.primaryActionMuted}
                      />

                      <MetadataRow
                        label="Required Signatures"
                        value={`${
                          temperature?.requiredSignaturePercentage ?? 50
                        }%`}
                        color={theme.colors.primaryActionMuted}
                      />

                      <MetadataRow
                        label="Preferences"
                        value={String(temperature?.preferenceCount || 0)}
                        color={theme.colors.textMuted}
                      />

                      <MetadataRow
                        label="Preference Range"
                        value={`${topic.minLabel} ↔ ${topic.maxLabel}`}
                        color={theme.colors.textMuted}
                      />
                    </div>
                  );
                })}

                <h3
                  style={{
                    marginTop: "1.5rem",
                    marginBottom: "0.75rem"
                  }}
                >
                  Federation
                </h3>

                {federation.length === 0 && (
                  <p>No federation relationships recorded yet.</p>
                )}

                {federation.map((relationship) => (
                  <div
                    key={relationship.id}
                    style={{
                      padding: "0.75rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.03)"
                    }}
                  >
                    <MetadataRow
                      label="Target Tribe"
                      value={String(relationship.targetTribeId)}
                      color={theme.colors.textMuted}
                    />

                    <MetadataRow
                      label="Relationship"
                      value={formatStatus(
  relationship.relationshipType
)}
                      color={theme.colors.primaryActionMuted}
                    />

                    {relationship.note && (
                      <p
                        style={{
                          marginBottom: 0,
                          color: theme.colors.textSecondary
                        }}
                      >
                        {relationship.note}
                      </p>
                    )}
                  </div>
                ))}

                <h3
                  style={{
                    marginTop: "1.5rem",
                    marginBottom: "0.75rem"
                  }}
                >
                  Petitions
                </h3>

                {petitions.length === 0 && (
                  <p>No petitions visible to the selected character yet.</p>
                )}

                {petitions.map((petition) => {
                  const readiness =
                    formatPetitionReadiness(petition);
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
                        borderBottom:
                          "1px solid rgba(255,255,255,0.03)"
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          marginBottom: "0.4rem"
                        }}
                      >
                        {petition.title}
                      </h4>

                      <p
                        style={{
                          marginTop: 0,
                          color: theme.colors.textSecondary
                        }}
                      >
                        {petition.description}
                      </p>

                      <MetadataRow
                        label="Type"
                        value={`${formatStatus(
                          petition.type
                        )} / ${formatStatus(petition.status)}`}
                        color={theme.colors.primaryActionMuted}
                      />

                      {petition.publishAt && (
                        <MetadataRow
                          label="Publishes"
                          value={new Date(
                            petition.publishAt
                          ).toLocaleString()}
                          color={theme.colors.textMuted}
                        />
                      )}

                      <MetadataRow
                        label="Sponsors"
                        value={
                          petition.sponsors?.length
                            ? petition.sponsors
                                .map(
                                  (sponsor) =>
                                    sponsor.sponsorName
                                )
                                .join(", ")
                            : "No active sponsors"
                        }
                        color={theme.colors.textMuted}
                      />

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

                      {pendingSponsorRequests.map((request) => (
                        <div
                          key={request.id}
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.6rem",
                            border:
                              "1px solid rgba(255,255,255,0.05)"
                          }}
                        >
                          <MetadataRow
                            label="Sponsor Request"
                            value={request.requesterName}
                            color={theme.colors.textMuted}
                          />

                          {request.readiness && (
                            <>
                              <MetadataRow
                                label="Approvals"
                                value={`${request.readiness.approval.currentSupportCount} / ${request.readiness.approval.requiredSignatureCount}`}
                                color={
                                  theme.colors.primaryActionMuted
                                }
                              />

                              <MetadataRow
                                label="Declines"
                                value={`${request.readiness.decline.currentSupportCount} / ${request.readiness.decline.requiredSignatureCount}`}
                                color={theme.colors.textMuted}
                              />
                            </>
                          )}

                          {isCurrentSponsor && (
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                flexWrap: "wrap"
                              }}
                            >
                              <Button
                                onClick={() =>
                                  setSponsorRequestPreference(
                                    tribe.id,
                                    request.id,
                                    1
                                  )
                                }
                              >
                                Approve
                              </Button>

                              <Button
                                onClick={() =>
                                  setSponsorRequestPreference(
                                    tribe.id,
                                    request.id,
                                    -1
                                  )
                                }
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                          marginTop: "0.5rem"
                        }}
                      >
                        {petition.status === "open" && (
                          <>
                            <Button
                              onClick={() =>
                                supportPetition(
                                  tribe.id,
                                  petition.id
                                )
                              }
                            >
                              Support Petition
                            </Button>

                            {!isCurrentSponsor && (
                              <Button
                                onClick={() =>
                                  requestSponsorship(
                                    tribe.id,
                                    petition.id
                                  )
                                }
                              >
                                Request Sponsorship
                              </Button>
                            )}
                          </>
                        )}

                        {pendingInvite && (
                          <>
                            <Button
                              onClick={() =>
                                respondToInvite(
                                  tribe.id,
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
                                  tribe.id,
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
                          petition.status === "draft" && (
                            <Button
                              onClick={() =>
                                setActiveSponsorInviteId(
                                  activeSponsorInviteId ===
                                    petition.id
                                    ? null
                                    : petition.id
                                )
                              }
                            >
                              Invite Sponsor
                            </Button>
                          )}

                        {isCurrentSponsor &&
                          ["draft", "open"].includes(
                            petition.status
                          ) && (
                            <Button
                              onClick={() =>
                                leaveSponsorship(
                                  tribe.id,
                                  petition.id
                                )
                              }
                            >
                              Leave Sponsorship
                            </Button>
                          )}
                      </div>

                      {activeSponsorInviteId === petition.id && (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginTop: "0.5rem"
                          }}
                        >
                          <input
                            style={fieldStyle}
                            value={sponsorInviteName}
                            onChange={(event) =>
                              setSponsorInviteName(
                                event.target.value
                              )
                            }
                            placeholder="Character name"
                          />

                          <Button
                            onClick={() =>
                              inviteSponsor(
                                tribe.id,
                                petition.id
                              )
                            }
                          >
                            Send Invite
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}
    </PageLayout>
  );
}

export default TribesPage;
