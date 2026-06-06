import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  BookOpen,
  ListChecks,
  Keyboard,
  Route,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const slides = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
];

const modes = [
  { icon: BookOpen, label: "تعلّم", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: ListChecks, label: "اختبر", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
  { icon: Keyboard, label: "تمرّن", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: Route, label: "مسار عملي", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
];

const dayIcons = [
  Terminal, GitBranch, Sparkles, Terminal, GitBranch,
  Sparkles, Terminal, GitBranch, Sparkles,
];
const dayLabels = [
  "الأساسيات", "الملفات", "النصوص", "الصلاحيات", "العمليات",
  "الشبكات", "السكربتات", "Git", "المراجعة",
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const next = () => step < 2 && goTo(step + 1);
  const prev = () => step > 0 && goTo(step - 1);

  const finish = () => {
    localStorage.setItem("onboarding-done", "true");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-4">
      <div className="w-full max-w-lg relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="slide-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.15 }}
                className="h-24 w-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center"
              >
                <Terminal className="h-12 w-12 text-emerald-400" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent leading-snug">
                مرحباً في مسار التيرمنال 🖥️
              </h1>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                رحلة منظّمة لتعلّم أوامر التيرمنال من الصفر حتى الاحتراف في 9 أيام فقط.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="slide-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                9 أيام من المهارات
              </h2>
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {dayIcons.map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/60"
                  >
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">يوم {i + 1}</span>
                    <span className="text-[10px] text-slate-500">{dayLabels[i]}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="slide-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
                طريقة التعلم
              </h2>
              <p className="text-slate-400 text-xs max-w-xs">
                كل يوم فيه 4 أوضاع تعلّم مختلفة تبني مهاراتك خطوة بخطوة.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {modes.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${m.bg}`}
                    >
                      <Icon className={`h-7 w-7 ${m.color}`} />
                      <span className={`text-sm font-bold ${m.color}`}>{m.label}</span>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-xs">
                <span>تعلّم</span>
                <ChevronLeft className="h-3 w-3" />
                <span>اختبر</span>
                <ChevronLeft className="h-3 w-3" />
                <span>تمرّن</span>
                <ChevronLeft className="h-3 w-3" />
                <span>مسار</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex items-center gap-3 mt-10">
        {slides.map((s) => (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            aria-label={`الانتقال للخطوة ${s.id + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              step === s.id
                ? "w-8 bg-emerald-400"
                : "w-2.5 bg-slate-700 hover:bg-slate-600"
            }`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-3 mt-8">
        {step > 0 && (
          <Button
            onClick={prev}
            className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-2.5 text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronRight className="ml-1 h-4 w-4" />
            السابق
          </Button>
        )}
        {step < 2 ? (
          <Button
            onClick={next}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-white font-bold cursor-pointer"
          >
            التالي
            <ChevronLeft className="mr-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={finish}
            className="rounded-xl bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 px-8 py-3 text-white font-bold text-base cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="ml-2 h-5 w-5" />
            ابدأ رحلة التعلم
          </Button>
        )}
      </div>
    </div>
  );
}
