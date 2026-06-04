export const days = [
  { id: 1, titleEn: "Navigation", titleAr: "التنقل", slug: "navigation" },
  { id: 2, titleEn: "Files and Directories", titleAr: "الملفات والمجلدات", slug: "files" },
  { id: 3, titleEn: "Text Processing", titleAr: "معالجة النصوص", slug: "text" },
  { id: 4, titleEn: "Pipes and Redirection", titleAr: "الأنابيب وإعادة التوجيه", slug: "pipes" },
  { id: 5, titleEn: "Find and Xargs", titleAr: "البحث و xargs", slug: "find-xargs" },
  { id: 6, titleEn: "Permissions", titleAr: "الصلاحيات", slug: "permissions" },
  { id: 7, titleEn: "Scripting", titleAr: "السكربتات", slug: "scripting" },
];

export function getDay(id) {
  return days.find((d) => d.id === id);
}

export function formatDayLabel(day) {
  return `Day ${String(day.id).padStart(2, "0")} — ${day.titleEn}`;
}
