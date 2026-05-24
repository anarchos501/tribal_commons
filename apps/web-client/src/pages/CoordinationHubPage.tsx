import { useEffect, useState } from "react";
import { theme } from "../styles/theme";
import Card from "../components/Card";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";

function CoordinationHubPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/coordination-hub")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <PageLayout
      title="Coordination Hub"
      description="Central hub for coordinating activities and projects."
    >

      {items.map((item) => (
        <Card key={item.id}>
          <h2>{item.title}</h2>

          <p>{item.description}</p>

<MetadataRow
  label="Type"
  value={item.type}
  color={theme.colors.primaryActionMuted}
/>

          <div style={{ marginTop: "1rem" }}>
            <Button>Open</Button>
            <Button>Discuss</Button>
            <Button variant="primary">Contribute</Button>
          </div>
        </Card>
      ))}
    </PageLayout>
  );
}

export default CoordinationHubPage;