import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, CheckCircle2, Terminal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLabStepsForDay, getLabScenarioForDay } from "@/lib/curriculumLoader";
import { useProgress } from "@/contexts/ProgressContext";

export default function LabMode({ dayId }) {
  const { getDayProgress, saveLab } = useProgress();
  const steps = getLabStepsForDay(dayId);
  const scenario = getLabScenarioForDay(dayId);
  const [done, setDone] = useState(() => {
    const p = getDayProgress(dayId);
    return new Set(p.labCompletedSteps ?? []);
  });
  const [copiedIdx, setCopiedIdx] = useState(null);

  const toggle = (idx) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      const arr = Array.from(next);
      const isDone = next.size === steps.length;
      saveLab(dayId, arr, isDone);
      return next;
    });
  };

  const copyStep = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      /* ignore */
    }
  };

  if (!steps.length) {
    return <p className="text-slate-400">لا توجد خطوات مسار لهذا اليوم.</p>;
  }

  const allDone = done.size === steps.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Lab Scenario Header */}
      {scenario && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-slate-900/80 shadow-lg shadow-emerald-500/5">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                  <Terminal className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  {scenario.title}
                </h2>
              </div>
              {scenario.description && (
                <p className="text-slate-400 text-sm leading-relaxed pr-13">
                  {scenario.description}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <p className="text-slate-400 text-sm">
        نفّذ الأوامر بالترتيب في التيرمنال. علّم كل خطوة عند الانتهاء (محليًا في هذه الجلسة).
      </p>
      {allDone && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle2 className="h-5 w-5" />
          أكملت كل خطوات مسار اليوم.
        </div>
      )}
      <ol className="space-y-3 list-none p-0 m-0">
        {steps.map((cmd, idx) => {
          const isDone = done.has(idx);
          return (
            <li key={idx}>
              <Card
                className={`rounded-2xl border-slate-800 transition ${
                  isDone ? "bg-emerald-950/30 border-emerald-800/50" : "bg-slate-900"
                }`}
              >
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
                      isDone
                        ? "border-emerald-500 bg-emerald-600 text-white"
                        : "border-slate-600 bg-slate-800 text-slate-400 hover:border-emerald-500/50"
                    }`}
                    aria-label={isDone ? "إلغاء التحديد" : "تمت الخطوة"}
                  >
                    {isDone && <Check className="h-4 w-4" />}
                  </button>
                  <span className="text-slate-500 font-mono text-sm w-6">{idx + 1}.</span>
                  <code
                    className="flex-1 min-w-0 font-mono text-base text-emerald-300 text-left ltr break-all"
                    dir="ltr"
                  >
                    {cmd}
                  </code>
                  <Button
                    type="button"
                    onClick={() => copyStep(cmd, idx)}
                    className="rounded-xl bg-slate-800 shrink-0"
                  >
                    <Copy className="ml-1 h-4 w-4" />
                    {copiedIdx === idx ? "تم النسخ" : "نسخ"}
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}
