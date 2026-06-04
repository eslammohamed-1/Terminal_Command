import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, Trophy, RotateCcw, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DifficultyBadge from "@/components/DifficultyBadge";
import { buildPracticeDeck, matchesPracticeAnswer } from "@/lib/quiz";
import { getQuestionsMeta } from "@/lib/questionsLoader";
import { savePracticeResult } from "@/lib/progress";

export default function PracticeMode({ dayId, onBackToDay, onStartQuiz, onProgressUpdate }) {
  const { uiCopy } = getQuestionsMeta();
  const [deckSeed, setDeckSeed] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const practiceDeck = useMemo(() => buildPracticeDeck(dayId), [dayId, deckSeed]);
  const currentPractice = practiceDeck[practiceIndex];
  const practiceProgress = practiceDeck.length
    ? Math.round(((practiceIndex + 1) / practiceDeck.length) * 100)
    : 0;
  const typedIsCorrect =
    practiceChecked && currentPractice && matchesPracticeAnswer(typedAnswer, currentPractice);

  const checkTypedAnswer = () => {
    if (practiceChecked || !currentPractice) return;
    const ok = matchesPracticeAnswer(typedAnswer, currentPractice);
    setPracticeChecked(true);
    if (ok) {
      setCorrectCount((c) => c + 1);
      setPointsEarned((p) => p + (currentPractice.points ?? 1));
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const restart = () => {
    setPracticeIndex(0);
    setCorrectCount(0);
    setPointsEarned(0);
    setStreak(0);
    setTypedAnswer("");
    setPracticeChecked(false);
    setShowHint(false);
    setFinished(false);
    setDeckSeed((s) => s + 1);
  };

  if (practiceDeck.length === 0) {
    return <p className="text-slate-400">لا توجد تمارين كتابة لهذا اليوم.</p>;
  }

  if (finished) {
    const passThreshold = Math.ceil(practiceDeck.length * 0.6);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
          <CardContent className="p-8 text-center space-y-5">
            <Trophy className="mx-auto h-16 w-16 text-yellow-300" />
            <h2 className="text-3xl font-bold">نتيجة تدريب الكتابة</h2>
            <p className="text-5xl font-black text-emerald-300">
              {correctCount} / {practiceDeck.length}
            </p>
            <p className="text-2xl text-amber-200">
              {uiCopy.points_label}: {pointsEarned}
            </p>
            <p className="text-slate-300">
              {correctCount >= passThreshold
                ? "عاش! كتبت الأوامر بثقة."
                : "راجع كروت المذاكرة ثم كرر التدريب."}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button onClick={restart} className="rounded-2xl bg-emerald-600">
                <RotateCcw className="ml-2 h-4 w-4" /> أعد التدريب
              </Button>
              {onStartQuiz && (
                <Button onClick={onStartQuiz} className="rounded-2xl bg-indigo-600">
                  <ListChecks className="ml-2 h-4 w-4" /> اختبار
                </Button>
              )}
              <Button onClick={onBackToDay} className="rounded-2xl bg-slate-800">
                رجوع لليوم
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
        <CardContent className="p-5 md:p-7 space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3 flex-wrap items-center">
              <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-300">
                {uiCopy.points_label}: {pointsEarned}
              </span>
              <span className="rounded-full bg-yellow-500/15 px-4 py-2 text-yellow-300">
                {uiCopy.streak_label}: {streak}
              </span>
              <span className="rounded-full bg-indigo-500/15 px-4 py-2 text-indigo-300">
                {currentPractice.trainingLabel || `تدريب ${practiceIndex + 1} من ${practiceDeck.length}`}
              </span>
              {currentPractice && <DifficultyBadge difficulty={currentPractice.difficulty} />}
            </div>
            <Button onClick={() => setShowHint(!showHint)} className="rounded-2xl bg-slate-800">
              <Lightbulb className="ml-2 h-4 w-4" /> {uiCopy.hint_label}
            </Button>
          </div>
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${practiceProgress}%` }} />
          </div>
          <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800">
            <div className="mb-2 text-sm text-emerald-300">{uiCopy.typing_instruction}</div>
            <p className="text-xl md:text-2xl font-bold leading-10">{currentPractice.prompt}</p>
          </div>
          <AnimatePresence>
            {showHint && currentPractice.hint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-200"
              >
                {uiCopy.hint_label}: {currentPractice.hint}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-3">
            <input
              dir="ltr"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && typedAnswer.trim() && !practiceChecked) checkTypedAnswer();
              }}
              disabled={practiceChecked}
              placeholder={currentPractice.placeholder || uiCopy.typing_placeholder}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-left font-mono text-lg text-slate-100 outline-none focus:border-emerald-400 disabled:opacity-70"
            />
            <div className="text-sm text-slate-400">{uiCopy.spacing_note}</div>
          </div>
          {practiceChecked && (
            <div
              className={`rounded-2xl p-4 flex items-start gap-3 ${typedIsCorrect ? "bg-emerald-500/10 text-emerald-200" : "bg-red-500/10 text-red-200"}`}
            >
              {typedIsCorrect ? <CheckCircle2 className="h-6 w-6 shrink-0" /> : <XCircle className="h-6 w-6 shrink-0" />}
              <div>
                <div className="font-bold">{typedIsCorrect ? "تمام! كتبت الأمر صح." : "الإجابة محتاجة تعديل."}</div>
                <div className="mt-1">
                  إجابة صحيحة:{" "}
                  <span dir="ltr" className="font-mono font-bold">
                    {currentPractice.answers[0]}
                  </span>
                  {typedIsCorrect && (
                    <span className="mr-2 text-amber-200">
                      (+{currentPractice.points} {uiCopy.points_label})
                    </span>
                  )}
                </div>
                <div className="mt-1 text-slate-300">{currentPractice.explanation}</div>
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-between gap-3">
            <Button onClick={onBackToDay} className="rounded-2xl bg-slate-800">
              {uiCopy.back_label}
            </Button>
            <div className="flex gap-3">
              <Button
                onClick={checkTypedAnswer}
                disabled={!typedAnswer.trim() || practiceChecked}
                className="rounded-2xl bg-emerald-600 disabled:opacity-40"
              >
                تحقق
              </Button>
              <Button
                onClick={() => {
                  if (practiceIndex < practiceDeck.length - 1) {
                    setPracticeIndex(practiceIndex + 1);
                    setTypedAnswer("");
                    setPracticeChecked(false);
                    setShowHint(false);
                  } else {
                    savePracticeResult(dayId, correctCount, practiceDeck.length);
                    onProgressUpdate?.();
                    setFinished(true);
                  }
                }}
                disabled={!practiceChecked}
                className="rounded-2xl bg-indigo-600 disabled:opacity-40"
              >
                {practiceIndex < practiceDeck.length - 1 ? "التالي" : "إنهاء التدريب"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
