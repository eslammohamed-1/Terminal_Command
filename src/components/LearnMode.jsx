import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  ChevronDown,
  Layers,
  HelpCircle,
  AlertTriangle,
  Terminal,
  Link2,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCommandsForDay } from "@/lib/curriculumLoader";
import { getDay } from "@/data/curriculum";
import TerminalEmulator from "@/components/TerminalEmulator";

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

function InfoSection({ icon: Icon, title, colorClass, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-xl border p-3 ${colorClass}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 text-right"
        aria-expanded={open}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-bold flex-1">{title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-2 text-xs leading-relaxed"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VariantCard({ item, index, onTryIt, onRelatedClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-4 space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500 font-mono">#{index + 1}</span>
        {item.flags && item.flags !== "None" && (
          <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
            {item.flags}
          </span>
        )}
      </div>

      <div
        className="rounded-lg bg-slate-900/80 border border-slate-800/80 p-2 font-mono text-sm text-slate-200 text-left"
        dir="ltr"
      >
        {item.example}
      </div>

      <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>

      {item.useCase && (
        <InfoSection
          icon={HelpCircle}
          title="متى تستخدمه؟"
          colorClass="use-case-box bg-sky-500/5 border-sky-500/15 text-sky-200/90"
        >
          <p>{item.useCase}</p>
        </InfoSection>
      )}

      {item.mistakes?.length > 0 && (
        <InfoSection
          icon={AlertTriangle}
          title="أخطاء شائعة"
          colorClass="mistake-box bg-amber-500/5 border-amber-500/20 text-amber-200/90"
        >
          <ul className="space-y-1.5 list-none">
            {item.mistakes.map((mistake, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-amber-400 shrink-0">⚠</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </InfoSection>
      )}

      {item.outputPreview && (
        <InfoSection
          icon={Terminal}
          title="شكل الـ Output"
          colorClass="bg-slate-900/60 border-slate-700/60 text-slate-300"
          defaultOpen
        >
          <pre className="terminal-output whitespace-pre-wrap text-left" dir="ltr">
            {item.outputPreview}
          </pre>
        </InfoSection>
      )}

      {item.related?.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link2 className="h-3.5 w-3.5" />
            <span>أوامر مرتبطة</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.related.map((rel) => (
              <button
                key={rel}
                type="button"
                onClick={() => onRelatedClick?.(rel)}
                className="related-chip font-mono text-xs px-2 py-1 rounded-lg"
                dir="ltr"
              >
                {rel}
              </button>
            ))}
          </div>
        </div>
      )}

      <ProTipBox tip={item.proTip} />

      <button
        type="button"
        onClick={() => onTryIt(item.example)}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm font-medium py-2.5 hover:bg-emerald-500/20 transition-colors"
      >
        <Play className="h-4 w-4" />
        جرّب بنفسك
      </button>
    </motion.div>
  );
}

function CommandGroupCard({ command, variants, index, isOpen, onToggle, onRelatedClick }) {
  const cardRef = useRef(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [suggestedCommand, setSuggestedCommand] = useState("");

  const handleTryIt = (example) => {
    setSuggestedCommand(example);
    setTerminalOpen(true);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      id={`cmd-${command.replace(/\s+/g, "-")}`}
    >
      <Card className="h-full rounded-2xl glass-card border border-slate-800/60 shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono text-emerald-400">
                Day {String(variants[0].dayId).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Layers className="h-3.5 w-3.5" />
                {variants.length} استخدام
              </span>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="text-xs font-mono text-slate-500 hover:text-emerald-400 transition-colors"
            >
              {isOpen ? "إخفاء" : "عرض"}
              <ChevronDown
                className={`inline-block h-3.5 w-3.5 mr-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div
            className="font-mono text-2xl font-bold text-emerald-400 text-left ltr tracking-tight"
            dir="ltr"
          >
            {command}
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-3"
              >
                {variants.map((item, idx) => (
                  <VariantCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onTryIt={handleTryIt}
                    onRelatedClick={onRelatedClick}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isOpen && (
            <p className="text-slate-500 text-sm">اضغط "عرض" لمشاهدة جميع الاستخدامات والفلاجات</p>
          )}
        </CardContent>
      </Card>

      <TerminalEmulator
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        suggestedCommand={suggestedCommand}
      />
    </motion.div>
  );
}

export default function LearnMode({ dayId }) {
  const day = getDay(dayId);
  const items = getCommandsForDay(dayId);
  const [openGroups, setOpenGroups] = useState({});

  const groupedCommands = useMemo(() => {
    const groups = {};
    items.forEach((item) => {
      const baseCommand = item.command;
      if (!groups[baseCommand]) groups[baseCommand] = [];
      groups[baseCommand].push(item);
    });
    return Object.entries(groups).map(([command, variants]) => ({ command, variants }));
  }, [items]);

  const handleRelatedClick = (relatedName) => {
    const base = relatedName.split(" ")[0];
    const match = groupedCommands.find(
      (g) => g.command === relatedName || g.command === base || relatedName.startsWith(g.command)
    );
    if (match) {
      setOpenGroups((prev) => ({ ...prev, [match.command]: true }));
      setTimeout(() => {
        document.getElementById(`cmd-${match.command.replace(/\s+/g, "-")}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <p className="text-slate-400 text-sm">
        {day?.titleAr} — {groupedCommands.length} أمر أساسي ({items.length} استخدام شامل)
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groupedCommands.map((group, idx) => (
          <CommandGroupCard
            key={group.command}
            command={group.command}
            variants={group.variants}
            index={idx}
            isOpen={!!openGroups[group.command]}
            onToggle={() =>
              setOpenGroups((prev) => ({ ...prev, [group.command]: !prev[group.command] }))
            }
            onRelatedClick={handleRelatedClick}
          />
        ))}
      </div>
    </motion.div>
  );
}
