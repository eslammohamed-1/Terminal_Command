import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ArrowRight, BookOpen, Terminal, Lightbulb, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { days } from "@/data/curriculum";
import { getCommandsForDay } from "@/lib/curriculumLoader";

function CompactProTip({ tip }) {
  const [open, setOpen] = useState(false);
  if (!tip) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full text-right bg-amber-500/5 border border-amber-500/15 rounded-lg p-2 cursor-pointer transition-colors hover:bg-amber-500/10"
      aria-expanded={open}
      aria-label="نصيحة احترافية"
    >
      <div className="flex items-center gap-1.5">
        <Lightbulb className="h-3 w-3 text-amber-400 shrink-0" />
        <span className="text-amber-300/90 text-[10px] font-bold flex-1">Pro Tip</span>
        <ChevronDown
          className={`h-3 w-3 text-amber-400/60 transition-transform duration-200 ${
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
            className="text-amber-200/80 text-[11px] leading-relaxed mt-1.5 overflow-hidden"
          >
            {tip}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function CheatSheet() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("terminal-bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("terminal-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Load all commands from the curriculum
  const allCommands = days.flatMap((day) => {
    const cmds = getCommandsForDay(day.id);
    return cmds.map((cmd) => ({
      ...cmd,
      dayTitle: day.titleAr,
      dayNumber: day.id,
    }));
  });

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  // Filter commands
  const filteredCommands = allCommands.filter((cmd) => {
    const matchesSearch =
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.example.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDay = selectedDay === "all" || cmd.dayNumber === parseInt(selectedDay, 10);
    const matchesBookmark = !showBookmarksOnly || bookmarks.includes(cmd.id);

    return matchesSearch && matchesDay && matchesBookmark;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <Button onClick={() => navigate("/")} className="rounded-xl bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white shrink-0 cursor-pointer h-10 w-10">
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">مرجع الأوامر السريع</h1>
            <p className="text-xs text-slate-400">ابحث واحفظ أوامرك المفضلة عبر المنهج بالكامل.</p>
          </div>
        </motion.div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-2xl glass-card border border-slate-800/60 p-4">
        <CardContent className="p-0 flex flex-col md:flex-row gap-3 items-center">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="ابحث عن أمر، شرح أو مثال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pr-10 pl-4 py-2.5 text-sm outline-none focus:border-emerald-500/50 text-slate-100"
            />
          </div>

          {/* Day Selector */}
          <div className="w-full md:w-auto">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-sm outline-none focus:border-emerald-500/50 text-slate-300 cursor-pointer"
            >
              <option value="all">كل الأيام</option>
              {days.map((d) => (
                <option key={d.id} value={d.id}>
                  اليوم {d.id} — {d.titleAr}
                </option>
              ))}
            </select>
          </div>

          {/* Bookmarks Toggle */}
          <Button
            type="button"
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`w-full md:w-auto rounded-xl border px-4 py-2.5 text-sm cursor-pointer transition-all ${
              showBookmarksOnly
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Star className={`ml-2 h-4 w-4 inline-block ${showBookmarksOnly ? "fill-amber-300" : ""}`} />
            المفضلة فقط
          </Button>
        </CardContent>
      </Card>

      {/* Commands Grid */}
      {filteredCommands.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCommands.map((item, idx) => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.015, 0.3) }}
              >
                <Card className="h-full rounded-2xl glass-card border border-slate-800/60 shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-950/80 border border-slate-800/60 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                        اليوم {item.dayNumber} · {item.dayTitle}
                      </span>
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-850 hover:border-amber-500/30 text-slate-500 hover:text-amber-400 transition cursor-pointer"
                        aria-label="حفظ في المفضلة"
                      >
                        <Star className={`h-4 w-4 ${isBookmarked ? "fill-amber-300 text-amber-300" : ""}`} />
                      </button>
                    </div>

                    <div className="font-mono text-2xl font-bold text-emerald-400 text-left ltr tracking-tight" dir="ltr">
                      {item.command}
                    </div>

                    <div className="rounded-xl bg-slate-950/80 border border-slate-905 p-3 font-mono text-xs text-slate-200 text-left" dir="ltr">
                      {item.example}
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>

                    <CompactProTip tip={item.proTip} />

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="rounded-lg bg-slate-950/30 border border-slate-800/40 p-2">
                        <span className="text-slate-500 block mb-0.5">FLAGS</span>
                        <span className="text-slate-300 break-all">{item.flags || "None"}</span>
                      </div>
                      <div className="rounded-lg bg-slate-950/30 border border-slate-800/40 p-2">
                        <span className="text-slate-500 block mb-0.5">TARGET</span>
                        <span className="text-slate-300 break-all">{item.target || "None"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 font-sans">
          <Terminal className="mx-auto h-12 w-12 opacity-20 mb-3" />
          لا توجد نتائج تطابق خيارات البحث الحالية.
        </div>
      )}
    </div>
  );
}
