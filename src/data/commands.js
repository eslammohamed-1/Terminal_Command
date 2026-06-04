export const commands = [
  // Day 01 — Navigation
  { id: "d1-echo", dayId: 1, command: "echo", flags: "$SHELL", target: "None", desc: "يطبع نوع الـ Shell الحالي المستخدم في التيرمنال، مثل zsh أو bash.", example: "echo $SHELL" },
  { id: "d1-uname", dayId: 1, command: "uname", flags: "-s", target: "None", desc: "يعرض اسم نظام التشغيل الأساسي. على الماك يطبع Darwin، وعلى لينكس يطبع Linux.", example: "uname -s" },
  { id: "d1-pwd", dayId: 1, command: "pwd", flags: "None", target: "None", desc: "اختصار Print Working Directory ويعرض المسار المطلق للمجلد الحالي الذي تقف داخله.", example: "pwd" },
  { id: "d1-cd-up", dayId: 1, command: "cd", flags: "None", target: "..", desc: "يرجع خطوة واحدة للخلف إلى المجلد الأب Parent Directory.", example: "cd .." },
  { id: "d1-cd-home", dayId: 1, command: "cd", flags: "None", target: "~", desc: "ينقلك مباشرة إلى مجلد البيت الرئيسي للمستخدم الحالي Home Directory.", example: "cd ~" },
  { id: "d1-ls", dayId: 1, command: "ls", flags: "-la أو -lah", target: "None", desc: "يعرض محتويات المجلد الحالي، بما فيها الملفات المخفية، مع تفاصيل مثل الصلاحيات والحجم والتاريخ.", example: "ls -lah" },

  // Day 02 — Files and Directories
  { id: "d2-mkdir", dayId: 2, command: "mkdir", flags: "None", target: "study", desc: "ينشئ مجلدًا جديدًا فارغًا باسم study في المكان الحالي.", example: "mkdir study" },
  { id: "d2-touch", dayId: 2, command: "touch", flags: "None", target: "Lesson1.txt", desc: "ينشئ ملفًا جديدًا فارغًا باسم Lesson1.txt، أو يحدّث وقت التعديل لو كان الملف موجودًا.", example: "touch Lesson1.txt" },
  { id: "d2-mv", dayId: 2, command: "mv", flags: "None", target: "photo.png avatar.png", desc: "ينقل الملف أو يعيد تسميته من الاسم القديم إلى الاسم الجديد.", example: "mv photo.png avatar.png" },
  { id: "d2-cp", dayId: 2, command: "cp", flags: "-r للمجلدات", target: "file.txt backup.txt", desc: "ينسخ ملفًا أو مجلدًا. الخيار -r ضروري عند نسخ مجلدات كاملة.", example: "cp file.txt backup.txt" },
  { id: "d2-rm", dayId: 2, command: "rm", flags: "-r للمجلدات", target: "old_folder", desc: "يحذف ملفًا أو مجلدًا. احذر: الحذف نهائي غالبًا ولا يذهب لسلة المهملات.", example: "rm -r old_folder" },

  // Day 03 — Text Processing
  { id: "d3-cat", dayId: 3, command: "cat", flags: "None", target: "_config.yml", desc: "يعرض محتوى الملف بالكامل على الشاشة مباشرة، وهو مناسب للملفات الصغيرة.", example: "cat _config.yml" },
  { id: "d3-less", dayId: 3, command: "less", flags: "None", target: "questions-source.txt", desc: "يفتح الملفات الكبيرة في شاشة تفاعلية تتيح التصفح والخروج بحرف q.", example: "less questions-source.txt" },
  { id: "d3-head", dayId: 3, command: "head", flags: "-n 10", target: "questions-source.txt", desc: "يعرض الأسطر الأولى من الملف. الافتراضي أول 10 أسطر ويمكن تحديد العدد.", example: "head -n 10 questions-source.txt" },
  { id: "d3-grep", dayId: 3, command: "grep", flags: "-i", target: "\"(صح)\" questions-source.txt", desc: "يبحث عن كلمة أو نمط معين داخل الملف. الخيار -i يتجاهل الفرق بين الحروف الكبيرة والصغيرة.", example: "grep -i \"(صح)\" questions-source.txt" },
  { id: "d3-wc", dayId: 3, command: "wc", flags: "-l", target: "None", desc: "اختصار Word Count. الخيار -l يستخدم لعدّ الأسطر فقط.", example: "wc -l" },

  // Day 04 — Pipes and Redirection
  { id: "d4-pipe", dayId: 4, command: "|", flags: "None", target: "None", desc: "علامة Pipe تمرر ناتج الأمر الأول ليكون مدخلًا للأمر الثاني.", example: "cat file.txt | grep hello" },
  { id: "d4-redirect", dayId: 4, command: ">", flags: "None", target: "tolal_fals.txt", desc: "علامة Redirection تحول ناتج الأمر وتحفظه في ملف جديد. إذا كان الملف موجودًا تمسح القديم وتكتب الجديد.", example: "ls > tolal_fals.txt" },
  { id: "d4-append", dayId: 4, command: ">>", flags: "None", target: "filename.txt", desc: "تضيف الناتج في نهاية الملف الحالي دون مسح المحتوى السابق.", example: "echo hello >> filename.txt" },

  // Day 05 — Find and Xargs
  { id: "d5-find", dayId: 5, command: "find", flags: ". -type f -name \"*.txt\"", target: "None", desc: "يبحث في المجلد الحالي . عن عناصر نوعها ملفات f واسمها ينتهي بـ .txt.", example: "find . -type f -name \"*.txt\"" },
  { id: "d5-xargs", dayId: 5, command: "xargs", flags: "-0 مع find -print0", target: "None", desc: "يحوّل مخرجات find (أو أي أمر) إلى قائمة arguments لأمر آخر. آمن مع الملفات ذات المسافات عند استخدام -print0 و -0.", example: "find . -name \"*.txt\" -print0 | xargs -0 wc -l" },

  // Day 06 — Permissions
  { id: "d6-lsl", dayId: 6, command: "ls -l", flags: "None", target: "None", desc: "يعرض الملفات مع الصلاحيات rwx لكل من المالك والمجموعة والآخرين، مثل -rw-r--r--.", example: "ls -l" },
  { id: "d6-chmod", dayId: 6, command: "chmod", flags: "+x", target: "build_practice.py", desc: "يغير صلاحيات الملف ويجعله قابلًا للتنفيذ كبرنامج أو سكربت.", example: "chmod +x build_practice.py" },
  { id: "d6-sudo", dayId: 6, command: "sudo", flags: "None", target: "command", desc: "ينفذ الأمر بصلاحيات المدير الخارق Root، وغالبًا يتطلب كتابة باسورد الجهاز.", example: "sudo apt update" },

  // Day 07 — Scripting
  { id: "d7-shebang", dayId: 7, command: "#!/bin/bash", flags: "سطر أول في الملف", target: "None", desc: "Shebang يخبر النظام أي مفسر يشغّل السكربت. يوضع في أول سطر الملف.", example: "#!/bin/bash" },
  { id: "d7-bash", dayId: 7, command: "bash", flags: "None", target: "script.sh", desc: "يشغّل سكربت bash صراحةً دون الحاجة لصلاحية تنفيذ على الملف.", example: "bash script.sh" },
  { id: "d7-var", dayId: 7, command: "echo", flags: "$VAR", target: "None", desc: "يعرض قيمة متغير bash أو متغير بيئة. مثال: echo $HOME يطبع مسار البيت.", example: "echo $HOME" },
  { id: "d7-chmod-x", dayId: 7, command: "chmod +x", flags: "None", target: "script.sh", desc: "يجعل السكربت قابلًا للتشغيل مباشرة بـ ./script.sh بعد إضافة صلاحية التنفيذ.", example: "chmod +x script.sh" },
  { id: "d7-and", dayId: 7, command: "&&", flags: "None", target: "None", desc: "يشغّل الأمر الثاني فقط إذا نجح الأول (exit code 0). مفيد لربط خطوات السكربت.", example: "mkdir study && cd study" },
];

export function getCommandsForDay(dayId) {
  return commands.filter((c) => c.dayId === dayId);
}
