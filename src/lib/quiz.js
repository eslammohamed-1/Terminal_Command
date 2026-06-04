import { getCommandsForDay, getWritingPracticeForDay } from "@/lib/curriculumLoader";

export function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

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

export function matchesPracticeAnswer(typed, acceptedAnswers) {
  const normalized = normalizeAnswer(typed);
  return acceptedAnswers.some((a) => {
    const accepted = normalizeAnswer(a);
    if (normalized === accepted) return true;
    // if: قبول الشرط بدون "; then"
    if (accepted.includes("if [") && normalized === normalizeAnswer(accepted.replace(/;\s*then$/i, ""))) {
      return true;
    }
    // for/while: قبول بدون "; do"
    if ((accepted.includes("for ") || accepted.includes("while ")) && normalized === normalizeAnswer(accepted.replace(/;\s*do$/i, ""))) {
      return true;
    }
    return false;
  });
}

/** مفتاح فريد للاختيار — يمنع التباس عدة بطاقات بنفس اسم الأمر (ls, chmod, kill). */
function optionKey(item) {
  return item.example;
}

export function buildQuestion(item, index, dayCommands) {
  const types = ["descToCommand", "exampleToMeaning", "commandToDesc", "targetToCommand"];
  const type = types[index % types.length];
  let question = "";
  let answer = "";
  let pool = [];

  if (type === "descToCommand") {
    question = `أي أمر يطابق هذا الوصف؟\n${item.desc}`;
    answer = optionKey(item);
    pool = dayCommands.map(optionKey);
  } else if (type === "exampleToMeaning") {
    question = `ما وظيفة هذا الأمر؟\n${item.example}`;
    answer = item.desc;
    pool = dayCommands.map((c) => c.desc);
  } else if (type === "commandToDesc") {
    question = `اختر الشرح الصحيح للأمر:\n${item.example}`;
    answer = item.desc;
    pool = dayCommands.map((c) => c.desc);
  } else {
    question = `أي أمر يناسب الهدف/الوسيطة التالية؟\n${item.target}`;
    answer = optionKey(item);
    const withTarget = dayCommands.filter((c) => c.target !== "None");
    pool = (withTarget.length > 0 ? withTarget : dayCommands).map(optionKey);
  }

  const wrong = shuffleArray([...new Set(pool.filter((x) => x !== answer))]).slice(0, 3);
  const options = shuffleArray([answer, ...wrong]);
  return { ...item, type, question, answer, options };
}

export function buildQuizDeck(dayId) {
  const dayCommands = getCommandsForDay(dayId);
  return shuffleArray(dayCommands).map((item, i) => buildQuestion(item, i, dayCommands));
}

export function buildPracticeDeck(dayId) {
  return shuffleArray(getWritingPracticeForDay(dayId));
}

export { getCommandsForDay, getWritingPracticeForDay as getPracticeForDay };
