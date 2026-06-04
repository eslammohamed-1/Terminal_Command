import questionsBank from "@/data/questions.v2.ar.json";

export function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getRawDay(dayId) {
  return questionsBank.days.find((d) => d.day === dayId);
}

export function getQuestionsMeta() {
  return {
    version: questionsBank.version,
    title: questionsBank.title,
    language: questionsBank.language,
    description: questionsBank.description,
    scoring: questionsBank.scoring,
    uiCopy: questionsBank.ui_copy,
  };
}

export function getQuestionDayMeta(dayId) {
  const raw = getRawDay(dayId);
  if (!raw) return null;
  return {
    day: raw.day,
    id: raw.id,
    title: raw.title,
    tags: raw.tags ?? [],
    mcqCount: raw.mcq_count ?? raw.mcq?.length ?? 0,
    typingCount: raw.typing_count ?? raw.typing?.length ?? 0,
  };
}

function normalizeMcq(q, dayId) {
  return {
    id: q.id,
    dayId,
    type: "mcq",
    prompt: q.prompt,
    options: [...(q.options ?? [])],
    answer: q.answer,
    hint: q.hint ?? "",
    explanation: q.explanation ?? "",
    difficulty: q.difficulty ?? "easy",
    points: q.points ?? 1,
    category: q.category ?? "",
    tags: q.tags ?? [],
  };
}

function normalizeTyping(q, dayId) {
  return {
    id: q.id,
    dayId,
    type: "typing",
    prompt: q.prompt,
    answers: q.accepted_answers ?? [],
    hint: q.hint ?? "",
    explanation: q.explanation ?? "",
    placeholder: q.placeholder ?? "",
    trainingLabel: q.training_label ?? "",
    caseSensitive: q.case_sensitive !== false,
    allowExtraSpaces: q.allow_extra_spaces !== false,
    difficulty: q.difficulty ?? "easy",
    points: q.points ?? 1,
    category: q.category ?? "",
    tags: q.tags ?? [],
  };
}

export function getMcqForDay(dayId) {
  const raw = getRawDay(dayId);
  if (!raw?.mcq) return [];
  return raw.mcq.map((q) => normalizeMcq({ ...q, options: q.options }, dayId));
}

export function getTypingForDay(dayId) {
  const raw = getRawDay(dayId);
  if (!raw?.typing) return [];
  return raw.typing.map((q) => normalizeTyping(q, dayId));
}

export function shuffleMcqDeck(dayId) {
  const items = getMcqForDay(dayId);
  return shuffleArray(items.map((q) => ({ ...q, options: shuffleArray([...q.options]) })));
}

export function shuffleTypingDeck(dayId) {
  return shuffleArray(getTypingForDay(dayId));
}

/** @deprecated use getTypingForDay — kept for PathHome during migration */
export function getWritingPracticeForDay(dayId) {
  return getTypingForDay(dayId);
}

export function getMcqCountForDay(dayId) {
  return getQuestionDayMeta(dayId)?.mcqCount ?? getMcqForDay(dayId).length;
}

export function getTypingCountForDay(dayId) {
  return getQuestionDayMeta(dayId)?.typingCount ?? getTypingForDay(dayId).length;
}
