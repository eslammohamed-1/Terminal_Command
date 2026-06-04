import { useState } from "react";
import PathHome from "@/components/PathHome";
import DayView from "@/components/DayView";

export default function TerminalCommandsGame() {
  const [view, setView] = useState("path");
  const [activeDayId, setActiveDayId] = useState(null);
  const [dayMode, setDayMode] = useState("learn");
  const [progressVersion, setProgressVersion] = useState(0);

  const openDay = (dayId) => {
    setActiveDayId(dayId);
    setDayMode("learn");
    setView("day");
  };

  const backToPath = () => {
    setView("path");
    setActiveDayId(null);
    setProgressVersion((v) => v + 1);
  };

  const bumpProgress = () => {
    setProgressVersion((v) => v + 1);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {view === "path" && (
          <PathHome onSelectDay={openDay} progressVersion={progressVersion} />
        )}
        {view === "day" && activeDayId != null && (
          <DayView
            dayId={activeDayId}
            mode={dayMode}
            onModeChange={setDayMode}
            onBack={backToPath}
            onProgressUpdate={bumpProgress}
          />
        )}
      </div>
    </div>
  );
}
