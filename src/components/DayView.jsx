import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ListChecks, Keyboard, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDay, formatDayLabel } from "@/data/curriculum";
import { useParams, useNavigate } from "react-router-dom";

const LearnMode = lazy(() => import("@/components/LearnMode"));
const QuizMode = lazy(() => import("@/components/QuizMode"));
const PracticeMode = lazy(() => import("@/components/PracticeMode"));
const LabMode = lazy(() => import("@/components/LabMode"));

export default function DayView() {
  const { dayId, mode = "learn" } = useParams();
  const navigate = useNavigate();
  const parsedDayId = parseInt(dayId, 10);
  const day = getDay(parsedDayId);

  const handleMode = (m) => {
    navigate(`/day/${dayId}/${m}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  if (!day) return null;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <Button onClick={handleBack} className="rounded-2xl bg-slate-800">
          <ArrowRight className="ml-2 h-4 w-4" /> المسار التدريبي
        </Button>
        <div>
          <p className="text-emerald-400 font-mono text-sm ltr text-left" dir="ltr">
            Day {String(day.id).padStart(2, "0")}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">{formatDayLabel(day)}</h1>
          <p className="text-slate-400">{day.titleAr}</p>
          {day.goal && (
            <p className="text-slate-300 text-sm leading-7 mt-2 rounded-xl bg-slate-900/80 border border-slate-800 p-3">
              {day.goal}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleMode("learn")}
            className={`rounded-2xl ${mode === "learn" ? "bg-emerald-600" : "bg-slate-800"}`}
          >
            <BookOpen className="ml-2 h-4 w-4" /> مذاكرة
          </Button>
          <Button
            onClick={() => handleMode("quiz")}
            className={`rounded-2xl ${mode === "quiz" ? "bg-emerald-600" : "bg-slate-800"}`}
          >
            <ListChecks className="ml-2 h-4 w-4" /> اختبار
          </Button>
          <Button
            onClick={() => navigate(`/day/${dayId}/practice`)}
            className={`rounded-2xl ${mode === "practice" ? "bg-emerald-600" : "bg-slate-800"}`}
          >
            <Keyboard className="ml-2 h-4 w-4" /> تدريب كتابة
          </Button>
          <Button
            onClick={() => handleMode("lab")}
            className={`rounded-2xl ${mode === "lab" ? "bg-emerald-600" : "bg-slate-800"}`}
          >
            <Route className="ml-2 h-4 w-4" /> مسار اليوم
          </Button>
        </div>
      </motion.div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          <span className="mr-3 text-slate-400">جاري التحميل...</span>
        </div>
      }>
        {mode === "learn" && <LearnMode dayId={parsedDayId} />}
        {mode === "quiz" && (
          <QuizMode
            key={`quiz-${parsedDayId}`}
            dayId={parsedDayId}
            onBackToDay={() => handleMode("learn")}
            onStartPractice={() => handleMode("practice")}
          />
        )}
        {mode === "practice" && (
          <PracticeMode
            key={`practice-${parsedDayId}`}
            dayId={parsedDayId}
            onBackToDay={() => handleMode("learn")}
            onStartQuiz={() => handleMode("quiz")}
          />
        )}
        {mode === "lab" && <LabMode key={`lab-${parsedDayId}`} dayId={parsedDayId} />}
      </Suspense>
    </div>
  );
}
