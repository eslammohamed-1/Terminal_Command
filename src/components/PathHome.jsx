import { motion } from "framer-motion";
import { Terminal, CheckCircle2, ChevronLeft, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { days } from "@/data/curriculum";
import { getCommandsForDay, getLabStepsForDay } from "@/lib/curriculumLoader";
import { getMcqCountForDay, getTypingCountForDay } from "@/lib/questionsMetadata";
import { useProgress } from "@/contexts/ProgressContext";
import { useNavigate } from "react-router-dom";

export default function PathHome() {
  const { getDayCompletionPercent, getDayProgress, isDayFullyComplete, progress } = useProgress();
  const navigate = useNavigate();

  // Calculate learning dashboard statistics
  let totalPoints = 0;
  let completedActivities = 0;
  let completedDaysCount = 0;
  const totalDays = days.length;
  const totalActivities = totalDays * 3; // quiz, practice, lab per day

  days.forEach((day) => {
    const p = getDayProgress(day.id);
    totalPoints += (p.quizScore || 0) + (p.practiceScore || 0);
    if (p.quizDone) completedActivities++;
    if (p.practiceDone) completedActivities++;
    if (p.labDone) completedActivities++;
    if (p.quizDone && p.practiceDone && p.labDone) {
      completedDaysCount++;
    }
  });

  const overallPercent = Math.round((completedActivities / totalActivities) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/20 p-3 shadow-lg shadow-emerald-500/10 glow-emerald">
            <Terminal className="h-8 w-8 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">مسار تعلّم التيرمنال</h1>
            <p className="mt-1 text-slate-400 text-sm">7 أيام تفاعلية — من أساسيات التنقل إلى السكربتات المتقدمة.</p>
          </div>
        </motion.div>

        {/* Actions Button Group */}
        <div className="flex gap-2 self-start md:self-center flex-wrap">
          <Button 
            onClick={() => navigate("/cheatsheet")}
            className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 border border-teal-500/20 text-xs text-white hover:from-teal-500 hover:to-emerald-500 transition-all cursor-pointer py-1.5 h-auto px-3"
          >
            <BookOpen className="ml-1 h-3.5 w-3.5 inline-block" />
            مرجع الأوامر والبحث
          </Button>

          <Button 
            onClick={() => {
              if (confirm("هل أنت متأكد من إعادة ضبط كل التقدم؟ لا يمكن التراجع عن هذا الإجراء.")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer py-1.5 h-auto px-3"
          >
            إعادة ضبط التقدم
          </Button>
        </div>
      </div>

      {/* Stats Dashboard Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Card className="rounded-2xl glass-card border border-slate-800/60 p-5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">التقدم الكلي للمسار</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{overallPercent}%</span>
            <span className="text-xs text-slate-500">من الأنشطة</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${overallPercent}%` }} />
          </div>
        </Card>

        <Card className="rounded-2xl glass-card border border-slate-800/60 p-5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">إجمالي النقاط المجمعة</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300">{totalPoints}</span>
            <span className="text-xs text-slate-500">نقطة خبرة (XP)</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-3 block">تُمنح النقاط للحلول الصحيحة في الاختبارات والتدريبات</span>
        </Card>

        <Card className="rounded-2xl glass-card border border-slate-800/60 p-5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">الأيام المكتملة بالكامل</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-400">{completedDaysCount} / {totalDays}</span>
            <span className="text-xs text-slate-500">أيام ناجحة</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-3 block">أكمل كل من الاختبار، تمرين الكتابة والـ Lab لإنهاء اليوم</span>
        </Card>
      </motion.div>

      {/* Achievements Section */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold text-slate-200">الإنجازات المفتوحة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              id: "first_step",
              title: "الخطوة الأولى",
              desc: "أكملت أول نشاط لك في المسار",
              unlocked: completedActivities >= 1,
              icon: "🌱",
            },
            {
              id: "halfway",
              title: "منتصف الطريق",
              desc: "أكملت 3 أيام بالكامل",
              unlocked: completedDaysCount >= 3,
              icon: "🏃",
            },
            {
              id: "terminal_king",
              title: "ملك التيرمنال",
              desc: "جمعت 200 نقطة خبرة أو أكثر",
              unlocked: totalPoints >= 200,
              icon: "👑",
            },
            {
              id: "curriculum_master",
              title: "خبير التيرمنال",
              desc: "أكملت المسار كاملاً (7 أيام)",
              unlocked: completedDaysCount >= 7,
              icon: "🏆",
            },
          ].map((ach) => (
            <Card 
              key={ach.id} 
              className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
                ach.unlocked 
                  ? "glass-card border-slate-700/50 shadow-md shadow-emerald-950/10" 
                  : "bg-slate-950/20 border-slate-900/40 opacity-40"
              }`}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <h4 className={`text-sm font-bold ${ach.unlocked ? "text-slate-100" : "text-slate-500"}`}>{ach.title}</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">{ach.desc}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {days.map((day, idx) => {
          const cmdCount = getCommandsForDay(day.id).length;
          const mcqCount = getMcqCountForDay(day.id);
          const typingCount = getTypingCountForDay(day.id);
          const labCount = getLabStepsForDay(day.id).length;
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
              <Card className="rounded-2xl glass-card border border-slate-800/60 shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-emerald-400 font-semibold font-mono ltr text-left" dir="ltr">
                        Day {String(day.id).padStart(2, "0")}
                      </div>
                      <h2 className="text-xl font-bold mt-1 text-slate-100">{day.titleEn}</h2>
                      <p className="text-slate-400 text-sm">{day.titleAr}</p>
                    </div>
                    {complete && <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0 glow-emerald" />}
                  </div>
                  <p className="text-sm text-slate-400">
                    {cmdCount} أوامر · {mcqCount} اختبار · {typingCount} كتابة · {labCount} خطوة مسار
                  </p>
                  <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  {(progress.quizDone || progress.practiceDone || progress.labDone) && (
                    <p className="text-xs text-slate-500 flex gap-2 items-center flex-wrap">
                      {progress.quizDone && <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400">اختبار: {progress.quizScore}/{progress.quizTotal}</span>}
                      {progress.practiceDone && <span className="bg-blue-500/10 px-2 py-0.5 rounded text-blue-400">كتابة: {progress.practiceScore}/{progress.practiceTotal}</span>}
                      {progress.labDone && <span className="bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-400">المسار: مكتمل</span>}
                    </p>
                  )}
                  <Button onClick={() => navigate(`/day/${day.id}/learn`)} className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium shadow-md shadow-emerald-950/20 border border-emerald-500/20 transition-all duration-300">
                    ابدأ اليوم
                    <ChevronLeft className="mr-2 h-4 w-4" />
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
