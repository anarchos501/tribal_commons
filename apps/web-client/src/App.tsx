import { useEffect, useState } from "react";
import type {
  CharacterProfile,
  UserAccount
} from "@tribal-commons/shared-types";

import Sidebar from "./components/Sidebar";

import DashboardPage from "./pages/DashboardPage";
import ActivityFeedPage from "./pages/ActivityFeedPage";
import TribesPage from "./pages/TribesPage";
import CoordinationHubPage from "./pages/CoordinationHubPage";

import { apiPath } from "./api";
import { theme } from "./styles/theme";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [characters, setCharacters] = useState<
    CharacterProfile[]
  >([]);
  const [currentCharacterId, setCurrentCharacterId] =
    useState<number | null>(null);

  useEffect(() => {
    fetch(apiPath("/accounts"))
      .then((response) => response.json())
      .then((accounts: UserAccount[]) => {
        const activeCharacters = accounts.flatMap(
          (account) => account.characters ?? []
        );

        setCharacters(activeCharacters);

        if (
          activeCharacters.length > 0 &&
          currentCharacterId === null
        ) {
          setCurrentCharacterId(activeCharacters[0].id);
        }
      })
      .catch(() => {
        setCharacters([]);
      });
  }, [currentCharacterId]);

  const currentCharacter =
    characters.find(
      (character) => character.id === currentCharacterId
    ) ?? null;

  const renderPage = () => {
    switch (activePage) {

      case "Dashboard":
        return (
          <DashboardPage
            currentCharacter={currentCharacter}
          />
        );

      case "Activity Feed":
        return <ActivityFeedPage />;

      case "Tribes":
        return (
          <TribesPage
            currentCharacter={currentCharacter}
          />
        );

      case "Coordination Hub":
        return (
          <CoordinationHubPage
            currentCharacter={currentCharacter}
          />
        );

      default:
        return (
          <DashboardPage
            currentCharacter={currentCharacter}
          />
        );
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem"
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: theme.colors.textMuted,
              fontSize: "0.78rem",
              textTransform: "uppercase"
            }}
          >
            Current Character
            <select
              value={currentCharacterId ?? ""}
              onChange={(event) =>
                setCurrentCharacterId(
                  event.target.value
                    ? Number(event.target.value)
                    : null
                )
              }
            >
              <option value="">
                Unscoped
              </option>

              {characters.map((character) => (
                <option
                  key={character.id}
                  value={character.id}
                >
                  {character.characterName}
                </option>
              ))}
            </select>
          </label>
        </div>

        {renderPage()}
      </main>
    </div>
  );
}

export default App;
