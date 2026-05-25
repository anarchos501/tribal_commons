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
            <h2>{tribe.name}</h2>

            <MetadataRow
              label="Locality"
              value={tribe.locality}
              color={theme.colors.textMuted}
            />

            <MetadataRow
              label="Role"
              value={tribe.role || "Member"}
              color={theme.colors.primaryActionMuted}
            />

            {tribe.createdAt && (
              <MetadataRow
                label="Created"
                value={new Date(tribe.createdAt).toLocaleString()}
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
                  borderTop: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <h3>Governance Temperatures</h3>

                {topics.length === 0 && (
                  <p>No governance topics configured yet.</p>
                )}

                {topics.map((topic) => {
                  const temperature = temperaturesByTopic[topic.id];

                  return (
                    <div key={topic.id} style={{ marginBottom: "1rem" }}>
                      <h4>{topic.title}</h4>
                      <p>{topic.description}</p>

                      <MetadataRow
                        label="Temperature"
                        value={temperature?.temperature || "neutral"}
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

                <h3 style={{ marginTop: "1.5rem" }}>Federation</h3>

                {federation.length === 0 && (
                  <p>No federation relationships recorded yet.</p>
                )}

                {federation.map((relationship) => (
                  <div key={relationship.id} style={{ marginBottom: "1rem" }}>
                    <MetadataRow
                      label="Target Tribe"
                      value={String(relationship.targetTribeId)}
                      color={theme.colors.textMuted}
                    />

                    <MetadataRow
                      label="Relationship"
                      value={relationship.relationshipType}
                      color={theme.colors.primaryActionMuted}
                    />

                    {relationship.note && (
                      <p>{relationship.note}</p>
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