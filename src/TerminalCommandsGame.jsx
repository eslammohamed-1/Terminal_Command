import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import PathHome from "@/components/PathHome";
import DayView from "@/components/DayView";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const CheatSheet = lazy(() => import("@/components/CheatSheet"));
const WelcomeScreen = lazy(() => import("@/components/WelcomeScreen"));

function DayViewRedirect() {
  const { dayId } = useParams();
  return <Navigate to={`/day/${dayId}/learn`} replace />;
}

function WelcomeGuard({ children }) {
  const done = localStorage.getItem("onboarding-done");
  if (!done) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
}

export default function TerminalCommandsGame() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 bg-grid-pattern relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-6xl relative z-10">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
                <span className="mr-3 text-slate-400">جاري التحميل...</span>
              </div>
            }>
              <Routes>
                <Route path="/welcome" element={<WelcomeScreen />} />
                <Route path="/" element={<WelcomeGuard><PathHome /></WelcomeGuard>} />
                <Route path="/cheatsheet" element={<CheatSheet />} />
                <Route path="/day/:dayId" element={<DayViewRedirect />} />
                <Route path="/day/:dayId/:mode" element={<DayView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </BrowserRouter>
  );
}
