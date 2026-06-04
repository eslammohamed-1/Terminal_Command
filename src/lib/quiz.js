import { getCommandsForDay } from "@/data/commands";
import { getPracticeForDay } from "@/data/practiceQuestions";

export function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function normalizeAnswer(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*\|\s*/g, " | ")
    .replace(/\s*>>\s*/g, " >> ")
    .replace(/\s*>\s*/g, " > ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildQuestion(item, index, dayCommands) {
  const types = ["descToCommand", "exampleToMeaning", "commandToDesc", "targetToCommand"];
  const type = types[index % types.length];
  let question = "";
  let answer = "";
  let pool = [];

  if (type === "descToCommand") {
    question = `أي أمر/رمز يستخدم لهذا الوصف؟\n${item.desc}`;
    answer = item.command;
    pool = dayCommands.map((c) => c.command);
  } else if (type === "exampleToMeaning") {
    question = `ما وظيفة هذا الأمر؟\n${item.example}`;
    answer = item.desc;
    pool = dayCommands.map((c) => c.desc);
  } else if (type === "commandToDesc") {
    question = `اختر الشرح الصحيح للأمر/الرمز: ${item.command}`;
    answer = item.desc;
    pool = dayCommands.map((c) => c.desc);
  } else {
    question = `أي أمر يناسب الهدف/الوسيطة التالية؟\n${item.target}`;
    answer = item.command;
    pool = dayCommands.filter((c) => c.target !== "None").map((c) => c.command);
    if (pool.length === 0) pool = dayCommands.map((c) => c.command);
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
  return shuffleArray(getPracticeForDay(dayId));
}

export { getCommandsForDay, getPracticeForDay };
