const DEFAULT_FS = {
  "/": {
    type: "dir",
    children: {
      home: {
        type: "dir",
        children: {
          user: {
            type: "dir",
            children: {
              projects: {
                type: "dir",
                children: {
                  "my-app": {
                    type: "dir",
                    children: {
                      "README.md": { type: "file", content: "# My App\nTerminal learning project." },
                      "package.json": { type: "file", content: '{"name":"my-app"}' },
                      src: {
                        type: "dir",
                        children: {
                          "index.js": { type: "file", content: "console.log('hello');" },
                          "App.js": { type: "file", content: "export default function App() {}" },
                        },
                      },
                      ".env": { type: "file", content: "API_KEY=secret" },
                    },
                  },
                },
              },
              "notes.txt": { type: "file", content: "Hello from terminal!\nLine 2\nLine 3" },
              "app.log": {
                type: "file",
                content:
                  "2024-01-15 INFO Application started\n2024-01-15 ERROR Connection timeout\n2024-01-15 WARNING High memory",
              },
            },
          },
        },
      },
      etc: {
        type: "dir",
        children: {
          passwd: { type: "file", content: "root:x:0:0:root:/root:/bin/bash" },
        },
      },
      tmp: { type: "dir", children: {} },
    },
  },
};

const STATIC_RESPONSES = {
  "echo $SHELL": "/bin/zsh",
  "echo $HOME": "/home/user",
  "uname -s": "Darwin",
  "uname -a": "Darwin macbook 24.0.0 Darwin Kernel",
  "whoami": "user",
  "id": "uid=1000(user) gid=1000(user) groups=1000(user)",
  "history": "  1  pwd\n  2  ls\n  3  cd projects",
  "clear": "__CLEAR__",
  "brew --version": "Homebrew 4.2.0",
  "git status": "On branch main\nnothing to commit, working tree clean",
  "git log --oneline": "a1b2c3d Initial commit\ne4f5g6h Add README",
  "git branch": "* main\n  feature",
  "df -h": "Filesystem   Size  Used Avail Use% Mounted on\n/dev/disk1   500G  200G  300G  40% /",
  "ps aux | head -5": "USER  PID  %CPU %MEM  COMMAND\nuser  123  0.1  1.0  node",
};

function normalizePath(cwd, input) {
  const base = input.startsWith("/") ? input : `${cwd}/${input}`;
  const parts = base.split("/").filter(Boolean);
  const stack = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return `/${stack.join("/")}` || "/";
}

function getNode(fs, path) {
  const parts = path.split("/").filter(Boolean);
  let node = fs["/"];
  for (const part of parts) {
    if (!node?.children?.[part]) return null;
    node = node.children[part];
  }
  return node;
}

function listDir(node, showHidden = false, long = false) {
  if (!node?.children) return "ls: cannot access: Not a directory";
  const names = Object.keys(node.children)
    .filter((n) => showHidden || !n.startsWith("."))
    .sort();
  if (!long) return names.join("\n") || "";
  return names
    .map((name) => {
      const child = node.children[name];
      const type = child.type === "dir" ? "d" : "-";
      const perms = child.type === "dir" ? "rwxr-xr-x" : "rw-r--r--";
      const size = child.content?.length ?? 4096;
      return `${type}${perms.slice(1)}  1 user  group  ${String(size).padStart(5)} Jan 15 10:30 ${name}`;
    })
    .join("\n");
}

function readFile(node, name) {
  if (!node?.children?.[name]) return `cat: ${name}: No such file or directory`;
  const file = node.children[name];
  if (file.type !== "file") return `cat: ${name}: Is a directory`;
  return file.content;
}

export function createTerminalSession() {
  return {
    cwd: "/home/user",
    history: [],
    historyIndex: -1,
    fs: JSON.parse(JSON.stringify(DEFAULT_FS)),
  };
}

export function runSimulatedCommand(input, session) {
  const trimmed = input.trim();
  if (!trimmed) return { output: "", session };

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  if (STATIC_RESPONSES[trimmed] !== undefined) {
    return { output: STATIC_RESPONSES[trimmed], session };
  }

  if (cmd === "pwd") {
    return { output: session.cwd, session };
  }

  if (cmd === "cd") {
    const target = args[0] ?? "/home/user";
    let next;
    if (target === "~" || target === "") next = "/home/user";
    else if (target === "-") next = session.prevCwd ?? session.cwd;
    else next = normalizePath(session.cwd, target);
    const node = getNode(session.fs, next);
    if (!node || node.type !== "dir") {
      return { output: `cd: ${target}: No such file or directory`, session };
    }
    return {
      output: "",
      session: { ...session, prevCwd: session.cwd, cwd: next },
    };
  }

  if (cmd === "ls") {
    const node = getNode(session.fs, session.cwd);
    const showAll = args.includes("-a") || args.some((a) => a.includes("a"));
    const long = args.some((a) => a.startsWith("-") && a.includes("l"));
    const output = listDir(node, showAll, long);
    if (long) return { output: `total ${Object.keys(node?.children ?? {}).length}\n${output}`, session };
    return { output, session };
  }

  if (cmd === "cat") {
    const file = args[0];
    if (!file) return { output: "cat: missing file operand", session };
    const node = getNode(session.fs, session.cwd);
    const base = file.includes("/") ? file.split("/").pop() : file;
    return { output: readFile(node, base), session };
  }

  if (cmd === "grep") {
    const pattern = args.find((a) => !a.startsWith("-")) ?? "";
    const file = args[args.length - 1];
    const node = getNode(session.fs, session.cwd);
    const content = readFile(node, file);
    if (content.startsWith("cat:")) return { output: content, session };
    const lines = content.split("\n").filter((line) => line.includes(pattern.replace(/"/g, "")));
    return { output: lines.join("\n"), session };
  }

  if (cmd === "echo") {
    return { output: trimmed.slice(5).replace(/^["']|["']$/g, ""), session };
  }

  if (cmd === "find") {
  if (trimmed.includes("-name") && trimmed.includes(".log")) {
      return { output: "./app.log\n./projects/my-app/app.log", session };
    }
    if (trimmed.includes("-type f")) return { output: "./notes.txt\n./app.log\n./projects/my-app/README.md", session };
    return { output: ".", session };
  }

  if (cmd === "mkdir") {
    const name = args[args.length - 1]?.split("/").pop();
    const node = getNode(session.fs, session.cwd);
    if (node?.children && name) {
      node.children[name] = { type: "dir", children: {} };
      return { output: "", session };
    }
    return { output: `mkdir: cannot create directory '${name}'`, session };
  }

  if (cmd === "touch") {
    const name = args[0];
    const node = getNode(session.fs, session.cwd);
    if (node?.children && name) {
      node.children[name] = node.children[name] ?? { type: "file", content: "" };
      return { output: "", session };
    }
    return { output: `touch: cannot touch '${name}'`, session };
  }

  if (cmd === "clear") {
    return { output: "__CLEAR__", session };
  }

  if (cmd === "help") {
    return {
      output: "Supported: pwd, ls, cd, cat, grep, echo, find, mkdir, touch, whoami, git status, clear",
      session,
    };
  }

  return {
    output: `${cmd}: command simulated — try pwd, ls, cd, cat, grep, or git status`,
    session,
  };
}
