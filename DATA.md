# بيانات المشروع — مصدران للحقيقة

## 1) المنهج (أوامر + مذاكرة + مسار اليوم)

**الملف:** [`src/data/curriculum.ar.json`](src/data/curriculum.ar.json)

**التعديل:**
1. [`scripts/curriculum-base.json`](scripts/curriculum-base.json) — أوامر وأيام
2. `python3 scripts/build-curriculum-json.py`

مرآة اختيارية: [`terminal_7_days_commands_ar.json`](terminal_7_days_commands_ar.json)

---

## 2) الأسئلة (اختبار + كتابة)

**الملف:** [`src/data/questions.v2.ar.json`](src/data/questions.v2.ar.json)

- **30 MCQ** + **30 typing** لكل يوم (210 + 210 = 420 سؤال)
- `scoring` و `ui_copy` في جذر الملف

**التعديل:** عدّل الملف مباشرة (أو النسخة في الجذر [`terminal_7_days_training_questions_v2_ar.json`](terminal_7_days_training_questions_v2_ar.json) ثم انسخها إلى `src/data/`).

```bash
cp terminal_7_days_training_questions_v2_ar.json src/data/questions.v2.ar.json
npm run dev
```

---

## التحميل في الكود

| الوظيفة | الملف |
|---------|--------|
| أوامر، Lab، goal | [`src/lib/curriculumLoader.js`](src/lib/curriculumLoader.js) |
| MCQ، typing، ui_copy | [`src/lib/questionsLoader.js`](src/lib/questionsLoader.js) |
| خلط + مطابقة إجابات | [`src/lib/quiz.js`](src/lib/quiz.js) |
