import { shuffleMcqDeck, shuffleTypingDeck } from "@/lib/questionsLoader";

export { shuffleArray } from "@/lib/questionsLoader";

export function normalizeAnswer(value) {
  return value
    .trim()
    .replace(/["'](\$[A-Za-z_][A-Za-z0-9_]*)["']/g, "$1")
    .replace(/\[\s*-([fdezn])\s+("([^"]+)"|'([^']+)'|([^\]]+?))\s*\]/gi, "[ -$1 $3$4$5 ]")
    .replace(/\s*;\s*then\s*$/i, "")
    .replace(/\s*;\s*do\s*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s*\|\s*/g, " | ")
    .replace(/\s*>>\s*/g, " >> ")
    .replace(/\s*2>\s*&\s*1\s*/gi, " 2>&1 ")
    .replace(/\s*2>\s*/g, " 2> ")
    .replace(/\s*>\s*/g, " > ")
    .replace(/\s*;\s*/g, " ; ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForCompare(value, caseSensitive) {
  const n = normalizeAnswer(value);
  return caseSensitive ? n : n.toLowerCase();
}

export function matchesPracticeAnswer(typed, questionOrAnswers) {
  const answers = Array.isArray(questionOrAnswers)
    ? questionOrAnswers
    : questionOrAnswers?.answers ?? [];
  const caseSensitive = Array.isArray(questionOrAnswers)
    ? true
    : questionOrAnswers?.caseSensitive !== false;
  const allowExtraSpaces = Array.isArray(questionOrAnswers)
    ? true
    : questionOrAnswers?.allowExtraSpaces !== false;

  const normalized = normalizeForCompare(typed, caseSensitive);
  if (!allowExtraSpaces && typed.trim() !== typed.replace(/\s+/g, " ").trim()) {
    /* still allow via normalizeAnswer collapse */
  }

  return answers.some((a) => {
    const accepted = normalizeForCompare(a, caseSensitive);
    if (normalized === accepted) return true;
    if (accepted.includes("if [") && normalized === normalizeForCompare(a.replace(/;\s*then$/i, ""), caseSensitive)) {
      return true;
    }
    if (
      (accepted.includes("for ") || accepted.includes("while ")) &&
      normalized === normalizeForCompare(a.replace(/;\s*do$/i, ""), caseSensitive)
    ) {
      return true;
    }
    return false;
  });
}

export function buildQuizDeck(dayId) {
  return shuffleMcqDeck(dayId);
}

export function buildPracticeDeck(dayId) {
  return shuffleTypingDeck(dayId);
}
