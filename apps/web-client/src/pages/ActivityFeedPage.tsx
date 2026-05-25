import { useEffect, useState } from "react";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";

function ActivityFeedPage() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/activity-feed")
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, []);

  return (
    <PageLayout
      title="Activity Feed"
      description="Chronological institutional memory across tribes, projects, aid, and coordination events."
    >
      {activities.map((activity) => (
        <Card key={activity.id}>
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ margin: 0, marginBottom: "0.35rem" }}>
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
              Institutional Event
            </div>
          </div>

          <p
            style={{
              color: theme.colors.textSecondary,
              lineHeight: 1.5,
              marginTop: 0
            }}
          >
            {activity.message}
          </p>

          <MetadataRow
            label="Activity"
            value={activity.type}
            color={theme.colors.primaryActionMuted}
          />
        </Card>
      ))}
    </PageLayout>
  );
}

export default ActivityFeedPage;