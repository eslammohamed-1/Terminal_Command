import TerminalCommandsGame from "./TerminalCommandsGame.jsx";
import { ProgressProvider } from "@/contexts/ProgressContext";

export default function App() {
  return (
    <ProgressProvider>
      <TerminalCommandsGame />
    </ProgressProvider>
  );
}
