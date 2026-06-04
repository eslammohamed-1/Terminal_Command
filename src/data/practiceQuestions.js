export const practiceQuestions = [
  // Day 01
  { dayId: 1, prompt: "اكتب الأمر الذي يعرض نوع الـ Shell الحالي.", answers: ["echo $SHELL"], hint: "استخدم echo مع المتغير $SHELL", explanation: "الأمر echo $SHELL يطبع قيمة متغير البيئة SHELL." },
  { dayId: 1, prompt: "اكتب الأمر الذي يعرض اسم نظام التشغيل الأساسي.", answers: ["uname -s"], hint: "الأمر uname مع الخيار -s", explanation: "uname -s يطبع اسم kernel/system مثل Darwin أو Linux." },
  { dayId: 1, prompt: "اكتب الأمر الذي يعرض المسار الحالي الكامل.", answers: ["pwd"], hint: "Print Working Directory", explanation: "pwd يعرض مكانك الحالي داخل نظام الملفات." },
  { dayId: 1, prompt: "اكتب الأمر للرجوع للمجلد الأب خطوة واحدة.", answers: ["cd .."], hint: "cd ومعها نقطتين", explanation: "cd .. ينقلك إلى Parent Directory." },
  { dayId: 1, prompt: "اكتب الأمر للانتقال إلى Home Directory.", answers: ["cd ~", "cd"], hint: "cd ومعها علامة ~", explanation: "cd ~ ينقلك إلى مجلد البيت." },
  { dayId: 1, prompt: "اكتب الأمر لعرض كل الملفات بالتفاصيل وبالأحجام المقروءة للإنسان.", answers: ["ls -lah", "ls -la -h", "ls -alh", "ls -lha"], hint: "ls مع l و a و h", explanation: "ls -lah يعرض الملفات المخفية والتفاصيل والأحجام بصيغة سهلة القراءة." },

  // Day 02
  { dayId: 2, prompt: "اكتب الأمر لإنشاء مجلد جديد باسم study.", answers: ["mkdir study"], hint: "mkdir + اسم المجلد", explanation: "mkdir study ينشئ مجلدًا جديدًا باسم study." },
  { dayId: 2, prompt: "اكتب الأمر لإنشاء ملف فارغ باسم Lesson1.txt.", answers: ["touch Lesson1.txt"], hint: "touch + اسم الملف", explanation: "touch Lesson1.txt ينشئ ملفًا فارغًا أو يحدّث وقت تعديله." },
  { dayId: 2, prompt: "اكتب الأمر لإعادة تسمية photo.png إلى avatar.png.", answers: ["mv photo.png avatar.png"], hint: "mv الاسم_القديم الاسم_الجديد", explanation: "mv يستخدم للنقل أو إعادة التسمية." },
  { dayId: 2, prompt: "اكتب الأمر لنسخ file.txt إلى backup.txt.", answers: ["cp file.txt backup.txt"], hint: "cp المصدر الوجهة", explanation: "cp ينسخ الملف مع الإبقاء على الأصل." },
  { dayId: 2, prompt: "اكتب الأمر لحذف مجلد old_folder ومحتوياته.", answers: ["rm -r old_folder", "rm -rf old_folder"], hint: "rm مع -r", explanation: "rm -r يحذف المجلد بشكل متكرر." },

  // Day 03
  { dayId: 3, prompt: "اكتب الأمر لعرض محتوى ملف _config.yml بالكامل.", answers: ["cat _config.yml"], hint: "cat + اسم الملف", explanation: "cat يعرض محتوى الملف مباشرة في الشاشة." },
  { dayId: 3, prompt: "اكتب الأمر لفتح الملف questions-source.txt للتصفح والخروج بحرف q.", answers: ["less questions-source.txt"], hint: "less + اسم الملف", explanation: "less مناسب للملفات الكبيرة والتصفح التفاعلي." },
  { dayId: 3, prompt: "اكتب الأمر لعرض أول 10 أسطر من questions-source.txt.", answers: ["head -n 10 questions-source.txt", "head questions-source.txt"], hint: "head -n 10 + اسم الملف", explanation: "head يعرض أول 10 أسطر افتراضيًا." },
  { dayId: 3, prompt: "اكتب الأمر للبحث عن النص (صح) داخل questions-source.txt مع تجاهل حالة الأحرف.", answers: ["grep -i \"(صح)\" questions-source.txt", "grep -i '(صح)' questions-source.txt"], hint: "grep -i ثم النص بين علامات اقتباس", explanation: "grep -i يبحث مع تجاهل اختلاف الحروف." },
  { dayId: 3, prompt: "اكتب الأمر لعدّ عدد الأسطر فقط من ناتج مدخل للأمر.", answers: ["wc -l"], hint: "wc مع خيار الأسطر", explanation: "wc -l يعدّ عدد الأسطر." },

  // Day 04
  { dayId: 4, prompt: "اكتب أمرًا يقرأ file.txt ثم يبحث عن hello باستخدام Pipe.", answers: ["cat file.txt | grep hello", "cat file.txt|grep hello"], hint: "cat ثم | ثم grep", explanation: "علامة | تمرر ناتج cat إلى grep." },
  { dayId: 4, prompt: "اكتب أمرًا يحفظ ناتج ls داخل ملف tolal_fals.txt مع مسح القديم.", answers: ["ls > tolal_fals.txt"], hint: "استخدم >", explanation: "> يكتب الناتج في ملف ويمسح محتواه السابق." },
  { dayId: 4, prompt: "اكتب أمرًا يضيف كلمة hello في نهاية filename.txt بدون مسح القديم.", answers: ["echo hello >> filename.txt", "echo \"hello\" >> filename.txt", "echo 'hello' >> filename.txt"], hint: "استخدم >>", explanation: ">> يضيف الناتج إلى نهاية الملف." },
  { dayId: 4, prompt: "اكتب أمرًا يعرض أول 10 أسطر من questions-source.txt ثم يعدّها باستخدام Pipe.", answers: ["head -n 10 questions-source.txt | wc -l", "head questions-source.txt | wc -l"], hint: "head ثم | ثم wc -l", explanation: "الناتج من head يذهب إلى wc -l لعد الأسطر." },
  { dayId: 4, prompt: "اكتب أمرًا يبحث عن (صح) ثم يحفظ النتيجة في filename.txt مع الإضافة لا المسح.", answers: ["grep -i \"(صح)\" questions-source.txt >> filename.txt", "grep -i '(صح)' questions-source.txt >> filename.txt"], hint: "grep -i ... >> filename.txt", explanation: "نجمع بين grep والإضافة للملف باستخدام >>." },
  { dayId: 4, prompt: "اكتب أمرًا يعرض الملفات المخفية ثم يحفظ الناتج في tolal_fals.txt.", answers: ["ls -la > tolal_fals.txt", "ls -lah > tolal_fals.txt"], hint: "ls -la مع >", explanation: "ls -la يعرض التفاصيل، و> يحفظ الناتج." },

  // Day 05
  { dayId: 5, prompt: "اكتب الأمر للبحث في المجلد الحالي عن كل ملفات .txt.", answers: ["find . -type f -name \"*.txt\"", "find . -type f -name '*.txt'"], hint: "find . -type f -name", explanation: "find . يبدأ من المجلد الحالي." },
  { dayId: 5, prompt: "اكتب أمرًا يبحث عن ملفات txt ثم يعدّ عدد النتائج.", answers: ["find . -type f -name \"*.txt\" | wc -l", "find . -type f -name '*.txt' | wc -l"], hint: "find ... | wc -l", explanation: "ناتج find يمر إلى wc -l." },
  { dayId: 5, prompt: "اكتب أمرًا يطبّق wc -l على كل ملف txt موجود باستخدام xargs.", answers: ["find . -name \"*.txt\" -print0 | xargs -0 wc -l", "find . -type f -name \"*.txt\" -print0 | xargs -0 wc -l"], hint: "find -print0 | xargs -0", explanation: "xargs يمرر قائمة الملفات إلى wc -l." },
  { dayId: 5, prompt: "اكتب أمرًا يحذف كل ملفات .tmp في المجلد الحالي باستخدام find و xargs.", answers: ["find . -name \"*.tmp\" -print0 | xargs -0 rm", "find . -name '*.tmp' -print0 | xargs -0 rm"], hint: "find -print0 | xargs -0 rm", explanation: "xargs ينفّذ rm على كل ملف مطابق." },

  // Day 06
  { dayId: 6, prompt: "اكتب الأمر لعرض الملفات مع صلاحيات rwx بالتفصيل.", answers: ["ls -l", "ls -la", "ls -lah"], hint: "ls -l", explanation: "ls -l يعرض الصلاحيات مثل -rw-r--r--." },
  { dayId: 6, prompt: "اكتب الأمر لجعل build_practice.py قابلًا للتنفيذ.", answers: ["chmod +x build_practice.py"], hint: "chmod +x + اسم الملف", explanation: "chmod +x يضيف صلاحية التنفيذ." },
  { dayId: 6, prompt: "اكتب صيغة تشغيل أمر بصلاحيات المدير، وليكن apt update.", answers: ["sudo apt update"], hint: "sudo قبل الأمر", explanation: "sudo يشغل الأمر بصلاحيات Root." },

  // Day 07
  { dayId: 7, prompt: "اكتب أمرًا ينشئ مجلد study ثم ينتقل إليه في نفس السطر.", answers: ["mkdir study && cd study"], hint: "استخدم && بين أمرين", explanation: "&& يشغّل الأمر الثاني فقط إذا نجح الأول." },
  { dayId: 7, prompt: "اكتب السطر الأول (Shebang) لسكربت bash.", answers: ["#!/bin/bash"], hint: "يبدأ بـ #!", explanation: "Shebang يحدد المفسر في أول سطر الملف." },
  { dayId: 7, prompt: "اكتب الأمر لتشغيل سكربت script.sh باستخدام bash.", answers: ["bash script.sh"], hint: "bash + اسم الملف", explanation: "bash script.sh يشغّل السكربت بدون ./" },
  { dayId: 7, prompt: "اكتب الأمر لعرض مسار مجلد البيت من متغير البيئة.", answers: ["echo $HOME"], hint: "echo $HOME", explanation: "echo $HOME يطبع مسار Home Directory." },
  { dayId: 7, prompt: "اكتب الأمر لجعل script.sh قابلًا للتشغيل بـ ./script.sh.", answers: ["chmod +x script.sh"], hint: "chmod +x", explanation: "بعد chmod +x يمكن تشغيل ./script.sh." },
  { dayId: 7, prompt: "اكتب الأمر لتشغيل سكربت script.sh مباشرة من المجلد الحالي.", answers: ["./script.sh"], hint: "./ قبل الاسم", explanation: "./script.sh يشغّل السكربت إذا كان قابلًا للتنفيذ." },
];

export function getPracticeForDay(dayId) {
  return practiceQuestions.filter((q) => q.dayId === dayId);
}
