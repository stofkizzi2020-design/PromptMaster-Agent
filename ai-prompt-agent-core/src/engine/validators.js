/**
 * Validators - التحقق من صحة البرومبت
 * للتأكد من جودة البرومبت قبل عرضه
 */

export class PromptValidator {
  constructor() {
    this.minLength = 10;
    this.maxLength = 4000;
    this.requiredElements = [];
  }

  /**
   * التحقق الشامل من البرومبت
   * @param {string} prompt - البرومبت للتحقق
   * @returns {Object} نتيجة التحقق
   */
  validate(prompt) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    // التحقق من الطول
    const lengthCheck = this.checkLength(prompt);
    if (!lengthCheck.valid) {
      errors.push(lengthCheck.message);
    }

    // التحقق من المحتوى الفارغ
    if (this.isEmpty(prompt)) {
      errors.push('البرومبت فارغ');
    }

    // التحقق من الوضوح
    const clarityCheck = this.checkClarity(prompt);
    if (!clarityCheck.isGood) {
      warnings.push(...clarityCheck.issues);
      suggestions.push(...clarityCheck.suggestions);
    }

    // التحقق من البنية
    const structureCheck = this.checkStructure(prompt);
    if (!structureCheck.isGood) {
      suggestions.push(...structureCheck.suggestions);
    }

    // حساب درجة الجودة
    const qualityScore = this.calculateQualityScore(prompt, errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      qualityScore,
      stats: this.getStats(prompt)
    };
  }

  /**
   * التحقق من الطول
   */
  checkLength(prompt) {
    const length = prompt.trim().length;
    
    if (length < this.minLength) {
      return {
        valid: false,
        message: `البرومبت قصير جداً (${length} حرف). الحد الأدنى: ${this.minLength} حرف`
      };
    }
    
    if (length > this.maxLength) {
      return {
        valid: false,
        message: `البرومبت طويل جداً (${length} حرف). الحد الأقصى: ${this.maxLength} حرف`
      };
    }

    return { valid: true };
  }

  /**
   * التحقق من أن البرومبت ليس فارغاً
   */
  isEmpty(prompt) {
    return !prompt || prompt.trim().length === 0;
  }

  /**
   * التحقق من وضوح البرومبت
   */
  checkClarity(prompt) {
    const issues = [];
    const suggestions = [];

    // التحقق من وجود أفعال
    if (!this.containsActionWords(prompt)) {
      issues.push('البرومبت لا يحتوي على طلب واضح');
      suggestions.push('أضف فعل أمر مثل: اكتب، صمم، حلل، اشرح');
    }

    // التحقق من التحديد
    if (this.isTooVague(prompt)) {
      issues.push('البرومبت غير محدد بما فيه الكفاية');
      suggestions.push('أضف تفاصيل أكثر مثل: الجمهور المستهدف، السياق، الأهداف');
    }

    // التحقق من التكرار
    if (this.hasExcessiveRepetition(prompt)) {
      issues.push('البرومبت يحتوي على تكرار زائد');
      suggestions.push('حاول تنويع الصياغة وتجنب التكرار');
    }

    return {
      isGood: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * التحقق من بنية البرومبت
   */
  checkStructure(prompt) {
    const suggestions = [];

    // التحقق من وجود أقسام
    const hasSections = /\d+\.|[•-]|\n\n/.test(prompt);
    if (prompt.length > 200 && !hasSections) {
      suggestions.push('يُفضل تقسيم البرومبت الطويل إلى أقسام أو نقاط');
    }

    // التحقق من وجود سياق
    if (!this.hasContext(prompt)) {
      suggestions.push('إضافة سياق أو خلفية قد يحسن النتائج');
    }

    // التحقق من وجود مثال
    if (!this.hasExample(prompt) && prompt.length > 100) {
      suggestions.push('إضافة مثال قد يساعد في توضيح المطلوب');
    }

    return {
      isGood: suggestions.length === 0,
      suggestions
    };
  }

  /**
   * التحقق من وجود أفعال الأمر
   */
  containsActionWords(prompt) {
    const actionWords = [
      'اكتب', 'صمم', 'أنشئ', 'حلل', 'اشرح', 'قدم', 'ساعد',
      'طور', 'ابتكر', 'راجع', 'حسّن', 'ترجم', 'لخص', 'قارن',
      'write', 'create', 'design', 'analyze', 'explain', 'help',
      'develop', 'generate', 'review', 'improve', 'translate'
    ];
    
    const lowerPrompt = prompt.toLowerCase();
    return actionWords.some(word => lowerPrompt.includes(word));
  }

  /**
   * التحقق من أن البرومبت غامض جداً
   */
  isTooVague(prompt) {
    const vaguePatterns = [
      /^(شيء|حاجة|أي شيء|something)/i,
      /^(ساعدني|help me)$/i,
      /^(أريد|i want)$/i
    ];

    const wordCount = prompt.trim().split(/\s+/).length;
    if (wordCount < 5) return true;

    return vaguePatterns.some(pattern => pattern.test(prompt.trim()));
  }

  /**
   * التحقق من التكرار الزائد
   */
  hasExcessiveRepetition(prompt) {
    const words = prompt.toLowerCase().split(/\s+/);
    const wordCount = {};
    
    words.forEach(word => {
      if (word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    const maxRepetition = Math.max(...Object.values(wordCount));
    return maxRepetition > words.length * 0.2;
  }

  /**
   * التحقق من وجود سياق
   */
  hasContext(prompt) {
    const contextIndicators = [
      'السياق', 'الخلفية', 'بالنسبة لـ', 'في مجال',
      'context', 'background', 'regarding', 'about'
    ];
    
    return contextIndicators.some(indicator => 
      prompt.toLowerCase().includes(indicator)
    );
  }

  /**
   * التحقق من وجود مثال
   */
  hasExample(prompt) {
    const exampleIndicators = [
      'مثال', 'على سبيل المثال', 'كمثال',
      'example', 'for instance', 'such as', 'like'
    ];
    
    return exampleIndicators.some(indicator => 
      prompt.toLowerCase().includes(indicator)
    );
  }

  /**
   * حساب درجة الجودة
   */
  calculateQualityScore(prompt, errors, warnings) {
    let score = 100;

    // خصم للأخطاء
    score -= errors.length * 25;

    // خصم للتحذيرات
    score -= warnings.length * 10;

    // مكافأة للطول المناسب
    const length = prompt.length;
    if (length >= 100 && length <= 2000) {
      score += 5;
    }

    // مكافأة للبنية الجيدة
    if (/\d+\.|[•-]/.test(prompt)) {
      score += 5;
    }

    // مكافأة للوضوح
    if (this.containsActionWords(prompt)) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * إحصائيات البرومبت
   */
  getStats(prompt) {
    const words = prompt.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = prompt.split(/[.!?؟]+/).filter(s => s.trim().length > 0);
    const paragraphs = prompt.split(/\n\n+/).filter(p => p.trim().length > 0);

    return {
      characters: prompt.length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordLength: words.length > 0 
        ? (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(1)
        : 0
    };
  }

  /**
   * تحديد الحدود
   */
  setLimits(min, max) {
    this.minLength = min;
    this.maxLength = max;
  }
}

// دوال مساعدة للتصدير
export const validatePrompt = (prompt) => {
  const validator = new PromptValidator();
  return validator.validate(prompt);
};

export const getPromptStats = (prompt) => {
  const validator = new PromptValidator();
  return validator.getStats(prompt);
};

export default PromptValidator;
