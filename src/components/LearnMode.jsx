import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Lightbulb, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCommandsForDay } from "@/lib/curriculumLoader";
import { getDay } from "@/data/curriculum";

function ProTipBox({ tip }) {
  const [open, setOpen] = useState(false);
  if (!tip) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full text-right bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 cursor-pointer transition-colors hover:bg-amber-500/10"
      aria-expanded={open}
      aria-label="نصيحة احترافية"
    >
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
        <span className="text-amber-300/90 text-xs font-bold flex-1">Pro Tip</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-amber-400/60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-amber-200/80 text-xs leading-relaxed mt-2 overflow-hidden"
          >
            {tip}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function LearnMode({ dayId }) {
  const day = getDay(dayId);
  const items = getCommandsForDay(dayId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <p className="text-slate-400 text-sm">
        {day?.titleAr} — {items.length} أوامر للمذاكرة
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
          >
            <Card className="h-full rounded-2xl glass-card border border-slate-800/60 shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono text-emerald-400">
                    Day {String(dayId).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                </div>
                <div className="font-mono text-2xl font-bold text-emerald-400 text-left ltr tracking-tight" dir="ltr">
                  {item.command}
                </div>
                <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 font-mono text-sm text-slate-200 text-left relative overflow-hidden" dir="ltr">
                  <div className="absolute top-1 right-2 text-[9px] text-slate-600 font-mono select-none">EXAMPLE</div>
                  <div className="pt-2">{item.example}</div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                <ProTipBox tip={item.proTip} />
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl bg-slate-950/40 border border-slate-800/50 p-2">
                    <span className="text-slate-500 text-[10px] block mb-1">FLAGS</span>
                    <span className="text-slate-300">{item.flags || "None"}</span>
                  </div>
                  <div className="rounded-xl bg-slate-950/40 border border-slate-800/50 p-2">
                    <span className="text-slate-500 text-[10px] block mb-1">TARGET</span>
                    <span className="text-slate-300">{item.target || "None"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
