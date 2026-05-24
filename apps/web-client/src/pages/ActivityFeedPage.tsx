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
      description="Recent activities and updates across your tribes and projects.">

      {activities.map((activity) => (
        <Card key={activity.id}>
          <h2>{activity.title}</h2>

          <p>{activity.message}</p>

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