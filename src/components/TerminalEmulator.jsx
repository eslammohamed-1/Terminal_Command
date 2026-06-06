import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Play, RotateCcw, X } from "lucide-react";
import { createTerminalSession, runSimulatedCommand } from "@/lib/terminalSimulation";

function OutputLine({ type, text }) {
  if (type === "input") {
    return (
      <div className="terminal-input-line" dir="ltr">
        <span className="text-emerald-400">user@learn</span>
        <span className="text-slate-500">:</span>
        <span className="text-sky-400">~</span>
        <span className="text-slate-500">$ </span>
        <span className="text-slate-100">{text}</span>
      </div>
    );
  }
  if (text === "__CLEAR__") return null;
  return (
    <pre className="terminal-output whitespace-pre-wrap" dir="ltr">
      {text}
    </pre>
  );
}

export default function TerminalEmulator({ open, onClose, suggestedCommand }) {
  const [session, setSession] = useState(() => createTerminalSession());
  const [lines, setLines] = useState([
    { type: "output", text: "Terminal simulator — type commands or use the suggested one below." },
  ]);
  const [input, setInput] = useState("");
  const [historyPos, setHistoryPos] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const execute = (raw) => {
    const command = raw.trim();
    if (!command) return;

    const nextHistory = [...session.history, command];
    const workingSession = { ...session, history: nextHistory, historyIndex: -1 };
    const { output, session: newSession } = runSimulatedCommand(command, workingSession);

    setSession(newSession);
    setHistoryPos(-1);

    if (output === "__CLEAR__") {
      setLines([{ type: "output", text: "Terminal cleared." }]);
      return;
    }

    setLines((prev) => [
      ...prev,
      { type: "input", text: command },
      ...(output ? [{ type: "output", text: output }] : []),
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    execute(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!session.history.length) return;
      const nextPos = historyPos < 0 ? session.history.length - 1 : Math.max(0, historyPos - 1);
      setHistoryPos(nextPos);
      setInput(session.history[nextPos]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPos < 0) return;
      const nextPos = historyPos + 1;
      if (nextPos >= session.history.length) {
        setHistoryPos(-1);
        setInput("");
      } else {
        setHistoryPos(nextPos);
        setInput(session.history[nextPos]);
      }
    }
  };

  const reset = () => {
    setSession(createTerminalSession());
    setLines([{ type: "output", text: "Session reset. Current dir: /home/user" }]);
    setInput("");
    setHistoryPos(-1);
  };

  const copySuggested = async () => {
    if (!suggestedCommand) return;
    await navigator.clipboard.writeText(suggestedCommand);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-2xl border border-slate-700/80 bg-slate-950 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-sm text-slate-400 mr-2">Terminal Simulator</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  aria-label="Reset terminal"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  aria-label="Close terminal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="terminal-panel flex-1 overflow-y-auto p-4 space-y-1 min-h-[240px]">
              {lines.map((line, idx) => (
                <OutputLine key={`${idx}-${line.type}`} {...line} />
              ))}
              <div ref={bottomRef} />
            </div>

            {suggestedCommand && (
              <div className="px-4 py-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">Suggested:</span>
                <code className="text-xs font-mono text-emerald-400 bg-slate-900 px-2 py-1 rounded" dir="ltr">
                  {suggestedCommand}
                </code>
                <button
                  type="button"
                  onClick={() => setInput(suggestedCommand)}
                  className="text-xs flex items-center gap-1 text-sky-400 hover:text-sky-300"
                >
                  <Play className="h-3 w-3" /> Use
                </button>
                <button
                  type="button"
                  onClick={copySuggested}
                  className="text-xs flex items-center gap-1 text-slate-400 hover:text-slate-200"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2" dir="ltr">
                <span className="text-emerald-400 font-mono text-sm shrink-0">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none font-mono text-sm text-slate-100"
                  placeholder="Type a command..."
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
