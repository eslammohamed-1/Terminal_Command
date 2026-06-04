import { motion } from "framer-motion";
import { Terminal, CheckCircle2, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { days } from "@/data/curriculum";
import { getCommandsForDay } from "@/data/commands";
import { getPracticeForDay } from "@/data/practiceQuestions";
import { getDayCompletionPercent, getDayProgress, isDayFullyComplete } from "@/lib/progress";

export default function PathHome({ onSelectDay, progressVersion }) {
  void progressVersion;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-500/20 p-3 shadow-lg shadow-emerald-500/10">
          <Terminal className="h-8 w-8 text-emerald-300" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">مسار تعلّم التيرمنال</h1>
          <p className="mt-1 text-slate-300">7 أيام — من التنقل إلى السكربتات. كل الأيام مفتوحة.</p>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {days.map((day, idx) => {
          const cmdCount = getCommandsForDay(day.id).length;
          const practiceCount = getPracticeForDay(day.id).length;
          const percent = getDayCompletionPercent(day.id);
          const progress = getDayProgress(day.id);
          const complete = isDayFullyComplete(day.id);

          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="rounded-2xl bg-slate-900 border-slate-800 shadow-lg hover:border-emerald-500/30 transition">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-emerald-400 font-mono ltr text-left" dir="ltr">
                        Day {String(day.id).padStart(2, "0")}
                      </div>
                      <h2 className="text-xl font-bold mt-1">{day.titleEn}</h2>
                      <p className="text-slate-400 text-sm">{day.titleAr}</p>
                    </div>
                    {complete && <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-400">
                    {cmdCount} أوامر · {practiceCount} تمرين كتابة
                  </p>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  {(progress.quizDone || progress.practiceDone) && (
                    <p className="text-xs text-slate-500">
                      {progress.quizDone && `اختبار: ${progress.quizScore}/${progress.quizTotal}`}
                      {progress.quizDone && progress.practiceDone && " · "}
                      {progress.practiceDone && `كتابة: ${progress.practiceScore}/${progress.practiceTotal}`}
                    </p>
                  )}
                  <Button onClick={() => onSelectDay(day.id)} className="w-full rounded-2xl bg-emerald-600">
                    ابدأ اليوم
                    <ChevronLeft className="mr-2 h-4 w-4 rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
