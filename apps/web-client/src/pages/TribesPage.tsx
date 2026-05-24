import { useEffect, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import PageLayout from "../components/PageLayout";
import MetadataRow from "../components/MetadataRow";

function TribesPage() {
  const [tribes, setTribes] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/tribes-page")
      .then((response) => response.json())
      .then((data) => setTribes(data));
  }, []);

  return (
    <PageLayout
      title="Tribes"
      description="Tribal membership and governance."
    >

      {tribes.map((tribe) => (
        <Card key={tribe.id}>
          <h2>{tribe.name}</h2>

<MetadataRow
  label="Locality"
  value={tribe.locality}
/>

<MetadataRow
  label="Status"
  value={tribe.role}
  color="#b08d57"
/>

          <div style={{ marginTop: "1rem" }}>
            <Button>
  View Tribe
</Button>

            <Button>
  Logs / Audits
</Button>

            <Button>
  Standings
</Button>
          </div>
        </Card>
      ))}
    </PageLayout>
  );
}

export default TribesPage;