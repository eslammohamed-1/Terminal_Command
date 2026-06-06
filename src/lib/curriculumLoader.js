import curriculum from "@/data/curriculum.ar.json";

const NAME_OVERRIDES = [
  ["command -v", "command -v"],
  ["brew install", "brew install"],
  ["#!/usr/bin/env bash", "#!/usr/bin/env bash"],
  ["set -euo pipefail", "set -euo pipefail"],
  ["command1 | command2", "|"],
  ["sudo chown -R", "chown"],
  ["sudo chown user:group", "chown"],
  ["sudo chown user", "chown"],
  ["sudo command", "sudo"],
  ["log() {", "log"],
  ["if [", "if"],
  ["for file", "for"],
  ["while read", "while"],
  ['case "', "case"],
  ["kill -9", "kill"],
  ["sleep 100", "sleep"],
  ["ps aux |", "ps"],
];

function inferName(example) {
  const text = example.trim();
  for (const [prefix, name] of NAME_OVERRIDES) {
    if (text.startsWith(prefix)) return name;
  }
  if (text.includes(" | ") && text.indexOf(" | ") < 12) return "|";
  const parts = text.split(/\s+/);
  if (!parts.length) return text;
  if (parts[0] === "sudo" && parts.length > 1) return parts[1] === "chown" ? "chown" : parts[1];
  return parts[0];
}

function inferFlagsTarget(example, name) {
  const text = example.trim();
  if (["|", ">", "if", "for", "while", "case", "sudo"].includes(name)) {
    return { flags: "None", target: "None" };
  }
  if (name === "echo" && text.includes("$")) {
    const m = text.match(/\$(\?|HOME|SHELL|\{[^}]+\})/);
    if (m) return { flags: m[0], target: "None" };
    return { flags: "متغير", target: "None" };
  }
  if (name === "brew install") {
    const rest = text.slice("brew install".length).trim();
    return { flags: "اسم الحزمة", target: rest || "None" };
  }
  if (name === "command -v") {
    const rest = text.slice("command -v".length).trim();
    return { flags: "None", target: rest || "None" };
  }
  const parts = text.split(/\s+/);
  if (parts.length === 1) return { flags: "None", target: "None" };
  if (parts.length === 2) return { flags: parts[1], target: "None" };
  return { flags: parts.slice(1, -1).join(" "), target: parts[parts.length - 1] };
}

function normalizeCommandEntry(raw, dayId) {
  const example = raw.example ?? raw.command ?? "";
  const purpose = raw.purpose ?? raw.desc ?? "";
  const name = raw.name ?? inferName(example);
  const inferred = inferFlagsTarget(example, name);
  return {
    id: raw.id ?? `d${dayId}-${dayId}-${example.slice(0, 12)}`,
    dayId,
    command: name,
    flags: raw.flags ?? inferred.flags,
    target: raw.target ?? inferred.target,
    desc: purpose,
    example,
    platform: raw.platform,
    proTip: raw.proTip ?? raw.pro_tip ?? null,
  };
}

function mapDay(day) {
  return {
    id: day.day,
    slug: day.slug,
    titleEn: day.titleEn,
    titleAr: day.titleAr ?? day.title,
    title: day.title,
    goal: day.goal ?? "",
    jsonId: day.id,
  };
}

const daysCache = curriculum.days.map(mapDay);

export function getDays() {
  return daysCache;
}

export function getDay(id) {
  return daysCache.find((d) => d.id === id);
}

export function formatDayLabel(day) {
  return `Day ${String(day.id).padStart(2, "0")} — ${day.titleEn}`;
}

function getRawDay(dayId) {
  return curriculum.days.find((d) => d.day === dayId);
}

export function getCommandsForDay(dayId) {
  const raw = getRawDay(dayId);
  if (!raw) return [];
  return raw.commands.map((c) => normalizeCommandEntry(c, dayId));
}

export function getLabStepsForDay(dayId) {
  const raw = getRawDay(dayId);
  return raw?.practice ?? [];
}

export function getLabScenarioForDay(dayId) {
  const raw = getRawDay(dayId);
  return raw?.labScenario ?? null;
}

export function getCurriculumMeta() {
  return {
    schemaVersion: curriculum.schemaVersion,
    title: curriculum.title,
    language: curriculum.language,
    description: curriculum.description,
  };
}
