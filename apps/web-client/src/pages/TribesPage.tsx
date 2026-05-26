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
    targetTribeId: ""
  });

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

    const petitionsResponse = await fetch(
      apiPath(`/petitions?tribeId=${tribeId}&status=open`)
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
      targetTribeId: ""
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
        targetTribeId: ""
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
                      Open a typed petition for members to support before it becomes operational work.
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

                <div style={formActionsStyle}>
                  <Button type="submit" variant="primary">
                    Open Petition
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
                  Open Petitions
                </h3>

                {petitions.length === 0 && (
                  <p>No open petitions recorded yet.</p>
                )}

                {petitions.map((petition) => (
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
                      value={formatStatus(petition.type)}
                      color={theme.colors.primaryActionMuted}
                    />

                    <MetadataRow
                      label="Supporters"
                      value={String(
                        petition.supports?.length ?? 0
                      )}
                      color={theme.colors.textMuted}
                    />

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
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </PageLayout>
  );
}

export default TribesPage;
