import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, Trophy, RotateCcw, Keyboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildQuizDeck } from "@/lib/quiz";
import { saveQuizResult } from "@/lib/progress";

export default function QuizMode({ dayId, onBackToDay, onStartPractice, onProgressUpdate }) {
  const [deckSeed, setDeckSeed] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  const quizDeck = useMemo(() => buildQuizDeck(dayId), [dayId, deckSeed]);
  const current = quizDeck[questionIndex];
  const progress = quizDeck.length ? Math.round(((questionIndex + 1) / quizDeck.length) * 100) : 0;
  const isAnswered = selected !== null;
  const isCorrect = selected === current?.answer;

  const choose = (option) => {
    if (isAnswered || !current) return;
    setSelected(option);
    if (option === current.answer) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setShowHint(false);
    setFinished(false);
    setDeckSeed((s) => s + 1);
  };

  if (quizDeck.length === 0) {
    return <p className="text-slate-400">لا توجد أسئلة لهذا اليوم.</p>;
  }

  if (finished) {
    const passThreshold = Math.ceil(quizDeck.length * 0.6);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-xl">
          <CardContent className="p-8 text-center space-y-5">
            <Trophy className="mx-auto h-16 w-16 text-yellow-300" />
            <h2 className="text-3xl font-bold">نتيجة الاختبار</h2>
            <p className="text-5xl font-black text-emerald-300">
              {score} / {quizDeck.length}
            </p>
            <p className="text-slate-300">
              {score >= passThreshold
                ? "ممتاز! جرّب تدريب الكتابة لنفس اليوم."
                : "راجع كروت المذاكرة ثم أعد الاختبار."}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button onClick={restart} className="rounded-2xl bg-emerald-600">
                <RotateCcw className="ml-2 h-4 w-4" /> أعد الاختبار
              </Button>
              {onStartPractice && (
                <Button onClick={onStartPractice} className="rounded-2xl bg-indigo-600">
                  <Keyboard className="ml-2 h-4 w-4" /> تدريب كتابة
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
            <div className="flex gap-3 flex-wrap">
              <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-300">النقاط: {score}</span>
              <span className="rounded-full bg-yellow-500/15 px-4 py-2 text-yellow-300">سلسلة: {streak}</span>
              <span className="rounded-full bg-indigo-500/15 px-4 py-2 text-indigo-300">
                سؤال {questionIndex + 1} من {quizDeck.length}
              </span>
            </div>
            <Button onClick={() => setShowHint(!showHint)} className="rounded-2xl bg-slate-800">
              <Lightbulb className="ml-2 h-4 w-4" /> تلميح
            </Button>
          </div>
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800">
            <p className="whitespace-pre-line text-xl md:text-2xl font-bold leading-10">{current.question}</p>
          </div>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-200"
              >
                مثال قريب: <span dir="ltr" className="font-mono">{current.example}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid gap-3 md:grid-cols-2">
            {current.options.map((opt, idx) => {
              const correct = opt === current.answer;
              const chosen = opt === selected;
              let cls = "bg-slate-800 hover:bg-slate-700 border-slate-700";
              if (isAnswered && correct) cls = "bg-emerald-600 border-emerald-400";
              if (isAnswered && chosen && !correct) cls = "bg-red-600 border-red-400";
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => choose(opt)}
                  className={`rounded-2xl border p-4 text-right leading-7 transition ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {isAnswered && (
            <div className={`rounded-2xl p-4 flex items-start gap-3 ${isCorrect ? "bg-emerald-500/10 text-emerald-200" : "bg-red-500/10 text-red-200"}`}>
              {isCorrect ? <CheckCircle2 className="h-6 w-6 shrink-0" /> : <XCircle className="h-6 w-6 shrink-0" />}
              <div>
                <div className="font-bold">{isCorrect ? "إجابة صحيحة!" : "مش مشكلة، اتعلمها دلوقتي."}</div>
                <div className="mt-1">
                  الإجابة الصحيحة: <span className="font-bold">{current.answer}</span>
                </div>
                <div className="mt-1 text-slate-300">{current.desc}</div>
              </div>
            </div>
          )}
          <div className="flex justify-between gap-3">
            <Button onClick={onBackToDay} className="rounded-2xl bg-slate-800">
              رجوع
            </Button>
            <Button
              onClick={() => {
                if (questionIndex < quizDeck.length - 1) {
                  setQuestionIndex(questionIndex + 1);
                  setSelected(null);
                  setShowHint(false);
                } else {
                  saveQuizResult(dayId, score, quizDeck.length);
                  onProgressUpdate?.();
                  setFinished(true);
                }
              }}
              disabled={!isAnswered}
              className="rounded-2xl bg-emerald-600 disabled:opacity-40"
            >
              {questionIndex < quizDeck.length - 1 ? "السؤال التالي" : "إنهاء الاختبار"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
