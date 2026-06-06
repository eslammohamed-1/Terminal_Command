const STORAGE_KEY = "terminal-path-progress";

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDayProgress(dayId) {
  const all = loadAll();
  const defaultProgress = {
    quizDone: false,
    practiceDone: false,
    quizScore: 0,
    quizTotal: 0,
    practiceScore: 0,
    practiceTotal: 0,
    labDone: false,
    labCompletedSteps: [],
  };
  return all[dayId] ? { ...defaultProgress, ...all[dayId] } : defaultProgress;
}

export function saveQuizResult(dayId, score, total) {
  const all = loadAll();
  all[dayId] = {
    ...getDayProgress(dayId),
    quizDone: true,
    quizScore: score,
    quizTotal: total,
  };
  saveAll(all);
}

export function savePracticeResult(dayId, score, total) {
  const all = loadAll();
  all[dayId] = {
    ...getDayProgress(dayId),
    practiceDone: true,
    practiceScore: score,
    practiceTotal: total,
  };
  saveAll(all);
}

export function saveLabResult(dayId, completedSteps, isDone) {
  const all = loadAll();
  all[dayId] = {
    ...getDayProgress(dayId),
    labDone: isDone,
    labCompletedSteps: completedSteps,
  };
  saveAll(all);
}

export function getDayCompletionPercent(dayId) {
  const p = getDayProgress(dayId);
  let done = 0;
  let total = 3; // Quiz, Practice, Lab
  if (p.quizDone) done += 1;
  if (p.practiceDone) done += 1;
  if (p.labDone) done += 1;
  return Math.round((done / total) * 100);
}

export function isDayFullyComplete(dayId) {
  const p = getDayProgress(dayId);
  return p.quizDone && p.practiceDone && p.labDone;
}

export function getAllProgress() {
  return loadAll();
}
