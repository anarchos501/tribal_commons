import { useEffect, useState } from "react";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardPage />;

      case "Activity Feed":
        return <ActivityFeedPage />;

      case "Tribes":
        return <TribesPage />;

      case "Coordination Hub":
        return <CoordinationHubPage />;

      default:
        return <DashboardPage />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "#eee",
        fontFamily: "Arial"
      }}
    >
      <aside
        style={{
          width: "250px",
          backgroundColor: "#1b1b1b",
          padding: "1rem",
          borderRight: "1px solid #333"
        }}
      >
        <h2>Tribal Commons</h2>

        <NavButton
          label="Dashboard"
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <NavButton
          label="Activity Feed"
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <NavButton
          label="Tribes"
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <NavButton
          label="Coordination Hub"
          activePage={activePage}
          setActivePage={setActivePage}
        />
      </aside>

      <main
        style={{
          flex: 1,
          padding: "2rem"
        }}
      >
        {renderPage()}
      </main>
    </div>
  );
}

function NavButton({
  label,
  activePage,
  setActivePage
}: any) {
  return (
    <button
      onClick={() => setActivePage(label)}
      style={{
        width: "100%",
        padding: "0.75rem",
        marginBottom: "0.5rem",
        backgroundColor:
          activePage === label ? "#333" : "#222",
        color: "#eee",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        textAlign: "left"
      }}
    >
      {label}
    </button>
  );
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/dashboard/Anarchos")
      .then((response) => response.json())
      .then((data) => setDashboard(data));
  }, []);

  if (!dashboard) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

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
    </div>
  );
}

function ActivityFeedPage() {

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/activity-feed")
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, []);

  return (
    <div>
      <h1>Activity Feed</h1>

      {activities.map((activity) => (
        <section key={activity.id} style={cardStyle}>
          <h2>{activity.title}</h2>

          <p>{activity.message}</p>

          <small>{activity.type}</small>
        </section>
      ))}
    </div>
  );
}

function TribesPage() {

  const [tribes, setTribes] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/tribes-page")
      .then((response) => response.json())
      .then((data) => setTribes(data));
  }, []);

  return (
    <div>
      <h1>Tribes</h1>

      {tribes.map((tribe) => (
        <section key={tribe.id} style={cardStyle}>
          <h2>{tribe.name}</h2>

          <p>
            <strong>Locality:</strong> {tribe.locality}
          </p>

          <p>
            <strong>Status:</strong> {tribe.role}
          </p>

          <div style={{ marginTop: "1rem" }}>
            <button style={buttonStyle}>
              View Tribe
            </button>

            <button style={buttonStyle}>
              Logs / Audits
            </button>

            <button style={buttonStyle}>
              Standings
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

function CoordinationHubPage() {

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/coordination-hub")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div>
      <h1>Coordination Hub</h1>

      {items.map((item) => (
        <section key={item.id} style={cardStyle}>
          <h2>{item.title}</h2>

          <p>{item.description}</p>

          <p>
            <strong>Type:</strong> {item.type}
          </p>

          <div style={{ marginTop: "1rem" }}>
            <button style={buttonStyle}>
              Open
            </button>

            <button style={buttonStyle}>
              Discuss
            </button>

            <button style={buttonStyle}>
              Contribute
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#1b1b1b",
  padding: "1rem",
  borderRadius: "8px",
  marginBottom: "1rem"
};
const buttonStyle = {
  marginRight: "0.5rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#333",
  color: "#eee",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
export default App;