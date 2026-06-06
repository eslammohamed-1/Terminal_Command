import json
from pathlib import Path

# Load original questions
ROOT = Path(__file__).resolve().parents[1]
questions_path = ROOT / "src/data/questions.v2.ar.json"
data = json.load(open(questions_path))

# Original Days
original_days = data["days"]

# Extract days 1 to 5 as-is
new_days = original_days[:5]

# --- DAY 6: Permissions & Ownership ---
# Extract permissions questions from Day 6 (original index 5)
orig_day6 = original_days[5]
day6_mcq_filtered = []
day6_typing_filtered = []

# Filter MCQ
# Permissions questions: whoami, id, ls -l permissions, chmod, chown, sudo, or safety/quoting/learning/exit-code/unix/help/scripting
permissions_tags = {"user", "permissions", "chmod", "chown", "sudo", "safety", "learning", "quoting", "exit-code", "unix", "help", "scripting"}
for q in orig_day6["mcq"]:
    q_tags = set(q["tags"])
    if q_tags.intersection(permissions_tags) or any(k in q["prompt"] for k in ["مستخدم", "صلاحيات", "ملكية", "chmod", "chown", "sudo", "whoami", "id"]):
        if not q_tags.intersection({"disk", "processes", "jobs", "grep", "sleep", "tail", "navigation"}):
            day6_mcq_filtered.append(q)

# Filter Typing
for q in orig_day6["typing"]:
    q_tags = set(q["tags"])
    if q_tags.intersection(permissions_tags) or any(k in q["prompt"] for k in ["مستخدم", "صلاحيات", "ملكية", "chmod", "chown", "sudo", "whoami", "id"]):
        if not q_tags.intersection({"disk", "processes", "jobs", "grep", "sleep", "tail", "navigation", "delete", "bash"}):
            day6_typing_filtered.append(q)

# Let's see how many we have:
print(f"Filtered Day 6 - MCQ: {len(day6_mcq_filtered)}, Typing: {len(day6_typing_filtered)}")

# Day 6 New MCQ questions to reach 30
new_day6_mcqs = [
    {
        "id": "day06-permissions-mcq-new-01",
        "type": "mcq",
        "category": "concept",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "ما معنى الرقم 7 في صلاحيات chmod (مثال: chmod 755)؟",
        "options": ["قراءة وكتابة وتنفيذ", "قراءة فقط", "كتابة وتنفيذ فقط", "تنفيذ فقط"],
        "answer": "قراءة وكتابة وتنفيذ",
        "hint": "الرقم 7 هو مجموع صلاحيات القراءة (4) والكتابة (2) والتنفيذ (1).",
        "explanation": "في نظام chmod الرقمي، 4+2+1 = 7، مما يعني الحصول على كل الصلاحيات (rwx).",
        "tags": ["chmod", "permissions"]
    },
    {
        "id": "day06-permissions-mcq-new-02",
        "type": "mcq",
        "category": "concept",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "ما هي القيمة الرقمية لصلاحية القراءة فقط (Read) في chmod؟",
        "options": ["4", "2", "1", "7"],
        "answer": "4",
        "hint": "هي القيمة الأكبر بين الصلاحيات الفردية الثلاث.",
        "explanation": "القراءة (r) تساوي 4، الكتابة (w) تساوي 2، والتنفيذ (x) يساوي 1.",
        "tags": ["chmod", "permissions"]
    },
    {
        "id": "day06-permissions-mcq-new-03",
        "type": "mcq",
        "category": "concept",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "ما هي القيمة الرقمية لصلاحية الكتابة فقط (Write) في chmod؟",
        "options": ["2", "4", "1", "6"],
        "answer": "2",
        "hint": "قيمة متوسطة بين القراءة والتنفيذ.",
        "explanation": "الكتابة (w) تساوي 2 في الترقيم الثماني لـ chmod.",
        "tags": ["chmod", "permissions"]
    },
    {
        "id": "day06-permissions-mcq-new-04",
        "type": "mcq",
        "category": "concept",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "ما هي القيمة الرقمية لصلاحية التنفيذ فقط (Execute) في chmod؟",
        "options": ["1", "2", "4", "7"],
        "answer": "1",
        "hint": "أقل قيمة بين الصلاحيات الثلاث.",
        "explanation": "التنفيذ (x) يساوي 1 في الترقيم الثماني لـ chmod.",
        "tags": ["chmod", "permissions"]
    },
    {
        "id": "day06-permissions-mcq-new-05",
        "type": "mcq",
        "category": "scenario",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "إذا كنت تريد تغيير مالك مجلد وكل الملفات التي بداخله بالكامل، ما الخيار الذي يجب استخدامه مع chown؟",
        "options": ["-R", "-r", "-f", "-a"],
        "answer": "-R",
        "hint": "يرمز إلى كلمة Recursive (تكراري).",
        "explanation": "الخيار -R (كابيتال) يقوم بتطبيق التغيير بشكل تكراري على المجلد ومحتوياته بالكامل.",
        "tags": ["chown", "recursive"]
    },
    {
        "id": "day06-permissions-mcq-new-06",
        "type": "mcq",
        "category": "concept",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "prompt": "إذا رأيت الصلاحيات التالية '-rwxr-xr-x' لملف، ماذا تعني؟",
        "options": [
            "الملف قابل للقراءة والكتابة والتنفيذ للمالك، وقابل للقراءة والتنفيذ للمجموعة والآخرين",
            "الملف قابل للقراءة فقط للجميع ومفتوح للكتابة للمالك فقط",
            "الملف قابل للتنفيذ فقط للمالك والمجموعة والآخرين ليس لديهم أي صلاحية",
            "لا توجد صلاحيات على الإطلاق للملف"
        ],
        "answer": "الملف قابل للقراءة والكتابة والتنفيذ للمالك، وقابل للقراءة والتنفيذ للمجموعة والآخرين",
        "hint": "قسّم الرموز الثلاثية: rwx للمالك، r-x للمجموعة، r-x للآخرين.",
        "explanation": "rwx (قراءة وكتابة وتنفيذ للمالك)، r-x (قراءة وتنفيذ للمجموعة)، r-x (قراءة وتنفيذ للآخرين).",
        "tags": ["permissions"]
    },
    {
        "id": "day06-permissions-mcq-new-07",
        "type": "mcq",
        "category": "concept",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "ماذا تعني صلاحيات الملف '-rw-r--r--'؟",
        "options": [
            "قراءة وكتابة للمالك، وقراءة فقط للمجموعة والآخرين",
            "قراءة وكتابة وتعديل للجميع دون استثناء",
            "قراءة فقط للمالك، ولا صلاحيات للمجموعة والآخرين",
            "الملف للقراءة والكتابة للمالك والمجموعة والآخرين"
        ],
        "answer": "قراءة وكتابة للمالك، وقراءة فقط للمجموعة والآخرين",
        "hint": "rw- تعني قراءة وكتابة للمالك، و r-- تعني قراءة فقط للمجموعة والآخرين.",
        "explanation": "الملف يمنح المالك قراءة وكتابة (rw-)، بينما يمنح المجموعة والآخرين قراءة فقط (r--).",
        "tags": ["permissions"]
    },
    {
        "id": "day06-permissions-mcq-new-08",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "أي خيار في chmod يضيف صلاحية التنفيذ للجميع (All)؟",
        "options": ["a+x", "u+x", "g+x", "o+x"],
        "answer": "a+x",
        "hint": "All تعني الجميع ويرمز لها بالحرف a.",
        "explanation": "الأمر chmod a+x أو chmod +x يضيف صلاحية التنفيذ لجميع الفئات (المالك والمجموعة والآخرين).",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-mcq-new-09",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "أي خيار في chmod يزيل صلاحية الكتابة للمالك (User)؟",
        "options": ["u-w", "g-w", "o-w", "a-w"],
        "answer": "u-w",
        "hint": "User (المالك) يرمز له بـ u والكتابة (Write) بـ w.",
        "explanation": "chmod u-w يزيل صلاحية الكتابة (w) عن المستخدم المالك (u) للملف.",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-mcq-new-10",
        "type": "mcq",
        "category": "scenario",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "prompt": "ماذا يحدث عند تنفيذ الأمر chmod 400 private.key؟",
        "options": [
            "يصبح الملف مقروءاً للمالك فقط، وممنوعاً عن المجموعة والآخرين تماماً",
            "يصبح الملف قابلاً للكتابة فقط للمالك ومغلقاً عن البقية",
            "يمنح الجميع صلاحية التنفيذ والقراءة للملف",
            "يحذف الملف نهائياً لتأمين المفتاح"
        ],
        "answer": "يصبح الملف مقروءاً للمالك فقط، وممنوعاً عن المجموعة والآخرين تماماً",
        "hint": "4 للمالك (قراءة)، 0 للمجموعة (لا شيء)، 0 للآخرين (لا شيء).",
        "explanation": "chmod 400 يعطي المالك فقط صلاحية القراءة (4)، ويمنع المجموعات والآخرين من القراءة أو التعديل أو التنفيذ (00).",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-mcq-new-11",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "ما هو الأمر المناسب لتغيير المجموعة المالكة لملف فقط دون تغيير المستخدم؟",
        "options": ["chown :groupname file.txt", "chown groupname file.txt", "chmod groupname file.txt", "chown groupname: file.txt"],
        "answer": "chown :groupname file.txt",
        "hint": "نضع نقطتين (:) قبل اسم المجموعة للإشارة إليها في chown.",
        "explanation": "الأمر chown :groupname يغير المجموعة المالكة للملف، أو يمكن استخدام الأمر chgrp.",
        "tags": ["chown"]
    }
]

# Slice to exactly 30 questions
day6_mcq = (day6_mcq_filtered + new_day6_mcqs)[:30]
# Ensure we have exactly 30 questions
while len(day6_mcq) < 30:
    idx = len(day6_mcq) - len(day6_mcq_filtered)
    dupe = day6_mcq_filtered[idx % len(day6_mcq_filtered)].copy()
    dupe["id"] = f"day06-permissions-mcq-dup-{idx}"
    day6_mcq.append(dupe)

# Day 6 New Typing questions to reach 30
new_day6_typings = [
    {
        "id": "day06-permissions-typing-new-01",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لتغيير مالك ملف باسم config.json إلى المستخدم webuser.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["sudo chown webuser config.json", "chown webuser config.json"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم chown لتغيير المالك.",
        "explanation": "الإجابة: chown webuser config.json",
        "tags": ["chown"]
    },
    {
        "id": "day06-permissions-typing-new-02",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لتغيير مالك ملف data.txt إلى ahmed والمجموعة إلى developers.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["sudo chown ahmed:developers data.txt", "chown ahmed:developers data.txt"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم صيغة owner:group مع chown.",
        "explanation": "الإجابة: chown ahmed:developers data.txt",
        "tags": ["chown"]
    },
    {
        "id": "day06-permissions-typing-new-03",
        "type": "typing",
        "category": "write_command",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لتغيير ملكية مجلد project ومحتوياته بالكامل (Recursive) إلى المستخدم root والمجموعة root.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["sudo chown -R root:root project", "chown -R root:root project"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم الخيار -R للتكرار و root:root كمالك ومجموعة.",
        "explanation": "الإجابة: chown -R root:root project",
        "tags": ["chown", "recursive"]
    },
    {
        "id": "day06-permissions-typing-new-04",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب أمر chmod لمنح ملف note.txt صلاحيات القراءة والكتابة للمالك، والقراءة فقط للمجموعة والآخرين (باستخدام الأرقام).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod 644 note.txt"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "القراءة والكتابة هي 6، والقراءة فقط هي 4.",
        "explanation": "الإجابة: chmod 644 note.txt",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-typing-new-05",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب أمر chmod لمنح ملف script.sh صلاحيات كاملة للمالك، وقراءة وتنفيذ للمجموعة والآخرين (باستخدام الأرقام).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod 755 script.sh"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الصلاحيات الكاملة هي 7، والقراءة والتنفيذ هي 5.",
        "explanation": "الإجابة: chmod 755 script.sh",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-typing-new-06",
        "type": "typing",
        "category": "write_command",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب أمر chmod لحجب كل الصلاحيات عن ملف secret.txt للمجموعة والآخرين، وإعطاء قراءة وكتابة للمالك فقط (رقمي).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod 600 secret.txt"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "قراءة وكتابة هي 6، وحجب الصلاحيات هو 0.",
        "explanation": "الإجابة: chmod 600 secret.txt",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-typing-new-07",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لتغيير المجموعة المالكة لملف report.pdf إلى group1 (باستخدام chown).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["sudo chown :group1 report.pdf", "chown :group1 report.pdf"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم chown مع نقطتين قبل المجموعة :group1",
        "explanation": "الإجابة: chown :group1 report.pdf",
        "tags": ["chown"]
    },
    {
        "id": "day06-permissions-typing-new-08",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لعرض الصلاحيات والملكية لملف محدد باسم server.js.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["ls -l server.js"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم خيار ls -l لعرض الصلاحيات وحدد الملف.",
        "explanation": "الإجابة: ls -l server.js",
        "tags": ["permissions"]
    },
    {
        "id": "day06-permissions-typing-new-09",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لتشغيل rm -rf /data كمدير لتفادي مشكلة الصلاحيات.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["sudo rm -rf /data"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم sudo قبل الأمر.",
        "explanation": "الإجابة: sudo rm -rf /data",
        "tags": ["sudo"]
    },
    {
        "id": "day06-permissions-typing-new-10",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب أمر chmod لإزالة صلاحية الكتابة (Write) من الآخرين (Others) لملف document.txt.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod o-w document.txt"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الآخرين هم o والكتابة w وعلامة الإزالة هي -.",
        "explanation": "الإجابة: chmod o-w document.txt",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-typing-new-11",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب أمر chmod لإضافة صلاحية القراءة (Read) للجميع لملف readme.md.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod +r readme.md", "chmod a+r readme.md"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "إضافة صلاحية القراءة للجميع تكون بـ +r أو a+r.",
        "explanation": "الإجابة: chmod +r readme.md",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-typing-new-12",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب أمر chmod لمنح المالك (User) صلاحية التنفيذ لملف test.sh (رمزي).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod u+x test.sh"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "المالك هو u والتنفيذ x والإضافة +.",
        "explanation": "الإجابة: chmod u+x test.sh",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-typing-new-13",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لعرض اسم المستخدم الحالي الذي تعمل به الآن.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["whoami"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "من أنا؟ بالأول والأخير.",
        "explanation": "الإجابة: whoami",
        "tags": ["user"]
    },
    {
        "id": "day06-permissions-typing-new-14",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر الذي يعرض تفاصيل الـ UID والـ GID للمستخدم الحالي.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["id"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "كلمة قصيرة من حرفين تعبر عن الهوية.",
        "explanation": "الإجابة: id",
        "tags": ["user"]
    },
    {
        "id": "day06-permissions-typing-new-15",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لعرض المجموعات (groups) التي ينتمي إليها المستخدم الحالي.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["groups"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "جمع كلمة مجموعة بالإنجليزية.",
        "explanation": "الإجابة: groups",
        "tags": ["user"]
    },
    {
        "id": "day06-permissions-typing-new-16",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لتغيير صلاحية ملف script.sh بإضافة صلاحية القراءة للمجموعة (g).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod g+r script.sh"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "المجموعة g والإضافة + والقراءة r.",
        "explanation": "الإجابة: chmod g+r script.sh",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-typing-new-17",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لتغيير صلاحية ملف script.sh بإزالة صلاحية الكتابة للمالك (u).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod u-w script.sh"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "المالك u والإزالة - والكتابة w.",
        "explanation": "الإجابة: chmod u-w script.sh",
        "tags": ["chmod"]
    },
    {
        "id": "day06-permissions-typing-new-18",
        "type": "typing",
        "category": "write_command",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب أمر chmod لإعطاء صلاحية القراءة والكتابة والتنفيذ للمالك فقط لملف private.sh (رقمي).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["chmod 700 private.sh"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "7 للمالك، و 0 للمجموعة، و 0 للآخرين.",
        "explanation": "الإجابة: chmod 700 private.sh",
        "tags": ["chmod"]
    }
]

# Slice to exactly 30 typing questions
day6_typing = (day6_typing_filtered + new_day6_typings)[:30]
while len(day6_typing) < 30:
    idx = len(day6_typing) - len(day6_typing_filtered)
    dupe = day6_typing_filtered[idx % len(day6_typing_filtered)].copy()
    dupe["id"] = f"day06-permissions-typing-dup-{idx}"
    day6_typing.append(dupe)

# Renumber IDs in Day 6 to use "day06-permissions"
for i, q in enumerate(day6_mcq):
    q["id"] = f"day06-permissions-mcq-{i+1:02d}"
for i, q in enumerate(day6_typing):
    q["id"] = f"day06-permissions-typing-{i+1:02d}"
    q["training_label"] = f"تدريب {i+1} من 30"

day6_obj = {
    "day": 6,
    "id": "day06-permissions",
    "title": "الصلاحيات والملكية",
    "tags": ["permissions", "chmod", "chown", "sudo"],
    "mcq_count": 30,
    "typing_count": 30,
    "mcq": day6_mcq,
    "typing": day6_typing
}
new_days.append(day6_obj)


# --- DAY 7: System Monitoring & Networking ---
day7_mcq_filtered = []
day7_typing_filtered = []

# Extract from original Day 6
system_tags = {"disk", "processes", "jobs", "grep", "sleep", "tail", "navigation"}
for q in orig_day6["mcq"]:
    q_tags = set(q["tags"])
    if q_tags.intersection(system_tags) or any(k in q["prompt"] for k in ["أقراص", "حجم مجلد", "عمليات", "kill", "top", "nginx", "خلفية", "&"]):
        if not q_tags.intersection({"chmod", "chown", "sudo", "user", "permissions"}):
            day7_mcq_filtered.append(q)

for q in orig_day6["typing"]:
    q_tags = set(q["tags"])
    if q_tags.intersection(system_tags) or any(k in q["prompt"] for k in ["أقراص", "حجم مجلد", "عمليات", "kill", "top", "nginx", "خلفية", "&"]):
        if not q_tags.intersection({"chmod", "chown", "sudo", "user", "permissions"}):
            day7_typing_filtered.append(q)

print(f"Filtered Day 7 - MCQ: {len(day7_mcq_filtered)}, Typing: {len(day7_typing_filtered)}")

new_day7_mcqs = [
    {
        "id": "day07-system-mcq-new-01",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "كيف ترسل طلب HTTP GET لرؤية الـ Headers فقط الخاصة بموقع معين باستخدام curl؟",
        "options": ["curl -I URL", "curl -X POST URL", "curl -d URL", "curl -v URL"],
        "answer": "curl -I URL",
        "hint": "الخيار هو حرف I كابيتال (من Information أو Info).",
        "explanation": "curl -I (أو --head) يرسل طلب GET ويستقبل فقط الـ HTTP headers دون المحتوى.",
        "tags": ["curl", "networking"]
    },
    {
        "id": "day07-system-mcq-new-02",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "ما الأمر المستخدم لإرسال طلب HTTP POST باستخدام curl؟",
        "options": ["curl -X POST URL", "curl -I URL", "curl -G URL", "curl -delete URL"],
        "answer": "curl -X POST URL",
        "hint": "نستخدم الخيار -X لتحديد ميثود الطلب مثل POST.",
        "explanation": "curl -X POST يستخدم لإرسال طلبات من نوع POST للسيرفر.",
        "tags": ["curl", "networking"]
    },
    {
        "id": "day07-system-mcq-new-03",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي أمر يرسل 4 حزم بيانات للتأكد من الاتصال بموقع google.com؟",
        "options": ["ping -c 4 google.com", "ping google.com", "curl google.com", "traceroute google.com"],
        "answer": "ping -c 4 google.com",
        "hint": "الخيار -c يحدد الـ count (العدد).",
        "explanation": "ping -c 4 يرسل 4 طلبات صدى (echo requests) فقط ثم يتوقف تلقائياً.",
        "tags": ["ping", "networking"]
    },
    {
        "id": "day07-system-mcq-new-04",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "prompt": "كيف تجد العملية (process) التي تستخدم المنفذ (port) 3000 حالياً؟",
        "options": ["lsof -i :3000", "ps aux :3000", "netstat 3000", "kill :3000"],
        "answer": "lsof -i :3000",
        "hint": "الأمر يعني list open files والمنفذ يسبق بنقطتين فوق بعض.",
        "explanation": "الأمر lsof -i :3000 يعرض العمليات المتصلة بالمنفذ 3000.",
        "tags": ["lsof", "networking"]
    },
    {
        "id": "day07-system-mcq-new-05",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "كيف تعرض جميع متغيرات البيئة (environment variables) الحالية؟",
        "options": ["printenv", "echo $VAR", "env -show", "setenv"],
        "answer": "printenv",
        "hint": "الكلمة تعني طباعة البيئة (print environment).",
        "explanation": "الأمر printenv أو env يطبع جميع متغيرات البيئة الحالية في الـ shell.",
        "tags": ["environment"]
    },
    {
        "id": "day07-system-mcq-new-06",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "أي أمر لإنشاء أو تصدير متغير بيئة جديد ليصبح متاحاً للأوامر والعمليات الفرعية؟",
        "options": ["export MY_VAR=\"value\"", "set MY_VAR=\"value\"", "MY_VAR=\"value\"", "env MY_VAR=\"value\""],
        "answer": "export MY_VAR=\"value\"",
        "hint": "الأمر يعني تصدير (export).",
        "explanation": "استخدام export يجعل المتغير متاحاً لجميع العمليات والسكربتات الفرعية التي يتم تشغيلها من هذا الـ session.",
        "tags": ["environment"]
    },
    {
        "id": "day07-system-mcq-new-07",
        "type": "mcq",
        "category": "concept",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "prompt": "أي إشارة (signal) يرسلها الأمر kill -9 للمشروع لإنهاء العملية فوراً ودون شروط؟",
        "options": ["SIGKILL", "SIGTERM", "SIGINT", "SIGHUP"],
        "answer": "SIGKILL",
        "hint": "الإيقاف القهري الفوري يسمى قتل (KILL).",
        "explanation": "الإشارة 9 هي SIGKILL، وهي تجبر النظام على إنهاء العملية فوراً وتمنعها من القيام بأي عمليات تنظيف.",
        "tags": ["kill", "processes"]
    },
    {
        "id": "day07-system-mcq-new-08",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "ما الأمر الذي يعرض جميع المهام (jobs) التي تعمل حالياً في الخلفية أو متوقفة؟",
        "options": ["jobs", "ps aux", "bg", "fg"],
        "answer": "jobs",
        "hint": "يعرض قائمة بالمهام التابعة للـ terminal session الحالي.",
        "explanation": "الأمر jobs يعرض المهام الحالية ورقمهما وحالتها (Running/Stopped) في الخلفية.",
        "tags": ["jobs"]
    },
    {
        "id": "day07-system-mcq-new-09",
        "type": "mcq",
        "category": "scenario",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "إذا كان لديك عملية متوقفة في الخلفية، كيف تعيد تشغيلها لتستمر بالعمل في الخلفية؟",
        "options": ["bg %1", "fg %1", "jobs %1", "kill %1"],
        "answer": "bg %1",
        "hint": "bg هي اختصار لـ background.",
        "explanation": "الأمر bg (background) يعيد تشغيل المهمة المتوقفة لتستمر في الخلفية دون حجز التيرمنال.",
        "tags": ["jobs"]
    },
    {
        "id": "day07-system-mcq-new-10",
        "type": "mcq",
        "category": "scenario",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "كيف تنقل عملية تعمل في الخلفية لتصبح في الواجهة (Foreground) للتحكم فيها؟",
        "options": ["fg %1", "bg %1", "jobs %1", "run %1"],
        "answer": "fg %1",
        "hint": "fg هي اختصار لـ foreground.",
        "explanation": "الأمر fg (foreground) يجلب المهمة من الخلفية إلى الواجهة لتتفاعل معها.",
        "tags": ["jobs"]
    },
    {
        "id": "day07-system-mcq-new-11",
        "type": "mcq",
        "category": "concept",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "ما وظيفة الأمر sleep 100؟",
        "options": ["إيقاف التيرمنال مؤقتاً لمدة 100 ثانية", "إطفاء الجهاز بعد 100 ثانية", "تكرار الأمر 100 مرة", "عرض آخر 100 سطر"],
        "answer": "إيقاف التيرمنال مؤقتاً لمدة 100 ثانية",
        "hint": "sleep تعني النوم أو الانتظار.",
        "explanation": "sleep يقوم بتعليق تنفيذ الأوامر في الـ terminal لمدة محددة من الثواني.",
        "tags": ["sleep"]
    },
    {
        "id": "day07-system-mcq-new-12",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي خيار في ping يحدد عدد الحزم المرسلة (مثال: 4 حزم فقط)؟",
        "options": ["-c", "-n", "-t", "-p"],
        "answer": "-c",
        "hint": "اختصار لـ count.",
        "explanation": "-c تحدد عدد الطلبات المرسلة، فمثلاً ping -c 4 يرسل 4 حزم فقط.",
        "tags": ["ping"]
    },
    {
        "id": "day07-system-mcq-new-13",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "كيف تقرأ قيمة متغير بيئة محدد باسم USER؟",
        "options": ["echo $USER", "printenv $USER", "read USER", "get USER"],
        "answer": "echo $USER",
        "hint": "نستخدم علامة الدولار ($) قبل اسم المتغير لقراءة قيمته.",
        "explanation": "echo $USER يعرض محتوى متغير البيئة USER وهو اسم المستخدم الحالي.",
        "tags": ["environment"]
    },
    {
        "id": "day07-system-mcq-new-14",
        "type": "mcq",
        "category": "concept",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "ما الفرق الأساسي بين printenv و export؟",
        "options": [
            "printenv يعرض المتغيرات بينما export ينشئ/يصدر متغير بيئة جديد",
            "لا يوجد فرق بينهما فهما نفس الأمر",
            "printenv للمجلدات و export للملفات",
            "export للعمليات فقط و printenv للشبكة"
        ],
        "answer": "printenv يعرض المتغيرات بينما export ينشئ/يصدر متغير بيئة جديد",
        "hint": "أحدهما للقراءة والآخر للكتابة والتصدير.",
        "explanation": "printenv يستخدم لعرض المتغيرات الحالية، بينما export يستخدم لتعريف وتصدير متغير بيئة جديد.",
        "tags": ["environment"]
    },
    {
        "id": "day07-system-mcq-new-15",
        "type": "mcq",
        "category": "concept",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "ماذا يعرض العمود PID في مخرجات ps aux أو top؟",
        "options": ["المعرف الرقمي الفريد للعملية (Process ID)", "اسم المالك للعملية", "نسبة استهلاك الذاكرة", "نسبة استهلاك المعالج"],
        "answer": "المعرف الرقمي الفريد للعملية (Process ID)",
        "hint": "ID تعني معرف، و P تعني Process.",
        "explanation": "PID هو Process ID، وهو رقم فريد يسنده نظام التشغيل لكل عملية جارية لتحديد هويتها.",
        "tags": ["processes"]
    },
    {
        "id": "day07-system-mcq-new-16",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي أمر يظهر الـ headers الخاصة بطلب GET لموقع api.github.com؟",
        "options": ["curl -I https://api.github.com", "curl -X POST https://api.github.com", "ping https://api.github.com", "lsof -i https://api.github.com"],
        "answer": "curl -I https://api.github.com",
        "hint": "نستخدم curl مع خيار -I لجلب الـ HTTP headers فقط.",
        "explanation": "curl -I يرسل طلب GET للسيرفر ويطلب الـ headers فقط دون تحميل محتوى الصفحة.",
        "tags": ["curl", "networking"]
    },
    {
        "id": "day07-system-mcq-new-17",
        "type": "mcq",
        "category": "scenario",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "prompt": "إذا كان هناك برنامج Node.js يرفض البدء لأن البورت 8080 محجوز، أي أمر يساعدك في معرفة السبب؟",
        "options": ["lsof -i :8080", "ps aux | grep 8080", "kill 8080", "ping localhost:8080"],
        "answer": "lsof -i :8080",
        "hint": "الأمر lsof مع خيار -i يبحث عن اتصالات الشبكة والمنف.",
        "explanation": "lsof -i :8080 يعرض تفاصيل العملية التي تستخدم المنف 8080 لتتمكن من معرفتها أو إيقافها.",
        "tags": ["lsof", "networking"]
    }
]

# Slice to exactly 30 questions
day7_mcq = (day7_mcq_filtered + new_day7_mcqs)[:30]
while len(day7_mcq) < 30:
    idx = len(day7_mcq) - len(day7_mcq_filtered)
    dupe = day7_mcq_filtered[idx % len(day7_mcq_filtered)].copy()
    dupe["id"] = f"day07-system-mcq-dup-{idx}"
    day7_mcq.append(dupe)

new_day7_typings = [
    {
        "id": "day07-system-typing-new-01",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لإرسال 4 حزم ping لموقع google.com للتأكد من جودة الاتصال.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["ping -c 4 google.com"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم ping مع خيار -c 4.",
        "explanation": "الإجابة: ping -c 4 google.com",
        "tags": ["ping", "networking"]
    },
    {
        "id": "day07-system-typing-new-02",
        "type": "typing",
        "category": "write_command",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لمعرفة العملية التي تحجز المنفذ (port) 8080.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["lsof -i :8080"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم lsof مع خيار -i :8080.",
        "explanation": "الإجابة: lsof -i :8080",
        "tags": ["lsof", "networking"]
    },
    {
        "id": "day07-system-typing-new-03",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لعرض جميع متغيرات البيئة الحالية.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["printenv", "env"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الأمر هو printenv.",
        "explanation": "الإجابة: printenv",
        "tags": ["environment"]
    },
    {
        "id": "day07-system-typing-new-04",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لإنشاء وتصدير متغير بيئة باسم NODE_ENV وقيمته production.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["export NODE_ENV=\"production\"", "export NODE_ENV='production'", "export NODE_ENV=production"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم الأمر export لإنشاء المتغير.",
        "explanation": "الإجابة: export NODE_ENV=\"production\"",
        "tags": ["environment"]
    },
    {
        "id": "day07-system-typing-new-05",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لعرض الـ headers فقط لموقع https://example.com باستخدام curl.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["curl -I https://example.com"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم curl مع خيار -I (كابيتال).",
        "explanation": "الإجابة: curl -I https://example.com",
        "tags": ["curl", "networking"]
    },
    {
        "id": "day07-system-typing-new-06",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لإرسال طلب POST لموقع https://api.example.com/login باستخدام curl.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["curl -X POST https://api.example.com/login"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم الخيار -X POST لتحديد نوع الطلب.",
        "explanation": "الإجابة: curl -X POST https://api.example.com/login",
        "tags": ["curl", "networking"]
    },
    {
        "id": "day07-system-typing-new-07",
        "type": "typing",
        "category": "write_command",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لقتل العملية رقم 9999 فوراً ودون شروط (إيقاف قوي).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["kill -9 9999"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم kill مع إشارة الموت القهري -9.",
        "explanation": "الإجابة: kill -9 9999",
        "tags": ["kill", "processes"]
    },
    {
        "id": "day07-system-typing-new-08",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لعرض المهام (jobs) التي تعمل في الخلفية حالياً.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["jobs"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الأمر هو jobs.",
        "explanation": "الإجابة: jobs",
        "tags": ["jobs"]
    },
    {
        "id": "day07-system-typing-new-09",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لإعادة إحياء المهمة رقم 1 المتوقفة في الخلفية لتستمر في الخلفية (background).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["bg %1"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "bg تعني background، واستخدم %1 لتحديد المهمة الأولى.",
        "explanation": "الإجابة: bg %1",
        "tags": ["jobs"]
    },
    {
        "id": "day07-system-typing-new-10",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لجلب المهمة رقم 2 من الخلفية لتشغيلها في الواجهة (foreground).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["fg %2"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "fg تعني foreground، واستخدم %2 للمهمة الثانية.",
        "explanation": "الإجابة: fg %2",
        "tags": ["jobs"]
    },
    {
        "id": "day07-system-typing-new-11",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لتشغيل السكربت backup.sh في الخلفية مباشرة.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["./backup.sh &", "bash backup.sh &"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "نضيف علامة & في نهاية الأمر لتشغيله في الخلفية.",
        "explanation": "الإجابة: ./backup.sh &",
        "tags": ["jobs"]
    },
    {
        "id": "day07-system-typing-new-12",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لعرض قيمة متغير البيئة PATH.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["echo $PATH"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم echo وعلامة الدولار قبل PATH.",
        "explanation": "الإجابة: echo $PATH",
        "tags": ["environment"]
    },
    {
        "id": "day07-system-typing-new-13",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر للبحث عن عملية node داخل قائمة العمليات النشطة.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["ps aux | grep node"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم ps aux ثم مررها بـ pipe لـ grep node.",
        "explanation": "الإجابة: ps aux | grep node",
        "tags": ["processes"]
    },
    {
        "id": "day07-system-typing-new-14",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لإنهاء العملية التي تحمل الرقم 1234 بطريقة لطيفة.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["kill 1234"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم kill مع رقم العملية.",
        "explanation": "الإجابة: kill 1234",
        "tags": ["kill", "processes"]
    },
    {
        "id": "day07-system-typing-new-15",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لمراقبة العمليات الجارية واستهلاك المعالج والذاكرة لحظة بلحظة.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["top"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الأمر هو top.",
        "explanation": "الإجابة: top",
        "tags": ["processes"]
    },
    {
        "id": "day07-system-typing-new-16",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لمعرفة الحجم الإجمالي للمجلد الحالي فقط بشكل مقروء.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["du -sh", "du -sh ."],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم du مع خياري -s للتلخيص و -h للأحجام المقروءة.",
        "explanation": "الإجابة: du -sh",
        "tags": ["disk"]
    },
    {
        "id": "day07-system-typing-new-17",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لإرسال طلب GET لموقع google.com وحفظ النتيجة في ملف page.html (باستخدام redirection).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["curl google.com > page.html", "curl -o page.html google.com"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم curl google.com مع علامة redirection > لحفظ الناتج.",
        "explanation": "الإجابة: curl google.com > page.html",
        "tags": ["curl", "networking"]
    },
    {
        "id": "day07-system-typing-new-18",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لعرض حجم كل عنصر داخل المجلد الحالي بالتفصيل وبشكل مقروء.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["du -sh *"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم du -sh مع علامة النجمة * لتشمل كل العناصر.",
        "explanation": "الإجابة: du -sh *",
        "tags": ["disk"]
    },
    {
        "id": "day07-system-typing-new-19",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب جديد",
        "prompt": "اكتب الأمر لإيقاف التيرمنال مؤقتاً لمدة 50 ثانية.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["sleep 50"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم sleep مع الرقم 50.",
        "explanation": "الإجابة: sleep 50",
        "tags": ["sleep"]
    }
]

# Slice to exactly 30 typing questions
day7_typing = (day7_typing_filtered + new_day7_typings)[:30]
while len(day7_typing) < 30:
    idx = len(day7_typing) - len(day7_typing_filtered)
    dupe = day7_typing_filtered[idx % len(day7_typing_filtered)].copy()
    dupe["id"] = f"day07-system-typing-dup-{idx}"
    day7_typing.append(dupe)

# Renumber IDs in Day 7
for i, q in enumerate(day7_mcq):
    q["id"] = f"day07-system-mcq-{i+1:02d}"
for i, q in enumerate(day7_typing):
    q["id"] = f"day07-system-typing-{i+1:02d}"
    q["training_label"] = f"تدريب {i+1} من 30"

day7_obj = {
    "day": 7,
    "id": "day07-system",
    "title": "مراقبة النظام والشبكات",
    "tags": ["system", "processes", "disk", "networking"],
    "mcq_count": 30,
    "typing_count": 30,
    "mcq": day7_mcq,
    "typing": day7_typing
}
new_days.append(day7_obj)


# --- DAY 8: Scripting (Old Day 7) ---
orig_day7 = original_days[6]
# Renumber Day 7 to Day 8
day8_mcq = []
for i, q in enumerate(orig_day7["mcq"]):
    q_new = q.copy()
    q_new["id"] = f"day08-scripting-mcq-{i+1:02d}"
    day8_mcq.append(q_new)

day8_typing = []
for i, q in enumerate(orig_day7["typing"]):
    q_new = q.copy()
    q_new["id"] = f"day08-scripting-typing-{i+1:02d}"
    q_new["training_label"] = f"تدريب {i+1} من 30"
    day8_typing.append(q_new)

day8_obj = {
    "day": 8,
    "id": "day08-scripting",
    "title": orig_day7["title"],
    "tags": orig_day7["tags"],
    "mcq_count": 30,
    "typing_count": 30,
    "mcq": day8_mcq,
    "typing": day8_typing
}
new_days.append(day8_obj)


# --- DAY 9: Git Essentials ---
git_mcqs = [
    {
        "id": "day09-git-mcq-01",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي أمر يبدأ مشروع Git جديد في المجلد الحالي؟",
        "options": ["git init", "git clone URL", "git status", "git add ."],
        "answer": "git init",
        "hint": "ده أول أمر بتستخدمه لما تبدأ مشروع جديد.",
        "explanation": "git init بينشئ repository جديد في المجلد الحالي.",
        "tags": ["git", "init"]
    },
    {
        "id": "day09-git-mcq-02",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "كيف تنسخ repository موجود من GitHub على جهازك؟",
        "options": ["git clone URL", "git pull URL", "git init URL", "git checkout URL"],
        "answer": "git clone URL",
        "hint": "الكلمة تعني استنساخ بالإنجليزية.",
        "explanation": "git clone URL بيعمل نسخة كاملة من الـ repo على جهازك في مجلد جديد.",
        "tags": ["git", "clone"]
    },
    {
        "id": "day09-git-mcq-03",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي أمر يعرض حالة الملفات الحالية لمعرفة ما إذا كان هناك تعديلات غير محفوظة؟",
        "options": ["git status", "git diff", "git log", "git show"],
        "answer": "git status",
        "hint": "الكلمة تعني حالة بالإنجليزية.",
        "explanation": "git status بيوريك الملفات المعدلة، والملفات المستعدة للـ commit، والملفات غير المتتبعة.",
        "tags": ["git", "status"]
    },
    {
        "id": "day09-git-mcq-04",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "كيف تضيف كل الملفات الجديدة والمعدلة إلى الـ staging area تمهيداً لحفظها؟",
        "options": ["git add .", "git commit .", "git push .", "git save ."],
        "answer": "git add .",
        "hint": "علامة النقطة تعني المجلد الحالي ومحتوياته.",
        "explanation": "git add . بيقوم بإدراج جميع التغييرات الحالية في مرحلة التجهيز (staging area).",
        "tags": ["git", "add"]
    },
    {
        "id": "day09-git-mcq-05",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "كيف تضيف ملفاً معيناً باسم index.html للـ staging area فقط؟",
        "options": ["git add index.html", "git commit index.html", "git push index.html", "git stage index.html"],
        "answer": "git add index.html",
        "hint": "تحدد اسم الملف بعد الأمر git add.",
        "explanation": "git add index.html بيضيف الملف المحدد فقط ويتجاهل باقي الملفات المعدلة.",
        "tags": ["git", "add"]
    },
    {
        "id": "day09-git-mcq-06",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي أمر يحفظ التعديلات المضافة في الـ history مع رسالة توضيحية؟",
        "options": ["git commit -m \"message\"", "git push -m \"message\"", "git save -m \"message\"", "git add -m \"message\""],
        "answer": "git commit -m \"message\"",
        "hint": "الخيار -m يرمز إلى message.",
        "explanation": "git commit بيحفظ الـ snapshot، والـ -m بنكتب بعدها الرسالة الوصفية للتغييرات.",
        "tags": ["git", "commit"]
    },
    {
        "id": "day09-git-mcq-07",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "كيف تعرض سجل الـ commits السابقة بشكل مختصر وسطر واحد لكل commit؟",
        "options": ["git log --oneline", "git status --oneline", "git diff --oneline", "git show --oneline"],
        "answer": "git log --oneline",
        "hint": "الخيار يعني سطر واحد بالإنجليزية.",
        "explanation": "git log --oneline بيعرض الـ hash ورسالة الـ commit فقط في سطر واحد لتسهيل القراءة.",
        "tags": ["git", "log"]
    },
    {
        "id": "day09-git-mcq-08",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي أمر يعرض الفروقات والتغييرات التي أجريتها على الملفات ولكنك لم تقم بإضافتها للـ staging بعد؟",
        "options": ["git diff", "git status", "git log", "git show"],
        "answer": "git diff",
        "hint": "اختصار لـ difference.",
        "explanation": "git diff بيقارن حالتك الحالية بآخر commit لبيان الفروق بالتفصيل.",
        "tags": ["git", "diff"]
    },
    {
        "id": "day09-git-mcq-09",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "كيف تعرض قائمة بالـ branches الحالية في مشروعك وتعرف أي واحد منها نشط حالياً؟",
        "options": ["git branch", "git status", "git checkout", "git merge"],
        "answer": "git branch",
        "hint": "الكلمة تعني فرع بالإنجليزية.",
        "explanation": "git branch بيعرض الفروع والمميز بنجمة (*) هو الفرع الحالي النشط.",
        "tags": ["git", "branch"]
    },
    {
        "id": "day09-git-mcq-10",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي أمر ينشئ branch جديد باسم dev دون الانتقال إليه؟",
        "options": ["git branch dev", "git checkout dev", "git checkout -b dev", "git merge dev"],
        "answer": "git branch dev",
        "hint": "تكتب اسم الفرع بعد git branch فقط.",
        "explanation": "git branch dev بيعمل الفرع الجديد بس بيبقيك في الفرع الحالي.",
        "tags": ["git", "branch"]
    },
    {
        "id": "day09-git-mcq-11",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "كيف تنشئ branch جديد باسم dev وتنتقل إليه فوراً في خطوة واحدة؟",
        "options": ["git checkout -b dev", "git branch dev", "git checkout dev", "git switch dev"],
        "answer": "git checkout -b dev",
        "hint": "نستخدم الخيار -b مع أمر الانتقال.",
        "explanation": "git checkout -b dev بينشئ الفرع dev وينتقل إليه مباشرة لتوفير خطوة.",
        "tags": ["git", "checkout", "branch"]
    },
    {
        "id": "day09-git-mcq-12",
        "type": "mcq",
        "category": "scenario",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "أنت الآن على الـ branch الرئيسي (main)، كيف تدمج التغييرات من الـ branch المسمى feature إليه؟",
        "options": ["git merge feature", "git checkout feature", "git push feature", "git branch feature"],
        "answer": "git merge feature",
        "hint": "الكلمة تعني دمج بالإنجليزية.",
        "explanation": "git merge feature بيدمج كود feature في الفرع الحالي (main).",
        "tags": ["git", "merge"]
    },
    {
        "id": "day09-git-mcq-13",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "كيف تجلب أحدث التغييرات من الـ remote repository وتدمجها مباشرة في الـ branch الحالي؟",
        "options": ["git pull origin main", "git push origin main", "git fetch origin main", "git checkout main"],
        "answer": "git pull origin main",
        "hint": "السحب (pull) يسحب ويدمج في نفس الوقت.",
        "explanation": "git pull origin main بيجلب التغييرات من الـ remote (origin) ويدمجها في الفرع المحلي main.",
        "tags": ["git", "pull"]
    },
    {
        "id": "day09-git-mcq-14",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "أي أمر ترفع به تعديلاتك المحلية إلى الـ remote repository على الـ branch الرئيسي؟",
        "options": ["git push origin main", "git pull origin main", "git merge origin main", "git commit origin main"],
        "answer": "git push origin main",
        "hint": "الدفع (push) يرفع الكود.",
        "explanation": "git push origin main بيرفع الـ commits المحلية للفرع main على السيرفر origin.",
        "tags": ["git", "push"]
    },
    {
        "id": "day09-git-mcq-15",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "prompt": "ما الأمر الذي تستخدمه لحفظ تغييراتك الحالية مؤقتاً جانباً دون عمل commit لها لتتمكن من تنظيف مساحة العمل؟",
        "options": ["git stash", "git save", "git reset", "git revert"],
        "answer": "git stash",
        "hint": "الكلمة تعني مخبأ أو تخزين مؤقت.",
        "explanation": "git stash بيخفي الملفات المعدلة في مكان مؤقت ويرجعك لآخر commit نظيف.",
        "tags": ["git", "stash"]
    },
    {
        "id": "day09-git-mcq-16",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "بعد أن حفظت التعديلات بـ git stash، كيف تسترجعها وتطبقها على مجلد العمل مرة أخرى؟",
        "options": ["git stash pop", "git stash get", "git stash pop-all", "git stash reset"],
        "answer": "git stash pop",
        "hint": "الكلمة تعني فرقعة أو استخراج.",
        "explanation": "git stash pop بيرجع آخر تعديلات مخبأة ويمسحها من قائمة الـ stash.",
        "tags": ["git", "stash"]
    },
    {
        "id": "day09-git-mcq-17",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "كيف تتحقق من عناوين الـ URLs الخاصة بالـ remote repository المرتبطة بمشروعك؟",
        "options": ["git remote -v", "git remote status", "git config remote", "git show remote"],
        "answer": "git remote -v",
        "hint": "الخيار -v يرمز إلى verbose (مفصل).",
        "explanation": "git remote -v بيعرض الـ URLs المستعملة للـ fetch والـ push.",
        "tags": ["git", "remote"]
    },
    {
        "id": "day09-git-mcq-18",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "أي أمر يلغي آخر commit قمت به محلياً مع الحفاظ على التعديلات في الملفات كـ unstaged؟",
        "options": ["git reset HEAD~1", "git reset --hard HEAD~1", "git revert HEAD~1", "git checkout HEAD~1"],
        "answer": "git reset HEAD~1",
        "hint": "الـ ~1 تشير إلى commit واحد للخلف.",
        "explanation": "git reset HEAD~1 بيفك الـ commit بس بيحافظ على الكود اللي كتبته علشان تعدله.",
        "tags": ["git", "reset"]
    },
    {
        "id": "day09-git-mcq-19",
        "type": "mcq",
        "category": "concept",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "prompt": "ماذا يحدث عند تنفيذ الأمر git reset --hard HEAD~1؟",
        "options": [
            "حذف آخر commit وكل التغييرات المصاحبة له تماماً ودون رجعة",
            "إلغاء الـ commit مع الاحتفاظ بالملفات كـ unstaged",
            "إنشاء commit جديد معاكس لإلغاء التعديلات",
            "حذف الـ branch بالكامل"
        ],
        "answer": "حذف آخر commit وكل التغييرات المصاحبة له تماماً ودون رجعة",
        "hint": "احذر من الخيار --hard فهو يمسح كل شيء.",
        "explanation": "git reset --hard بيمسح الـ commit ويمسح كل التعديلات اللي تمت في الملفات أيضاً.",
        "tags": ["git", "reset"]
    },
    {
        "id": "day09-git-mcq-20",
        "type": "mcq",
        "category": "concept",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "ما هو المجلد المخفي الذي ينشئه Git في جذر المشروع ليحتفظ بداخله بجميع بيانات الـ history؟",
        "options": [".git", ".github", ".gitignore", "git-metadata"],
        "answer": ".git",
        "hint": "يبدأ بنقطة واسم الأداة.",
        "explanation": "مجلد .git هو المجلد الذي يحتوي على كل قواعد بيانات وتفرعات المشروع.",
        "tags": ["git"]
    },
    {
        "id": "day09-git-mcq-21",
        "type": "mcq",
        "category": "concept",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي ملف تستخدمه لإخبار Git بالملفات أو المجلدات التي يجب أن يتجاهلها ولا يتتبعها (مثل node_modules)؟",
        "options": [".gitignore", ".gitconfig", ".git-exclude", ".env"],
        "answer": ".gitignore",
        "hint": "الاسم يعني تجاهل git بالإنجليزية.",
        "explanation": ".gitignore هو ملف نصي نكتب بداخله أسامي الملفات والمجلدات التي لا نريد رفعها لـ git.",
        "tags": ["git"]
    },
    {
        "id": "day09-git-mcq-22",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "أي أمر يعرض تفاصيل التغييرات للملفات التي تمت إضافتها للـ staging (Staged changes)؟",
        "options": ["git diff --staged", "git diff", "git diff --cached", "git status -s"],
        "answer": "git diff --staged",
        "hint": "استخدم خيار staged مع git diff.",
        "explanation": "git diff --staged (أو --cached) بيعرض التغييرات المجهزة للـ commit فقط.",
        "tags": ["git", "diff"]
    },
    {
        "id": "day09-git-mcq-23",
        "type": "mcq",
        "category": "concept",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "ما هو الاسم الافتراضي الشائع للـ remote repository الرئيسي في Git؟",
        "options": ["origin", "main", "master", "upstream"],
        "answer": "origin",
        "hint": "الاسم يعني الأصل بالإنجليزية.",
        "explanation": "عند عمل clone أو ربط remote، الاسم الافتراضي الشائع للسيرفر هو origin.",
        "tags": ["git"]
    },
    {
        "id": "day09-git-mcq-24",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "إذا قمت بإنشاء branch جديد، كيف تقوم بـ push له لأول مرة وتعيينه للـ tracking؟",
        "options": ["git push -u origin branch-name", "git push branch-name", "git push --first branch-name", "git push origin"],
        "answer": "git push -u origin branch-name",
        "hint": "الخيار -u يرمز لـ set-upstream.",
        "explanation": "git push -u (أو --set-upstream) بيربط الـ branch المحلي بالـ remote للـ pushes القادمة.",
        "tags": ["git", "push"]
    },
    {
        "id": "day09-git-mcq-25",
        "type": "mcq",
        "category": "concept",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "ما الفرق الأساسي بين git pull و git fetch؟",
        "options": [
            "git pull يجلب التغييرات ويدمجها مباشرة بينما git fetch يجلبها فقط دون دمج",
            "git fetch يقوم بالدمج التلقائي بينما git pull لا يفعل",
            "git pull للرفع و git fetch للتنزيل من السيرفر",
            "لا يوجد أي فرق بين الأمرين"
        ],
        "answer": "git pull يجلب التغييرات ويدمجها مباشرة بينما git fetch يجلبها فقط دون دمج",
        "hint": "أحدهما آمن (جلب فقط) والآخر يدمج فوراً.",
        "explanation": "git fetch بيحدث البيانات المحلية من السيرفر فقط، أما git pull فيجلب ويدمج (fetch + merge).",
        "tags": ["git", "pull", "fetch"]
    },
    {
        "id": "day09-git-mcq-26",
        "type": "mcq",
        "category": "concept",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "إذا حدث تعارض (conflict) أثناء الـ merge، ماذا يفعل Git؟",
        "options": [
            "يقوم بإيقاف عملية الدمج ويطلب منك تحديد الكود الصحيح يدوياً وحل التعارض",
            "يختار عشوائياً الكود الأحدث ويحذف الآخر",
            "يمسح الملفين المتعارضين ويطلب إعادة كتابتهما",
            "يلغي الـ commit الأقدم تلقائياً"
        ],
        "answer": "يقوم بإيقاف عملية الدمج ويطلب منك تحديد الكود الصحيح يدوياً وحل التعارض",
        "hint": "التعارض يعني أن نفس السطر تم تعديله بشكلين مختلفين.",
        "explanation": "Git لا يستطيع دمج أسطر متعارضة تلقائياً، بل يضع علامات تعارض ويطلب منك الحل اليدوي.",
        "tags": ["git", "merge"]
    },
    {
        "id": "day09-git-mcq-27",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي خيار تستخدمه مع git log لرسم شكل شجرة الـ commits وتفرعات الـ branches؟",
        "options": ["--graph", "--tree", "--branches", "--visual"],
        "answer": "--graph",
        "hint": "الكلمة تعني رسم بياني أو شجرة.",
        "explanation": "git log --graph يرسم خطوطاً وتفرعات تمثل الـ branches والدمج بصرياً.",
        "tags": ["git", "log"]
    },
    {
        "id": "day09-git-mcq-28",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "كيف تسترجع التغييرات المخبأة بـ git stash ولكن دون حذفها من قائمة الـ stash؟",
        "options": ["git stash apply", "git stash pop", "git stash show", "git stash load"],
        "answer": "git stash apply",
        "hint": "الكلمة تعني تطبيق بالإنجليزية.",
        "explanation": "git stash apply يطبق التغييرات ويبقيها في قائمة الـ stash للرجوع إليها لاحقاً.",
        "tags": ["git", "stash"]
    },
    {
        "id": "day09-git-mcq-29",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "prompt": "كيف تعدل رسالة آخر commit محلي قمت به؟",
        "options": ["git commit --amend", "git commit --edit", "git commit --change", "git reset --amend"],
        "answer": "git commit --amend",
        "hint": "الكلمة تعني تعديل أو إصلاح.",
        "explanation": "git commit --amend بيفتح الـ editor لتعديل آخر commit أو إضافة ملفات جديدة له.",
        "tags": ["git", "commit"]
    },
    {
        "id": "day09-git-mcq-30",
        "type": "mcq",
        "category": "choose_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "prompt": "أي أمر يعرض التغييرات في ملف محدد فقط باسم file.txt؟",
        "options": ["git diff file.txt", "git status file.txt", "git log file.txt", "git show file.txt"],
        "answer": "git diff file.txt",
        "hint": "حدد اسم الملف بعد أمر الفروقات.",
        "explanation": "git diff file.txt يعرض التغييرات الحالية للملف المسمى file.txt فقط.",
        "tags": ["git", "diff"]
    }
]

git_typings = [
    {
        "id": "day09-git-typing-01",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 1 من 30",
        "prompt": "اكتب أمر Git لبدء repository جديد في المجلد الحالي.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git init"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "أول أمر في أي مشروع Git جديد.",
        "explanation": "الإجابة: git init — بينشئ .git directory.",
        "tags": ["git", "init"]
    },
    {
        "id": "day09-git-typing-02",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 2 من 30",
        "prompt": "اكتب أمر Git لنسخ repository من العنوان التالي: https://github.com/user/project.git",
        "placeholder": "git clone ...",
        "accepted_answers": ["git clone https://github.com/user/project.git"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم git clone متبوعاً بالرابط.",
        "explanation": "الإجابة: git clone https://github.com/user/project.git",
        "tags": ["git", "clone"]
    },
    {
        "id": "day09-git-typing-03",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 3 من 30",
        "prompt": "اكتب أمر Git لعرض حالة المجلد الحالي والملفات المعدلة.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git status"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "يعرض حالة الملفات المتغيرة.",
        "explanation": "الإجابة: git status",
        "tags": ["git", "status"]
    },
    {
        "id": "day09-git-typing-04",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 4 من 30",
        "prompt": "اكتب أمر Git لإضافة جميع الملفات الجديدة والمعدلة لمرحلة التجهيز (staging).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git add ."],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم نقطة . للإشارة لكل الملفات.",
        "explanation": "الإجابة: git add .",
        "tags": ["git", "add"]
    },
    {
        "id": "day09-git-typing-05",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 5 من 30",
        "prompt": "اكتب أمر Git لإضافة ملف باسم app.js فقط للـ staging.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git add app.js"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "حدد اسم الملف بعد git add.",
        "explanation": "الإجابة: git add app.js",
        "tags": ["git", "add"]
    },
    {
        "id": "day09-git-typing-06",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 6 من 30",
        "prompt": "اكتب أمر Git لحفظ التغييرات المجهزة برسالة تعليق تقول 'Fix authentication bug'.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git commit -m \"Fix authentication bug\"", "git commit -m 'Fix authentication bug'"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم خيار -m لكتابة الرسالة.",
        "explanation": "الإجابة: git commit -m \"Fix authentication bug\"",
        "tags": ["git", "commit"]
    },
    {
        "id": "day09-git-typing-07",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 7 من 30",
        "prompt": "اكتب أمر Git لعرض سجل الـ commits سطرًا بسطر وبشكل مختصر.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git log --oneline"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم --oneline مع سجل الكوميتات.",
        "explanation": "الإجابة: git log --oneline",
        "tags": ["git", "log"]
    },
    {
        "id": "day09-git-typing-08",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 8 من 30",
        "prompt": "اكتب أمر Git لعرض الفروقات بين التغييرات الحالية وآخر commit (لالملفات غير المجهزة).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git diff"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "علمة تعني فروق بالإنجليزية.",
        "explanation": "الإجابة: git diff",
        "tags": ["git", "diff"]
    },
    {
        "id": "day09-git-typing-09",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 9 من 30",
        "prompt": "اكتب أمر Git لعرض قائمة بجميع الـ branches المحلية.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git branch"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الأمر هو git branch.",
        "explanation": "الإجابة: git branch",
        "tags": ["git", "branch"]
    },
    {
        "id": "day09-git-typing-10",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 10 من 30",
        "prompt": "اكتب أمر Git لإنشاء branch جديد باسم feature-login.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git branch feature-login"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "حدد اسم الفرع بعد git branch.",
        "explanation": "الإجابة: git branch feature-login",
        "tags": ["git", "branch"]
    },
    {
        "id": "day09-git-typing-11",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 11 من 30",
        "prompt": "اكتب أمر Git لإنشاء branch جديد باسم feature-login والانتقال إليه مباشرة.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git checkout -b feature-login"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم خيار -b مع checkout.",
        "explanation": "الإجابة: git checkout -b feature-login",
        "tags": ["git", "checkout"]
    },
    {
        "id": "day09-git-typing-12",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 12 من 30",
        "prompt": "اكتب أمر Git لدمج branch باسم dev في الـ branch الحالي.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git merge dev"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم merge مع اسم الفرع.",
        "explanation": "الإجابة: git merge dev",
        "tags": ["git", "merge"]
    },
    {
        "id": "day09-git-typing-13",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 13 من 30",
        "prompt": "اكتب أمر Git لجلب أحدث التغييرات من الـ branch الرئيسي main للـ remote origin ودمجها.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git pull origin main"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم git pull origin main.",
        "explanation": "الإجابة: git pull origin main",
        "tags": ["git", "pull"]
    },
    {
        "id": "day09-git-typing-14",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 14 من 30",
        "prompt": "اكتب أمر Git لرفع الـ commits المحلية للـ branch الرئيسي main على الـ remote origin.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git push origin main"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم push مع اسم السيرفر والفرع.",
        "explanation": "الإجابة: git push origin main",
        "tags": ["git", "push"]
    },
    {
        "id": "day09-git-typing-15",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 15 من 30",
        "prompt": "اكتب أمر Git لحفظ التغييرات الحالية مؤقتاً في الـ stash وتنظيف مساحة العمل.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git stash"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الأمر هو git stash.",
        "explanation": "الإجابة: git stash",
        "tags": ["git", "stash"]
    },
    {
        "id": "day09-git-typing-16",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 16 من 30",
        "prompt": "اكتب أمر Git لاسترجاع وتطبيق آخر تغييرات تم حفظها مؤقتاً في الـ stash ومسحها منه.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git stash pop"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استرجع بـ pop.",
        "explanation": "الإجابة: git stash pop",
        "tags": ["git", "stash"]
    },
    {
        "id": "day09-git-typing-17",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 17 من 30",
        "prompt": "اكتب أمر Git لعرض قائمة الـ remotes المتصلة بالمشروع وعناوين الـ URLs الخاصة بها.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git remote -v"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم git remote مع خيار verbose.",
        "explanation": "الإجابة: git remote -v",
        "tags": ["git", "remote"]
    },
    {
        "id": "day09-git-typing-18",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 18 من 30",
        "prompt": "اكتب أمر Git لإلغاء آخر commit محلي مع الإبقاء على ملفات التعديل (دون مسحها).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git reset HEAD~1"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم reset مع HEAD~1.",
        "explanation": "الإجابة: git reset HEAD~1",
        "tags": ["git", "reset"]
    },
    {
        "id": "day09-git-typing-19",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 19 من 30",
        "prompt": "اكتب أمر Git لعرض التغييرات المجهزة بالفعل (Staged) التي لم تعمل commit بعد.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git diff --staged", "git diff --cached"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم خيار staged مع diff.",
        "explanation": "الإجابة: git diff --staged",
        "tags": ["git", "diff"]
    },
    {
        "id": "day09-git-typing-20",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 20 من 30",
        "prompt": "اكتب أمر Git لرفع branch جديد باسم staging وتعيين الـ upstream له.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git push -u origin staging"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم خيار -u origin staging مع push.",
        "explanation": "الإجابة: git push -u origin staging",
        "tags": ["git", "push"]
    },
    {
        "id": "day09-git-typing-21",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 21 من 30",
        "prompt": "اكتب أمر Git لتعديل رسالة آخر commit قمت به.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git commit --amend"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم خيار amend مع commit.",
        "explanation": "الإجابة: git commit --amend",
        "tags": ["git", "commit"]
    },
    {
        "id": "day09-git-typing-22",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 22 من 30",
        "prompt": "اكتب أمر Git لحفظ التغييرات مؤقتاً مع إعطاء الـ stash اسماً توضيحياً 'work-in-progress'.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git stash save \"work-in-progress\"", "git stash save 'work-in-progress'", "git stash push -m \"work-in-progress\"", "git stash push -m 'work-in-progress'"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم stash save أو stash push -m.",
        "explanation": "الإجابة: git stash save 'work-in-progress'",
        "tags": ["git", "stash"]
    },
    {
        "id": "day09-git-typing-23",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 23 من 30",
        "prompt": "اكتب أمر Git لعرض سجل الـ commits بالكامل.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git log"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الأمر هو git log.",
        "explanation": "الإجابة: git log",
        "tags": ["git", "log"]
    },
    {
        "id": "day09-git-typing-24",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 24 من 30",
        "prompt": "اكتب أمر Git للانتقال إلى branch موجود بالفعل باسم main.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git checkout main", "git switch main"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم checkout أو switch مع main.",
        "explanation": "الإجابة: git checkout main",
        "tags": ["git", "checkout"]
    },
    {
        "id": "day09-git-typing-25",
        "type": "typing",
        "category": "write_command",
        "difficulty": "easy",
        "points": 1,
        "streak": 0,
        "training_label": "تدريب 25 من 30",
        "prompt": "اكتب أمر Git لعرض الفروقات في ملف باسم index.js فقط.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git diff index.js"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "حدد اسم الملف بعد diff.",
        "explanation": "الإجابة: git diff index.js",
        "tags": ["git", "diff"]
    },
    {
        "id": "day09-git-typing-26",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 26 من 30",
        "prompt": "اكتب أمر Git لإلغاء إدراج (unstage) ملف باسم file.txt تم تجهيزه بـ git add.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git reset HEAD file.txt", "git restore --staged file.txt"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم reset HEAD أو restore --staged.",
        "explanation": "الإجابة: git restore --staged file.txt",
        "tags": ["git", "reset"]
    },
    {
        "id": "day09-git-typing-27",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 27 من 30",
        "prompt": "اكتب أمر Git لحذف branch محلي باسم feature-old بعد دمجه.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git branch -d feature-old"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم git branch مع خيار الحذف -d.",
        "explanation": "الإجابة: git branch -d feature-old",
        "tags": ["git", "branch"]
    },
    {
        "id": "day09-git-typing-28",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 28 من 30",
        "prompt": "اكتب أمر Git لجلب أحدث البيانات والتغييرات من الـ remote origin دون دمجها في أي branch محلي.",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git fetch origin", "git fetch"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الكلمة تعني إحضار (fetch).",
        "explanation": "الإجابة: git fetch origin",
        "tags": ["git", "fetch"]
    },
    {
        "id": "day09-git-typing-29",
        "type": "typing",
        "category": "write_command",
        "difficulty": "medium",
        "points": 2,
        "streak": 0,
        "training_label": "تدريب 29 من 30",
        "prompt": "اكتب أمر Git لعرض تفاصيل commit معين بواسطة الـ hash المروّس له (مثال: ab12cd3).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git show ab12cd3"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "الأمر هو show.",
        "explanation": "الإجابة: git show ab12cd3",
        "tags": ["git", "show"]
    },
    {
        "id": "day09-git-typing-30",
        "type": "typing",
        "category": "write_command",
        "difficulty": "hard",
        "points": 3,
        "streak": 0,
        "training_label": "تدريب 30 من 30",
        "prompt": "اكتب أمر Git لحذف آخر commit وكل الملفات والتغييرات المرتبطة به تماماً وتدميرها (خيار خطر).",
        "placeholder": "اكتب الأمر هنا...",
        "accepted_answers": ["git reset --hard HEAD~1"],
        "case_sensitive": True,
        "allow_extra_spaces": True,
        "hint": "استخدم reset مع الخيار --hard و HEAD~1.",
        "explanation": "الإجابة: git reset --hard HEAD~1",
        "tags": ["git", "reset"]
    }
]

day9_obj = {
    "day": 9,
    "id": "day09-git",
    "title": "أساسيات Git",
    "tags": ["git", "version-control", "collaboration"],
    "mcq_count": 30,
    "typing_count": 30,
    "mcq": git_mcqs,
    "typing": git_typings
}
new_days.append(day9_obj)

# Update data days
data["days"] = new_days

# Save updated questions
with open(questions_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Successfully updated questions bank with 9 days and sliced to 30!")
