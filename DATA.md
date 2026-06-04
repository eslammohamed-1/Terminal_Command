# بيانات المنهج

**مصدر الحقيقة الوحيد:** [`src/data/curriculum.ar.json`](src/data/curriculum.ar.json)

لا تعدّل [`terminal_7_days_commands_ar.json`](terminal_7_days_commands_ar.json) يدويًا — يُحدَّث تلقائيًا كمرآة عند إعادة البناء.

## تعديل المحتوى

1. أوامر وأيام: [`scripts/curriculum-base.json`](scripts/curriculum-base.json)
2. أسئلة الكتابة: [`scripts/practiceQuestions.source.js`](scripts/practiceQuestions.source.js) ثم:

```bash
node --input-type=module -e "import {practiceQuestions} from './scripts/practiceQuestions.source.js'; import {writeFileSync} from 'fs'; writeFileSync('scripts/practice-questions.seed.json', JSON.stringify(practiceQuestions,null,2));"
python3 scripts/build-curriculum-json.py
```

3. شغّل `npm run dev` للتجربة.
