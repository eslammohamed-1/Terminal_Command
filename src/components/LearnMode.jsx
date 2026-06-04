import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCommandsForDay } from "@/data/commands";
import { getDay } from "@/data/curriculum";

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
            <Card className="h-full rounded-2xl bg-slate-900 border-slate-800 shadow-lg hover:shadow-emerald-500/10 transition">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                    Day {String(dayId).padStart(2, "0")}
                  </span>
                  <Star className="h-5 w-5 text-yellow-300" />
                </div>
                <div className="font-mono text-2xl text-emerald-300 text-left ltr" dir="ltr">
                  {item.command}
                </div>
                <div className="rounded-xl bg-slate-950 p-3 font-mono text-sm text-slate-200 text-left" dir="ltr">
                  {item.example}
                </div>
                <p className="text-slate-300 leading-7">{item.desc}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-slate-800 p-2">
                    <span className="text-slate-400">Flags:</span>
                    <br />
                    {item.flags}
                  </div>
                  <div className="rounded-xl bg-slate-800 p-2">
                    <span className="text-slate-400">Target:</span>
                    <br />
                    {item.target}
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
