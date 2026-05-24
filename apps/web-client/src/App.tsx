import { useState } from "react";

import Sidebar from "./components/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import ActivityFeedPage from "./pages/ActivityFeedPage";
import TribesPage from "./pages/TribesPage";
import CoordinationHubPage from "./pages/CoordinationHubPage";

import { theme } from "./styles/theme";

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
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.fontFamily
      }}
    >
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

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

export default App;