/**
 * Prompt Builder - منشئ البرومبت
 * المسؤول عن دمج مدخلات المستخدم بالقوالب لإنشاء برومبتات محسّنة
 */

export class PromptBuilder {
  constructor() {
    this.templates = new Map();
    this.modifiers = {
      professional: 'بأسلوب احترافي ومنظم',
      casual: 'بأسلوب ودي وغير رسمي',
      creative: 'بأسلوب إبداعي ومبتكر',
      academic: 'بأسلوب أكاديمي ورسمي'
    };
    
    this.categoryPrefixes = {
      marketing: 'أنت خبير تسويق محترف. ',
      coding: 'أنت مبرمج خبير ومهندس برمجيات. ',
      creative: 'أنت كاتب إبداعي موهوب. '
    };
  }

  /**
   * بناء البرومبت من المدخلات
   * @param {Object} input - مدخلات المستخدم
   * @returns {string} البرومبت المُحسّن
   */
  build(input) {
    const { text, category, tone, template } = input;
    
    if (!text && !template) {
      throw new Error('يجب توفير نص أو قالب');
    }

    let prompt = '';

    // إضافة بادئة الفئة
    if (category && this.categoryPrefixes[category]) {
      prompt += this.categoryPrefixes[category];
    }

    // استخدام القالب إذا كان متوفراً
    if (template) {
      prompt += this.applyTemplate(template, text);
    } else {
      prompt += this.enhanceText(text, category);
    }

    // إضافة معدّل النبرة
    if (tone && this.modifiers[tone]) {
      prompt += `\n\nالمطلوب: ${this.modifiers[tone]}.`;
    }

    // إضافة تعليمات الجودة
    prompt += this.addQualityInstructions(category);

    return this.finalizePrompt(prompt);
  }

  /**
   * تطبيق القالب على النص
   */
  applyTemplate(template, userText) {
    let result = template.template;
    
    // استبدال المتغيرات في القالب
    const variables = {
      '{topic}': userText || '',
      '{input}': userText || '',
      '{subject}': userText || '',
      '{description}': userText || ''
    };

    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(key, 'g'), value);
    }

    return result;
  }

  /**
   * تحسين النص الأساسي
   */
  enhanceText(text, category) {
    const enhancements = {
      marketing: this.enhanceForMarketing(text),
      coding: this.enhanceForCoding(text),
      creative: this.enhanceForCreative(text),
      default: this.enhanceDefault(text)
    };

    return enhancements[category] || enhancements.default;
  }

  enhanceForMarketing(text) {
    return `
أريد منك المساعدة في: ${text}

يرجى تقديم:
1. استراتيجية تسويقية واضحة
2. نقاط القوة والجذب الرئيسية
3. الجمهور المستهدف
4. أفكار للمحتوى التسويقي
5. دعوة لاتخاذ إجراء (CTA) فعّالة
    `.trim();
  }

  enhanceForCoding(text) {
    return `
أحتاج مساعدة برمجية في: ${text}

المطلوب:
1. كود نظيف وموثق
2. شرح خطوة بخطوة
3. أفضل الممارسات المتبعة
4. معالجة الأخطاء المحتملة
5. أمثلة على الاستخدام
    `.trim();
  }

  enhanceForCreative(text) {
    return `
أريد كتابة محتوى إبداعي عن: ${text}

المطلوب:
1. أفكار مبتكرة وجذابة
2. أسلوب كتابة مميز
3. عناصر سردية قوية
4. لغة مؤثرة وعاطفية
5. بنية منظمة ومتماسكة
    `.trim();
  }

  enhanceDefault(text) {
    return `
أحتاج مساعدتك في: ${text}

المطلوب:
1. إجابة شاملة ومفصلة
2. معلومات دقيقة وموثوقة
3. تنظيم واضح للأفكار
4. أمثلة عملية عند الحاجة
5. خلاصة أو نصائح إضافية
    `.trim();
  }

  /**
   * إضافة تعليمات الجودة
   */
  addQualityInstructions(category) {
    const instructions = {
      marketing: '\n\nتأكد من أن المحتوى يحفز العميل على اتخاذ إجراء.',
      coding: '\n\nتأكد من أن الكود قابل للصيانة وسهل الفهم.',
      creative: '\n\nتأكد من أن المحتوى أصيل وملهم.',
      default: '\n\nتأكد من الدقة والوضوح في الإجابة.'
    };

    return instructions[category] || instructions.default;
  }

  /**
   * التنظيف النهائي للبرومبت
   */
  finalizePrompt(prompt) {
    return prompt
      .trim()
      .replace(/\n{3,}/g, '\n\n')  // إزالة الأسطر الفارغة الزائدة
      .replace(/\s+$/gm, '');       // إزالة المسافات في نهاية الأسطر
  }

  /**
   * إنشاء برومبت من قالب محدد
   */
  fromTemplate(templateId, variables = {}) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`القالب غير موجود: ${templateId}`);
    }

    let result = template.content;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return this.finalizePrompt(result);
  }

  /**
   * تسجيل قالب جديد
   */
  registerTemplate(id, content, metadata = {}) {
    this.templates.set(id, { content, ...metadata });
  }

  /**
   * إضافة معدّل نبرة جديد
   */
  addModifier(key, value) {
    this.modifiers[key] = value;
  }
}

export default PromptBuilder;
