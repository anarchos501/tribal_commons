import { useEffect, useState } from "react";
import type { Activity } from "@tribal-commons/shared-types";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";
import { apiPath } from "../api";

const filters = [
  "all",
  "project",
  "support",
  "petition",
  "contribution",
  "governance",
  "federation"
];

const formatStatus = (status: string) =>
  status
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

function ActivityFeedPage() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [selectedFilter, setSelectedFilter] =
    useState("all");

  useEffect(() => {
    fetch(apiPath("/activity-feed"))
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, []);

  const visibleActivities =
    selectedFilter === "all"
      ? activities
      : activities.filter(
          (activity) =>
            activity.type === selectedFilter ||
            activity.entityType === selectedFilter
        );

  return (
    <PageLayout
      title="Activity Feed"
      description="Organizational timeline for projects, support, petitions, and coordination."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 180px",
          gap: "1rem",
          alignItems: "start"
        }}
      >
        <div>
          {visibleActivities.map((activity) => (
            <Card key={activity.id}>
              <div
                style={{
                  marginBottom: "1rem"
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    marginBottom: "0.35rem"
                  }}
                >
                  {activity.title}
                </h2>

                <div
                  style={{
                    fontSize: "0.78rem",
                    color: theme.colors.textMuted,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase"
                  }}
                >
                  Operational Record
                </div>
              </div>

              <p
                style={{
                  color:
                    theme.colors.textSecondary,
                  lineHeight: 1.5,
                  marginTop: 0
                }}
              >
                {activity.message}
              </p>

              {activity.createdAt && (
                <MetadataRow
                  label="Recorded"
                  value={new Date(
                    activity.createdAt
                  ).toLocaleString()}
                  color={
                    theme.colors.textMuted
                  }
                />
              )}

              <MetadataRow
                label="Activity"
                value={formatStatus(
                  activity.type
                )}
                color={
                  theme.colors.primaryActionMuted
                }
              />

              {activity.actorName && (
                <MetadataRow
                  label="Actor"
                  value={activity.actorName}
                  color={
                    theme.colors.textMuted
                  }
                />
              )}

              {activity.tribeId && (
                <MetadataRow
                  label="Tribe ID"
                  value={String(
                    activity.tribeId
                  )}
                  color={
                    theme.colors.textMuted
                  }
                />
              )}
            </Card>
          ))}

          {visibleActivities.length === 0 && (
            <Card>
              <h2>No Records Found</h2>

              <p>
                No activity records match the
                selected filter.
              </p>
            </Card>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            position: "sticky",
            top: "1rem"
          }}
        >
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={
                selectedFilter === filter
                  ? "primary"
                  : "default"
              }
              onClick={() =>
                setSelectedFilter(filter)
              }
            >
              {formatStatus(filter)}
            </Button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default ActivityFeedPage;
