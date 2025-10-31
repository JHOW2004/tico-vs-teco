import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { MusicControls } from "./components/MusicControls";
import { MainMenu } from "./components/MainMenu";
import { LocalGame } from "./components/LocalGame";
import { BotGame } from "./components/BotGame";
import { RoomList } from "./components/OnlineGame/RoomList";
import { OnlineGameRoom } from "./components/OnlineGame/OnlineGameRoom";
import { Profile } from "./components/Profile";
import { Ranking } from "./components/Ranking";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { ResetPassword } from "./components/Auth/ResetPassword";
import { Loader } from "lucide-react";

type Screen =
  | "menu"
  | "local"
  | "bot"
  | "online-rooms"
  | "online-game"
  | "profile"
  | "ranking"
  | "ranking-full";
type AuthScreen = "login" | "register" | "reset" | null;

function App() {
  const { user, loading } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<Screen>("menu");
  const [authScreen, setAuthScreen] = useState<AuthScreen>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const handleSelectMode = (mode: "local" | "bot" | "online") => {
    if (mode === "online" && !user) {
      setAuthScreen("login");
      return;
    }

    if (mode === "local") {
      setCurrentScreen("local");
    } else if (mode === "bot") {
      setCurrentScreen("bot");
    } else {
      setCurrentScreen("online-rooms");
    }
  };

  const handleJoinRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setCurrentScreen("online-game");
  };

  const handleLeaveRoom = () => {
    setCurrentRoomId(null);
    setCurrentScreen("online-rooms");
  };

  const handleBackToMenu = () => {
    setCurrentScreen("menu");
    setCurrentRoomId(null);
  };

  const handleAuthSuccess = () => {
    setAuthScreen(null);
    setCurrentScreen("online-rooms");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="animate-spin text-[#00E1C8] mx-auto" size={64} />
          <p className="text-[#00E1C8] text-xl uppercase tracking-wider">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentScreen !== "online-game" && user && currentRoomId && (
        <MusicControls />
      )}
      
      {currentScreen === "menu" && (
        <MainMenu
          onSelectMode={handleSelectMode}
          onViewRanking={() => setCurrentScreen("ranking")}
          onViewProfile={() => user && setCurrentScreen("profile")}
          isAuthenticated={!!user}
        />
      )}

      {currentScreen === "local" && <LocalGame onBack={handleBackToMenu} />}

      {currentScreen === "bot" && <BotGame onBack={handleBackToMenu} />}

      {currentScreen === "online-rooms" && user && (
        <RoomList
          onBack={handleBackToMenu}
          userId={user.uid}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {currentScreen === "online-game" && user && currentRoomId && (
        <OnlineGameRoom
          roomId={currentRoomId}
          userId={user.uid}
          onLeave={handleLeaveRoom}
        />
      )}

      {currentScreen === "profile" && user && (
        <Profile onBack={handleBackToMenu} userId={user.uid} />
      )}

      {currentScreen === "ranking" && (
        <Ranking onBack={handleBackToMenu} showFull={false} />
      )}

      {currentScreen === "ranking-full" && (
        <Ranking onBack={handleBackToMenu} showFull={true} />
      )}

      {authScreen === "login" && (
        <Login
          onClose={() => setAuthScreen(null)}
          onSwitchToRegister={() => setAuthScreen("register")}
          onSwitchToResetPassword={() => setAuthScreen("reset")}
          onSuccess={handleAuthSuccess}
        />
      )}

      {authScreen === "register" && (
        <Register
          onClose={() => setAuthScreen(null)}
          onSwitchToLogin={() => setAuthScreen("login")}
          onSuccess={handleAuthSuccess}
        />
      )}

      {authScreen === "reset" && (
        <ResetPassword
          onClose={() => setAuthScreen(null)}
          onSwitchToLogin={() => setAuthScreen("login")}
        />
      )}
    </>
  );
}

export default App;
