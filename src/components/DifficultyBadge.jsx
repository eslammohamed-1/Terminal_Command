const STYLES = {
  easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  hard: "bg-red-500/15 text-red-200 border-red-500/30",
};

const LABELS = {
  easy: "سهل",
  medium: "متوسط",
  hard: "صعب",
};

export default function DifficultyBadge({ difficulty }) {
  const key = difficulty in STYLES ? difficulty : "easy";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${STYLES[key]}`}>
      {LABELS[key]}
    </span>
  );
}
