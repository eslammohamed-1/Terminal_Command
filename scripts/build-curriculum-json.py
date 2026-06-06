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
    6: {"titleEn": "Permissions and Ownership", "slug": "permissions"},
    7: {"titleEn": "System and Networking", "slug": "system"},
    8: {"titleEn": "Scripting", "slug": "scripting"},
    9: {"titleEn": "Git Essentials", "slug": "git"},
}

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
    # Git overrides
    ("git init", "git init"),
    ("git clone", "git clone"),
    ("git status", "git status"),
    ("git add .", "git add"),
    ("git add ", "git add"),
    ("git commit", "git commit"),
    ("git log", "git log"),
    ("git diff", "git diff"),
    ("git branch", "git branch"),
    ("git checkout", "git checkout"),
    ("git merge", "git merge"),
    ("git pull", "git pull"),
    ("git push", "git push"),
    ("git stash pop", "git stash pop"),
    ("git stash", "git stash"),
    ("git remote", "git remote"),
    ("git reset", "git reset"),
    ("git rebase", "git rebase"),
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
    if name == "chmod" and len(text.split()) > 1 and text.split()[1].isdigit():
        return text.split()[1], text.split()[-1]
    # Git commands
    if name.startswith("git "):
        parts = text.split()
        if len(parts) <= 2:
            return "None", "None"
        return " ".join(parts[2:]), "None"
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
        # Preserve proTip
        if "proTip" in cmd:
            out["proTip"] = cmd["proTip"]
        for field in ("useCase", "mistakes", "outputPreview", "related"):
            if field in cmd:
                out[field] = cmd[field]
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

    result = {
        "id": cmd.get("id", slugify_id(day, example, idx)),
        "name": name,
        "example": example,
        "flags": flags,
        "target": target,
        "purpose": purpose,
    }

    # Preserve proTip if present
    if "proTip" in cmd:
        result["proTip"] = cmd["proTip"]

    # Preserve platform if present
    if "platform" in cmd:
        result["platform"] = cmd["platform"]

    # Preserve rich learning fields
    for field in ("useCase", "mistakes", "outputPreview", "related"):
        if field in cmd:
            result[field] = cmd[field]

    return result


def main():
    raw = json.loads(SRC_JSON.read_text(encoding="utf-8"))

    out_days = []
    for day_obj in raw["days"]:
        d = day_obj["day"]
        meta = DAY_META.get(d, {"titleEn": f"Day {d}", "slug": f"day{d}"})
        commands = []
        for idx, c in enumerate(day_obj.get("commands", [])):
            commands.append(enrich_command(d, c, idx))

        day_entry = {
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

        # Preserve labScenario if present
        if "labScenario" in day_obj:
            day_entry["labScenario"] = day_obj["labScenario"]

        out_days.append(day_entry)

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
    print(f"✅ Wrote {OUT} — {len(out_days)} days, {sum(len(d['commands']) for d in out_days)} commands")
    for d in out_days:
        tips = sum(1 for c in d["commands"] if c.get("proTip"))
        lab = "✓" if d.get("labScenario") else "✗"
        print(f"   Day {d['day']:2d}: {len(d['commands']):2d} commands, {tips:2d} pro tips, lab scenario: {lab}")


if __name__ == "__main__":
    main()
