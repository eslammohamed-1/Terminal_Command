import { createContext, useContext, useState, useEffect } from "react";
import {
  getAllProgress,
  saveQuizResult,
  savePracticeResult,
  saveLabResult,
} from "@/lib/progress";

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  const refreshProgress = () => {
    setProgress(getAllProgress());
  };

  const getDayProgress = (dayId) => {
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
    return progress[dayId] ? { ...defaultProgress, ...progress[dayId] } : defaultProgress;
  };

  const getDayCompletionPercent = (dayId) => {
    const p = getDayProgress(dayId);
    let done = 0;
    const total = 3; // Quiz, Practice, Lab
    if (p.quizDone) done += 1;
    if (p.practiceDone) done += 1;
    if (p.labDone) done += 1;
    return Math.round((done / total) * 100);
  };

  const isDayFullyComplete = (dayId) => {
    const p = getDayProgress(dayId);
    return p.quizDone && p.practiceDone && p.labDone;
  };

  const saveQuiz = (dayId, score, total) => {
    saveQuizResult(dayId, score, total);
    refreshProgress();
  };

  const savePractice = (dayId, score, total) => {
    savePracticeResult(dayId, score, total);
    refreshProgress();
  };

  const saveLab = (dayId, completedSteps, isDone) => {
    saveLabResult(dayId, completedSteps, isDone);
    refreshProgress();
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        refreshProgress,
        getDayProgress,
        getDayCompletionPercent,
        isDayFullyComplete,
        saveQuiz,
        savePractice,
        saveLab,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
