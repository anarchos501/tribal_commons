import { useEffect, useState } from "react";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";

type Tribe = {
  id: number;
  name: string;
  locality: string;
  role?: string;
  createdAt?: string;
};

type GovernanceTopic = {
  id: number;
  title: string;
  description: string;
  minLabel: string;
  maxLabel: string;
};

type GovernanceTemperature = {
  topicId: number;
  preferenceCount: number;
  averageValue: number;
  temperature: string;
};

type FederationRelationship = {
  id: number;
  sourceTribeId: number;
  targetTribeId: number;
  relationshipType: string;
  note?: string;
  createdAt: string;
};

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

function TribesPage() {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [expandedTribeId, setExpandedTribeId] = useState<number | null>(null);
  const [topicsByTribe, setTopicsByTribe] = useState<Record<number, GovernanceTopic[]>>({});
  const [temperaturesByTopic, setTemperaturesByTopic] = useState<Record<number, GovernanceTemperature>>({});
  const [federationByTribe, setFederationByTribe] = useState<Record<number, FederationRelationship[]>>({});

  useEffect(() => {
    fetch("http://localhost:3000/tribes")
      .then((response) => response.json())
      .then((data) => setTribes(data));
  }, []);

  const loadTribeDetails = async (tribeId: number) => {
    const topicsResponse = await fetch(`http://localhost:3000/policies/${tribeId}`);
    const topics = await topicsResponse.json();

    const federationResponse = await fetch(`http://localhost:3000/federation/${tribeId}`);
    const federation = await federationResponse.json();

    const temperatures: Record<number, GovernanceTemperature> = {};

    for (const topic of topics) {
      const temperatureResponse = await fetch(
        `http://localhost:3000/policies/topics/${topic.id}/temperature`
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

  return (
    <PageLayout
      title="Tribes"
      description="Memberships, governance context, federation, and institutional identity."
    >
      {tribes.map((tribe) => {
        const expanded = expandedTribeId === tribe.id;
        const topics = topicsByTribe[tribe.id] || [];
        const federation = federationByTribe[tribe.id] || [];

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

              <Button>Logs / Audits</Button>
              <Button>Standings</Button>
            </div>

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
                        value={formatStatus(
  temperature?.temperature || "neutral"
)}
                        color={theme.colors.primaryActionMuted}
                      />

                      <MetadataRow
                        label="Preferences"
                        value={String(temperature?.preferenceCount || 0)}
                        color={theme.colors.textMuted}
                      />

                      <MetadataRow
                        label="Range"
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
              </div>
            )}
          </Card>
        );
      })}
    </PageLayout>
  );
}

export default TribesPage;