import { useEffect, useState } from "react";

function App() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/dashboard/Anarchos")
      .then((response) => response.json())
      .then((data) => setDashboard(data));
  }, []);

  if (!dashboard) {
    return <div style={{ padding: "2rem" }}>Loading Tribal Commons Dashboard...</div>;
  }

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial",
        backgroundColor: "#111",
        color: "#eee",
        minHeight: "100vh"
      }}
    >
      <h1>Tribal Commons</h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Player</h2>
        <p>{dashboard.player}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem"
        }}
      >

        <section style={cardStyle}>
          <h2>Memberships</h2>
          <ul>
            {dashboard.memberships.map((membership: any) => (
              <li key={membership.tribeId}>
                {membership.tribeName}
              </li>
            ))}
          </ul>
        </section>

        <section style={cardStyle}>
          <h2>Projects</h2>
          <ul>
            {dashboard.myProjects.map((project: any) => (
              <li key={project.id}>
                {project.title} ({project.status})
              </li>
            ))}
          </ul>
        </section>

        <section style={cardStyle}>
          <h2>Aid Requests</h2>
          <ul>
            {dashboard.openAidRequests.map((aid: any) => (
              <li key={aid.id}>
                {aid.title} ({aid.status})
              </li>
            ))}
          </ul>
        </section>

        <section style={cardStyle}>
          <h2>Notifications</h2>
          <ul>
            <li>Aid request opened</li>
            <li>Petition awaiting signatures</li>
          </ul>
        </section>

      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#1b1b1b",
  padding: "1rem",
  borderRadius: "8px"
};

export default App;