# 🤖 AI Prompt Agent Core

وكيل ذكي لتحسين وإنشاء البرومبتات - حوّل أفكارك إلى برومبتات احترافية

## 📁 هيكل المشروع

```
ai-prompt-agent-core/
│
├── /public                # الملفات العامة
│   └── /assets            # الرسوميات والأنماط الأولية
│       ├── styles.css     # الأنماط الأساسية
│       └── animations.css # الحركات والتأثيرات
│
├── /src                   # الكود المصدري
│   ├── /components        # مكونات الواجهة
│   │   ├── Input.js       # مكون الإدخال
│   │   ├── Result.js      # مكون عرض النتيجة
│   │   └── Sidebar.js     # الشريط الجانبي
│   │
│   ├── /engine            # قلب الوكيل - منطق تحسين البرومبت
│   │   ├── promptBuilder.js # بناء ودمج البرومبتات
│   │   └── validators.js    # التحقق من جودة البرومبت
│   │
│   ├── /store             # التخزين المحلي
│   │   └── PromptStore.js # إدارة البرومبتات المحفوظة
│   │
│   └── /styles            # ملفات التنسيق
│       └── main.css       # Tailwind CSS
│
├── /templates             # مكتبة القوالب
│   ├── marketing.json     # قوالب التسويق
│   ├── coding.json        # قوالب البرمجة
│   └── creative.json      # قوالب الكتابة الإبداعية
│
├── app.js                 # نقطة الانطلاق الرئيسية
├── index.html             # صفحة HTML الرئيسية
├── package.json           # التبعيات
├── vite.config.js         # إعدادات Vite
├── tailwind.config.js     # إعدادات Tailwind
└── postcss.config.js      # إعدادات PostCSS
```

## 🚀 التشغيل

### التثبيت

```bash
npm install
```

### وضع التطوير

```bash
npm run dev
```

### البناء للإنتاج

```bash
npm run build
```

## ✨ المميزات

- 📝 **إنشاء برومبتات احترافية** - تحويل الأفكار البسيطة إلى برومبتات محسّنة
- 📚 **مكتبة قوالب** - قوالب جاهزة للتسويق والبرمجة والكتابة الإبداعية
- 💾 **حفظ البرومبتات** - تخزين محلي للبرومبتات المفضلة
- ✅ **التحقق من الجودة** - تحليل وتقييم جودة البرومبت
- 🎨 **واجهة عربية** - تصميم RTL مع دعم كامل للعربية

## 🔧 التقنيات المستخدمة

- **Vite** - أداة البناء السريعة
- **Tailwind CSS** - للتنسيق
- **Vanilla JavaScript** - ES6 Modules
- **Local Storage** - للتخزين المحلي

## 📖 استخدام المحرك

```javascript
import { PromptBuilder } from './src/engine/promptBuilder.js';
import { PromptValidator } from './src/engine/validators.js';

const builder = new PromptBuilder();
const validator = new PromptValidator();

// إنشاء برومبت
const prompt = builder.build({
  text: 'كتابة مقال عن الذكاء الاصطناعي',
  category: 'creative',
  tone: 'professional'
});

// التحقق من الجودة
const validation = validator.validate(prompt);
console.log(validation.qualityScore); // 0-100
```

## 📄 License

MIT
