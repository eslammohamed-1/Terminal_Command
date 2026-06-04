import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ListChecks, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDay, formatDayLabel } from "@/data/curriculum";
import LearnMode from "@/components/LearnMode";
import QuizMode from "@/components/QuizMode";
import PracticeMode from "@/components/PracticeMode";

export default function DayView({ dayId, mode, onModeChange, onBack, onProgressUpdate }) {
  const day = getDay(dayId);

  const handleMode = (m) => {
    onModeChange(m);
  };

  const notifyProgress = () => {
    onProgressUpdate?.();
  };

  if (!day) return null;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <Button onClick={onBack} className="rounded-2xl bg-slate-800">
          <ArrowRight className="ml-2 h-4 w-4" /> المسار التدريبي
        </Button>
        <div>
          <p className="text-emerald-400 font-mono text-sm ltr text-left" dir="ltr">
            Day {String(day.id).padStart(2, "0")}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">{formatDayLabel(day)}</h1>
          <p className="text-slate-400">{day.titleAr}</p>
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
            onClick={() => handleMode("practice")}
            className={`rounded-2xl ${mode === "practice" ? "bg-emerald-600" : "bg-slate-800"}`}
          >
            <Keyboard className="ml-2 h-4 w-4" /> تدريب كتابة
          </Button>
        </div>
      </motion.div>

      {mode === "learn" && <LearnMode dayId={dayId} />}
      {mode === "quiz" && (
        <QuizMode
          key={`quiz-${dayId}`}
          dayId={dayId}
          onBackToDay={() => handleMode("learn")}
          onProgressUpdate={notifyProgress}
          onStartPractice={() => {
            notifyProgress();
            handleMode("practice");
          }}
        />
      )}
      {mode === "practice" && (
        <PracticeMode
          key={`practice-${dayId}`}
          dayId={dayId}
          onBackToDay={() => handleMode("learn")}
          onProgressUpdate={notifyProgress}
          onStartQuiz={() => {
            notifyProgress();
            handleMode("quiz");
          }}
        />
      )}
    </div>
  );
}
