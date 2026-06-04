#!/usr/bin/env python3
"""Build src/data/curriculum.ar.json from terminal JSON + practice questions."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_JSON = ROOT / "scripts/curriculum-base.json"
OUT = ROOT / "src/data/curriculum.ar.json"

DAY_META = {
    1: {"titleEn": "Navigation", "slug": "navigation"},
    2: {"titleEn": "Files and Directories", "slug": "files"},
    3: {"titleEn": "Text Processing", "slug": "text"},
    4: {"titleEn": "Pipes and Redirection", "slug": "pipes"},
    5: {"titleEn": "Find and Xargs", "slug": "find-xargs"},
    6: {"titleEn": "Permissions and System", "slug": "permissions"},
    7: {"titleEn": "Scripting", "slug": "scripting"},
}

EXTRA_COMMANDS = {
    1: [
        {
            "id": "d1-echo-shell",
            "name": "echo",
            "example": "echo $SHELL",
            "flags": "$SHELL",
            "target": "None",
            "purpose": "يطبع نوع الـ Shell الحالي (zsh أو bash).",
        },
        {
            "id": "d1-uname",
            "name": "uname",
            "example": "uname -s",
            "flags": "-s",
            "target": "None",
            "purpose": "يعرض اسم نظام التشغيل: Darwin على macOS أو Linux.",
        },
        {
            "id": "d1-brew-version",
            "name": "brew",
            "example": "brew --version",
            "flags": "--version",
            "target": "None",
            "purpose": "يعرض إصدار Homebrew على macOS.",
            "platform": "macos",
        },
        {
            "id": "d1-brew-doctor",
            "name": "brew",
            "example": "brew doctor",
            "flags": "doctor",
            "target": "None",
            "purpose": "يفحص إعداد Homebrew على macOS.",
            "platform": "macos",
        },
        {
            "id": "d1-brew-install",
            "name": "brew install",
            "example": "brew install wget",
            "flags": "اسم الحزمة",
            "target": "wget",
            "purpose": "يثبت برنامجًا على macOS عبر Homebrew.",
            "platform": "macos",
        },
    ],
    2: [
        {
            "id": "d2-stat",
            "name": "stat",
            "example": "stat file.txt",
            "flags": "None",
            "target": "file.txt",
            "purpose": "يعرض معلومات تفصيلية عن الملف (حجم، أوقات، inode).",
        },
        {
            "id": "d2-rm-rf",
            "name": "rm",
            "example": "rm -rf folder",
            "flags": "-rf",
            "target": "folder",
            "purpose": "يحذف مجلدًا ومحتواه بالقوة. تحذير: حذف نهائي — تأكد من المسار.",
        },
    ],
    3: [
        {
            "id": "d3-cat-write",
            "name": "cat",
            "example": "cat > notes.txt",
            "flags": ">",
            "target": "notes.txt",
            "purpose": "ينشئ ملفًا بالكتابة المباشرة؛ Ctrl+D للإنهاء.",
        },
        {
            "id": "d3-grep-q",
            "name": "grep",
            "example": 'grep -q "ERROR" app.log',
            "flags": "-q",
            "target": '"ERROR" app.log',
            "purpose": "يبحث بصمت؛ يعتمد على exit code (0 موجود، 1 لا).",
        },
    ],
    7: [
        {
            "id": "d7-bash",
            "name": "bash",
            "example": "bash script.sh",
            "flags": "None",
            "target": "script.sh",
            "purpose": "يشغّل السكربت بدون chmod +x.",
        },
        {
            "id": "d7-echo-home",
            "name": "echo",
            "example": "echo $HOME",
            "flags": "$HOME",
            "target": "None",
            "purpose": "يعرض مسار مجلد البيت من متغير البيئة.",
        },
        {
            "id": "d7-echo-exit",
            "name": "echo",
            "example": "echo $?",
            "flags": "$?",
            "target": "None",
            "purpose": "يعرض كود خروج آخر أمر (0 نجاح).",
        },
        {
            "id": "d7-date",
            "name": "date",
            "example": 'date "+%Y-%m-%d %H:%M:%S"',
            "flags": "تنسيق",
            "target": "None",
            "purpose": "يعرض التاريخ والوقت بتنسيق strftime.",
        },
        {
            "id": "d7-date-linux",
            "name": "date",
            "example": 'date -d "tomorrow" "+%Y-%m-%d"',
            "flags": "-d",
            "target": "tomorrow",
            "purpose": "على Linux (GNU): حساب تاريخ نسبي مثل الغد.",
            "platform": "linux",
        },
        {
            "id": "d7-date-macos",
            "name": "date",
            "example": 'date -v+1d "+%Y-%m-%d"',
            "flags": "-v+1d",
            "target": "None",
            "purpose": "على macOS (BSD): إضافة يوم للتاريخ الحالي.",
            "platform": "macos",
        },
    ],
}

EXTRA_WRITING_DAY6 = [
    {
        "id": "d6w-df",
        "prompt": "اكتب الأمر لعرض مساحة الأقراص بأحجام مقروءة.",
        "answers": ["df -h"],
        "hint": "df -h",
        "explanation": "df -h يعرض استخدام القرص.",
        "relatedCommandId": "d6-df-h",
    },
    {
        "id": "d6w-du",
        "prompt": "اكتب الأمر لعرض حجم مجلد folder بشكل مختصر.",
        "answers": ["du -sh folder"],
        "hint": "du -sh",
        "explanation": "du -sh يعرض الحجم الإجمالي.",
        "relatedCommandId": "d6-du-sh-folder",
    },
    {
        "id": "d6w-ps",
        "prompt": "اكتب الأمر لعرض العمليات الجارية بتفاصيل.",
        "answers": ["ps aux"],
        "hint": "ps aux",
        "explanation": "ps aux يعرض قائمة العمليات.",
        "relatedCommandId": "d6-ps-aux",
    },
    {
        "id": "d6w-kill",
        "prompt": "اكتب الأمر لإيقاف عملية برقم PID (إشارة عادية).",
        "answers": ["kill PID", "kill 1234"],
        "hint": "kill PID",
        "explanation": "استبدل PID برقم العملية الفعلي.",
        "relatedCommandId": "d6-kill-pid",
    },
]

NAME_OVERRIDES = [
    ("command -v", "command -v"),
    ("brew install", "brew install"),
    ("#!/usr/bin/env bash", "#!/usr/bin/env bash"),
    ("set -euo pipefail", "set -euo pipefail"),
    ("command1 | command2", "|"),
    ("sudo chown -R", "chown"),
    ("sudo chown user:group", "chown"),
    ("sudo chown user", "chown"),
    ("sudo command", "sudo"),
    ("log() {", "log"),
    ("if [", "if"),
    ("for file", "for"),
    ("while read", "while"),
    ("case \"", "case"),
    ("kill -9", "kill"),
    ("sleep 100", "sleep"),
    ("ps aux |", "ps"),
    ("echo \"${1", "echo"),
    ("echo \"$0\"", "echo"),
    ("echo \"$name\"", "echo"),
    ("name=", "name"),
    ("tmpfile=", "mktemp"),
]


def infer_name(example: str) -> str:
    text = example.strip()
    for prefix, name in NAME_OVERRIDES:
        if text.startswith(prefix) or prefix in text[:20]:
            return name
    if text.startswith("|") or " | " in text and text.index(" | ") < 8:
        return "|"
    if text.startswith(">"):
        return ">"
    parts = text.split()
    if not parts:
        return text
    if parts[0] == "sudo" and len(parts) > 1:
        return parts[1] if parts[1] != "chown" else "chown"
    return parts[0]


def infer_flags_target(example: str, name: str) -> tuple[str, str]:
    text = example.strip()
    if name in ("|", ">", "if", "for", "while", "case", "sudo"):
        return "None", "None"
    if name == "echo" and "$" in text:
        m = re.search(r"\$(\?|HOME|SHELL|\{[^}]+\})", text)
        if m:
            return m.group(0), "None"
        return "متغير", "None"
    if name == "brew install":
        rest = text[len("brew install") :].strip()
        return "اسم الحزمة", rest or "None"
    if name == "command -v":
        rest = text[len("command -v") :].strip()
        return "None", rest or "None"
    if name == "chmod" and "+" in text:
        return text.split()[1] if len(text.split()) > 1 else "None", text.split()[-1]
    if name == "chmod" and text.split()[1].isdigit():
        return text.split()[1], text.split()[-1]
    parts = text.split()
    if len(parts) == 1:
        return "None", "None"
    if len(parts) == 2:
        return parts[1], "None"
    if len(parts) >= 3:
        return " ".join(parts[1:-1]), parts[-1]
    return "None", "None"


def slugify_id(day: int, example: str, idx: int) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", example.lower())[:40].strip("-")
    return f"d{day}-{base or idx}"


def enrich_command(day: int, cmd: dict, idx: int) -> dict:
    if "id" in cmd and "example" in cmd:
        out = dict(cmd)
        out.setdefault("name", cmd.get("name", infer_name(cmd["example"])))
        out.setdefault("flags", cmd.get("flags", "None"))
        out.setdefault("target", cmd.get("target", "None"))
        if "purpose" not in out and "desc" in out:
            out["purpose"] = out.pop("desc")
        return out

    legacy = cmd.get("command", "")
    example = cmd.get("example", legacy)
    purpose = cmd.get("purpose", cmd.get("desc", ""))
    name = cmd.get("name", infer_name(example))
    flags = cmd.get("flags")
    target = cmd.get("target")
    if flags is None or target is None:
        inf_f, inf_t = infer_flags_target(example, name)
        flags = flags if flags is not None else inf_f
        target = target if target is not None else inf_t

    return {
        "id": cmd.get("id", slugify_id(day, example, idx)),
        "name": name,
        "example": example,
        "flags": flags,
        "target": target,
        "purpose": purpose,
        **({k: cmd[k] for k in ("platform",) if k in cmd}),
    }


def main():
    raw = json.loads(SRC_JSON.read_text(encoding="utf-8"))

    out_days = []
    for day_obj in raw["days"]:
        d = day_obj["day"]
        meta = DAY_META[d]
        commands = []
        for idx, c in enumerate(day_obj.get("commands", [])):
            commands.append(enrich_command(d, c, idx))
        for extra in EXTRA_COMMANDS.get(d, []):
            ex = extra.get("example", extra.get("command", ""))
            if any((c.get("example") or c.get("command")) == ex for c in commands):
                continue
            commands.append(enrich_command(d, extra, len(commands)))

        out_days.append(
            {
                "day": d,
                "id": day_obj["id"],
                "title": day_obj["title"],
                "titleEn": meta["titleEn"],
                "titleAr": day_obj["title"],
                "slug": meta["slug"],
                "goal": day_obj["goal"],
                "commands": commands,
                "practice": day_obj.get("practice", []),
            }
        )

    curriculum = {
        "schemaVersion": 2,
        "title": raw["title"],
        "language": raw["language"],
        "description": raw["description"],
        "_editInstructions": "أوامر: scripts/curriculum-base.json | أسئلة: src/data/questions.v2.ar.json — ثم python3 scripts/build-curriculum-json.py",
        "_sourceOfTruth": "src/data/curriculum.ar.json",
        "_questionsSource": "src/data/questions.v2.ar.json",
        "days": out_days,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(curriculum, ensure_ascii=False, indent=2)
    OUT.write_text(text, encoding="utf-8")
    mirror = ROOT / "terminal_7_days_commands_ar.json"
    mirror.write_text(text, encoding="utf-8")
    print(f"Wrote {OUT} — {sum(len(d['commands']) for d in out_days)} commands (questions: questions.v2.ar.json)")


if __name__ == "__main__":
    main()
