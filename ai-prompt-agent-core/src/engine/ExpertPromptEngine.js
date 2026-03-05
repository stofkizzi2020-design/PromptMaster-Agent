/**
 * Expert Prompt Engine - محرك هندسة الأوامر المتقدم
 * يحول الأفكار البسيطة إلى برومبتات احترافية باستخدام منهجية خبراء هندسة الأوامر
 */

/* ═══════════════════════════════════════════════════════════════════════════
   البروتوكول السيادي — Supreme Prompt Protocol
   التعليمات الأساسية (System Instructions) للوكيل
   ═══════════════════════════════════════════════════════════════════════════ */
const SYSTEM_INSTRUCTIONS = `أنت المحرك الخفي لـ PromptMaster Pro. أنت لست مجرد شات بوت، بل أنت Prompt Engineer System.

أهدافك الثلاثة الكبرى:

1. الاستقصاء المتقدم:
   عند استلام فكرة من المستخدم، لا تنفذها فوراً.
   قم أولاً بتحليلها هندسياً لاستخراج:
   - الجمهور المستهدف
   - المتطلبات التقنية
   - القيود القانونية
   - نبرة الصوت

2. بناء الهياكل المعقدة:
   يجب أن يكون ردك مبنياً على هيكل احترافي يتضمن:
   • المهمة (Task): بصيغة فعل أمر قوية.
   • السياق (Context): وضع النموذج في بيئة خبيرة
     (مثلاً: أنت كبير مهندسين في Google).
   • القيود (Constraints): تحديد ما يجب تجنبه وما يجب التركيز عليه بدقة.
   • الصيغة (Output Format): تقديم النتائج في جداول، كود، أو نقاط مرتبة.

3. تعدد اللغات الفائق:
   أنت خبير في فيزياء اللغات (عربي، إنجليزي، فرنسي، إسباني، ألماني).
   عند توليد برومبت بالعربية، يجب أن يكون بليغاً وإدارياً رفيع المستوى.

التحسين الذاتي:
   إذا كان برومبت المستخدم ضعيفاً، قم بترقيته (Upgrade) آلياً إلى
   'برومبت خبير' دون أن يطلب منك ذلك.`;

export class ExpertPromptEngine {
  constructor() {
    /** البروتوكول السيادي — يُضخّ في كل برومبت يُولَّد */
    this.systemInstructions = SYSTEM_INSTRUCTIONS;

    this.roles = this.initRoles();
    this.contextTemplates = this.initContextTemplates();
    this.constraints = this.initConstraints();
    this.outputFormats = this.initOutputFormats();
  }

  /**
   * الحصول على التعليمات الأساسية للوكيل
   * @returns {string} البروتوكول السيادي
   */
  getSystemInstructions() {
    return this.systemInstructions;
  }

  /**
   * المحرك الرئيسي: تحويل فكرة بسيطة إلى برومبت احترافي
   * @param {Object} input - مدخلات المستخدم
   * @returns {Object} البرومبت المُحسّن مع التفاصيل
   */
  transform(input) {
    const { idea, category, tone, targetLength = 200 } = input;

    if (!idea || idea.trim().length < 3) {
      throw new Error('يرجى إدخال فكرة واضحة (3 أحرف على الأقل)');
    }

    // تحليل الفكرة واستخراج المعلومات
    const analysis = this.analyzeIdea(idea);
    
    // بناء مكونات البرومبت
    const components = {
      role: this.generateRole(analysis, category),
      context: this.generateContext(analysis, category),
      tasks: this.generateTasks(analysis, idea),
      constraints: this.generateConstraints(analysis, tone),
      outputFormat: this.generateOutputFormat(analysis, category)
    };

    // تجميع البرومبت النهائي
    const finalPrompt = this.assemblePrompt(components);
    
    // حساب الإحصائيات
    const stats = this.calculateStats(finalPrompt, targetLength);

    return {
      prompt: finalPrompt,
      components,
      analysis,
      stats,
      metadata: {
        category: category || analysis.detectedCategory,
        tone: tone || 'professional',
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * تحليل الفكرة واستخراج العناصر الرئيسية
   */
  analyzeIdea(idea) {
    const lowerIdea = idea.toLowerCase();
    
    // اكتشاف الفئة
    const detectedCategory = this.detectCategory(lowerIdea);
    
    // اكتشاف نوع المهمة
    const taskType = this.detectTaskType(lowerIdea);
    
    // استخراج الكلمات المفتاحية
    const keywords = this.extractKeywords(idea);
    
    // اكتشاف الموضوع الرئيسي
    const mainTopic = this.extractMainTopic(idea);
    
    // تحديد مستوى التعقيد
    const complexity = this.assessComplexity(idea);

    return {
      detectedCategory,
      taskType,
      keywords,
      mainTopic,
      complexity,
      originalLength: idea.length,
      wordCount: idea.split(/\s+/).length
    };
  }

  /**
   * اكتشاف الفئة من النص
   */
  detectCategory(text) {
    const categoryPatterns = {
      coding: /برمج|كود|api|function|دالة|تطبيق|موقع|react|python|javascript|sql|database/i,
      marketing: /تسويق|إعلان|سوشيال|منشور|حملة|براند|علامة تجارية|مبيعات|عميل/i,
      creative: /مقال|قصة|شعر|رواية|سيناريو|محتوى|كتابة|نص|إبداع/i,
      academic: /بحث|دراسة|تحليل|أكاديمي|علمي|مرجع|ورقة بحثية/i,
      business: /خطة عمل|استراتيجية|شركة|مشروع|ميزانية|تقرير/i,
      seo: /سيو|seo|محركات البحث|كلمات مفتاحية|ترتيب|جوجل/i
    };

    for (const [category, pattern] of Object.entries(categoryPatterns)) {
      if (pattern.test(text)) {
        return category;
      }
    }

    return 'general';
  }

  /**
   * اكتشاف نوع المهمة
   */
  detectTaskType(text) {
    const taskPatterns = {
      write: /اكتب|صياغة|تأليف|إنشاء محتوى/i,
      analyze: /حلل|تحليل|ادرس|قيّم/i,
      explain: /اشرح|وضّح|فسّر/i,
      create: /أنشئ|صمم|ابتكر|طور/i,
      fix: /أصلح|صحح|عدّل|حسّن/i,
      summarize: /لخص|اختصر|أوجز/i,
      translate: /ترجم|حوّل/i,
      compare: /قارن|وازن/i
    };

    for (const [task, pattern] of Object.entries(taskPatterns)) {
      if (pattern.test(text)) {
        return task;
      }
    }

    return 'create';
  }

  /**
   * استخراج الكلمات المفتاحية
   */
  extractKeywords(text) {
    // إزالة الكلمات الشائعة
    const stopWords = ['أريد', 'اكتب', 'لي', 'عن', 'في', 'من', 'إلى', 'على', 'مع', 'هذا', 'هذه', 'التي', 'الذي'];
    
    const words = text.split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !stopWords.includes(word))
      .slice(0, 10);

    return [...new Set(words)];
  }

  /**
   * استخراج الموضوع الرئيسي
   */
  extractMainTopic(text) {
    // إزالة أفعال الأمر والكلمات الشائعة للوصول للموضوع
    const cleaned = text
      .replace(/^(اكتب|أريد|ساعدني|أنشئ|صمم)\s*(لي)?\s*/i, '')
      .replace(/^(مقال|قصة|كود|برنامج)\s*(عن|حول)?\s*/i, '')
      .trim();

    return cleaned || text;
  }

  /**
   * تقييم مستوى التعقيد
   */
  assessComplexity(text) {
    const wordCount = text.split(/\s+/).length;
    
    if (wordCount <= 5) return 'simple';
    if (wordCount <= 15) return 'moderate';
    return 'complex';
  }

  /**
   * توليد الدور المناسب
   */
  generateRole(analysis, category) {
    const cat = category || analysis.detectedCategory;
    const roles = this.roles[cat] || this.roles.general;
    
    // اختيار الدور الأنسب بناءً على نوع المهمة
    const roleIndex = Math.min(
      Object.keys(roles).indexOf(analysis.taskType) !== -1 ? 
        Object.keys(roles).indexOf(analysis.taskType) : 0,
      roles.length - 1
    );

    return roles[roleIndex] || roles[0];
  }

  /**
   * توليد السياق
   */
  generateContext(analysis, category) {
    const cat = category || analysis.detectedCategory;
    const template = this.contextTemplates[cat] || this.contextTemplates.general;
    
    return template
      .replace('{topic}', analysis.mainTopic)
      .replace('{keywords}', analysis.keywords.join('، '))
      .replace('{complexity}', this.getComplexityLabel(analysis.complexity));
  }

  /**
   * توليد المهام
   */
  generateTasks(analysis, originalIdea) {
    const baseTask = this.getBaseTask(analysis.taskType, analysis.mainTopic);
    
    const tasks = [
      baseTask,
      ...this.getAdditionalTasks(analysis.detectedCategory, analysis.taskType)
    ];

    return tasks.slice(0, 5); // أقصى 5 مهام
  }

  /**
   * الحصول على المهمة الأساسية
   */
  getBaseTask(taskType, topic) {
    const taskTemplates = {
      write: `اكتب محتوى شاملاً ومفصلاً عن "${topic}"`,
      analyze: `قم بتحليل عميق ومنهجي لـ "${topic}"`,
      explain: `اشرح بالتفصيل وبطريقة مبسطة "${topic}"`,
      create: `أنشئ "${topic}" بأعلى معايير الجودة والاحترافية`,
      fix: `راجع وحسّن "${topic}" مع تصحيح أي أخطاء`,
      summarize: `لخّص "${topic}" بشكل موجز مع الحفاظ على النقاط الأساسية`,
      translate: `ترجم "${topic}" بدقة مع مراعاة السياق الثقافي`,
      compare: `قارن وحلل الفروقات في "${topic}"`
    };

    return taskTemplates[taskType] || taskTemplates.create;
  }

  /**
   * الحصول على مهام إضافية حسب الفئة
   */
  getAdditionalTasks(category, taskType) {
    const additionalTasks = {
      coding: [
        'اتبع أفضل الممارسات ومعايير الكود النظيف',
        'أضف تعليقات توضيحية واضحة',
        'تعامل مع حالات الخطأ المحتملة',
        'قدم أمثلة على الاستخدام'
      ],
      marketing: [
        'استهدف الجمهور بدقة',
        'استخدم لغة مقنعة ومحفزة',
        'أضف دعوة واضحة لاتخاذ إجراء (CTA)',
        'راعِ معايير SEO'
      ],
      creative: [
        'استخدم أسلوباً أدبياً جذاباً',
        'اهتم بالتشويق والتنوع في الصياغة',
        'اجعل المحتوى أصيلاً ومميزاً',
        'راعِ تسلسل الأفكار وترابطها'
      ],
      academic: [
        'استخدم منهجية علمية دقيقة',
        'ادعم الأفكار بمراجع ومصادر',
        'حافظ على الموضوعية والحياد',
        'التزم بالتنسيق الأكاديمي'
      ],
      seo: [
        'استخدم الكلمات المفتاحية بشكل طبيعي',
        'اهتم بالعناوين والعناوين الفرعية',
        'راعِ طول المحتوى المناسب لمحركات البحث',
        'أضف meta description مقترح'
      ],
      general: [
        'كن دقيقاً وشاملاً في الإجابة',
        'نظّم الأفكار بشكل منطقي',
        'استخدم أمثلة توضيحية عند الحاجة',
        'قدم خلاصة أو توصيات'
      ]
    };

    return additionalTasks[category] || additionalTasks.general;
  }

  /**
   * توليد القيود
   */
  generateConstraints(analysis, tone) {
    const baseConstraints = [
      'تجنب المقدمات الطويلة وادخل في الموضوع مباشرة',
      'لا تستخدم عبارات مثل "بالتأكيد" أو "بكل سرور"'
    ];

    const toneConstraints = {
      professional: [
        'حافظ على نبرة احترافية ورسمية',
        'تجنب العامية والتعبيرات غير الرسمية'
      ],
      casual: [
        'استخدم أسلوباً ودياً وقريباً من القارئ',
        'يمكنك استخدام بعض التعبيرات الخفيفة'
      ],
      creative: [
        'أطلق العنان للإبداع في الصياغة',
        'استخدم الصور البلاغية والاستعارات'
      ],
      academic: [
        'التزم بالأسلوب الأكاديمي الصارم',
        'تجنب الآراء الشخصية غير المدعومة'
      ]
    };

    const complexityConstraints = {
      simple: ['اجعل الإجابة مختصرة ومركزة'],
      moderate: ['وازن بين الشمولية والإيجاز'],
      complex: ['قدم تفاصيل عميقة ومتشعبة']
    };

    return [
      ...baseConstraints,
      ...(toneConstraints[tone] || toneConstraints.professional),
      ...(complexityConstraints[analysis.complexity] || [])
    ];
  }

  /**
   * توليد تنسيق المخرجات
   */
  generateOutputFormat(analysis, category) {
    const formats = {
      coding: {
        format: 'code',
        instructions: 'قدم الكود في blocks مع تحديد اللغة، وأضف شرحاً نصياً قبل وبعد الكود'
      },
      marketing: {
        format: 'structured',
        instructions: 'استخدم عناوين واضحة، نقاط مرقمة، وأبرز العناصر الأساسية'
      },
      creative: {
        format: 'prose',
        instructions: 'اكتب بأسلوب سردي متدفق مع فقرات منظمة'
      },
      academic: {
        format: 'academic',
        instructions: 'استخدم تنسيق البحث العلمي: مقدمة، منهجية، نتائج، استنتاجات'
      },
      seo: {
        format: 'seo',
        instructions: 'قدم: العنوان الرئيسي (H1)، العناوين الفرعية (H2, H3)، الفقرات، meta description'
      },
      general: {
        format: 'markdown',
        instructions: 'استخدم Markdown للتنسيق مع عناوين ونقاط وأمثلة'
      }
    };

    return formats[category] || formats[analysis.detectedCategory] || formats.general;
  }

  /**
   * تجميع البرومبت النهائي
   */
  assemblePrompt(components) {
    const { role, context, tasks, constraints, outputFormat } = components;

    // ── حقن البروتوكول السيادي كتوجيهات نظام ──
    let prompt = `## تعليمات النظام\n${this.systemInstructions}\n\n`;
    prompt += `## الدور\n${role}\n\n`;
    prompt += `## السياق\n${context}\n\n`;
    prompt += `## المهام المطلوبة\n`;
    tasks.forEach((task, i) => {
      prompt += `${i + 1}. ${task}\n`;
    });
    prompt += `\n## القيود والتوجيهات\n`;
    constraints.forEach(constraint => {
      prompt += `- ${constraint}\n`;
    });
    prompt += `\n## تنسيق المخرجات\n`;
    prompt += `${outputFormat.instructions}`;

    return prompt;
  }

  /**
   * حساب الإحصائيات
   */
  calculateStats(prompt, targetLength) {
    const words = prompt.split(/\s+/).filter(w => w.length > 0);
    const chars = prompt.length;
    const lines = prompt.split('\n').length;

    return {
      wordCount: words.length,
      charCount: chars,
      lineCount: lines,
      targetLength,
      meetsTarget: words.length >= targetLength * 0.8,
      qualityScore: this.calculateQualityScore(prompt)
    };
  }

  /**
   * حساب درجة الجودة
   */
  calculateQualityScore(prompt) {
    let score = 0;

    // التحقق من وجود المكونات الأساسية
    if (prompt.includes('## الدور')) score += 20;
    if (prompt.includes('## السياق')) score += 20;
    if (prompt.includes('## المهام')) score += 20;
    if (prompt.includes('## القيود')) score += 20;
    if (prompt.includes('## تنسيق')) score += 20;

    return Math.min(100, score);
  }

  /**
   * تحسين برومبت موجود (One-Click Optimization)
   */
  optimize(existingPrompt) {
    // تحليل البرومبت الحالي
    const analysis = this.analyzeIdea(existingPrompt);
    
    // إعادة بنائه كبرومبت احترافي
    return this.transform({
      idea: existingPrompt,
      category: analysis.detectedCategory
    });
  }

  /**
   * الحصول على تسمية مستوى التعقيد
   */
  getComplexityLabel(complexity) {
    const labels = {
      simple: 'بسيط ومباشر',
      moderate: 'متوسط التعقيد',
      complex: 'معقد ومتشعب'
    };
    return labels[complexity] || labels.moderate;
  }

  // ===== البيانات الأساسية =====

  initRoles() {
    return {
      coding: [
        'أنت مهندس برمجيات سينيور بخبرة +10 سنوات في تطوير الأنظمة والتطبيقات. تتميز بكتابة كود نظيف وقابل للصيانة.',
        'أنت مبرمج Full-Stack محترف متخصص في بناء التطبيقات الحديثة باستخدام أحدث التقنيات.',
        'أنت خبير في هندسة البرمجيات ومراجعة الكود، تركز على الأداء والأمان وأفضل الممارسات.'
      ],
      marketing: [
        'أنت خبير تسويق رقمي ومتخصص في استراتيجيات النمو. لديك سجل حافل في زيادة المبيعات والتحويلات.',
        'أنت كاتب إعلانات محترف (Copywriter) تتقن فن الإقناع وتحويل الكلمات إلى أرباح.',
        'أنت استراتيجي محتوى ومتخصص في بناء العلامات التجارية والتواصل مع الجمهور.'
      ],
      creative: [
        'أنت كاتب محتوى إبداعي موهوب، تجيد صياغة النصوص الجذابة والمؤثرة بأسلوب أدبي راقٍ.',
        'أنت مؤلف وسيناريست محترف، تتقن فن السرد القصصي وبناء الحبكات المشوقة.',
        'أنت شاعر وأديب، تمتلك ملكة لغوية فريدة في صياغة المحتوى الإبداعي.'
      ],
      academic: [
        'أنت باحث أكاديمي متخصص، تتقن المنهجية العلمية وكتابة الأبحاث المحكمة.',
        'أنت أستاذ جامعي وخبير في المجال، تشرح المفاهيم المعقدة بطريقة منهجية وواضحة.'
      ],
      seo: [
        'أنت خبير SEO محترف بخبرة واسعة في تصدر نتائج محركات البحث. تفهم خوارزميات جوجل بعمق.',
        'أنت متخصص في تحسين المحتوى لمحركات البحث، تجمع بين الجودة والتقنية.'
      ],
      business: [
        'أنت مستشار أعمال استراتيجي، ساعدت شركات كبرى في تحقيق النمو والنجاح.',
        'أنت محلل أعمال خبير، تتقن دراسة الأسواق وبناء خطط العمل الفعالة.'
      ],
      general: [
        'أنت مساعد ذكي خبير ومتعدد المهارات، تقدم إجابات دقيقة وشاملة ومنظمة.',
        'أنت خبير متخصص في المجال المطلوب، تقدم معلومات موثوقة ونصائح عملية.'
      ]
    };
  }

  initContextTemplates() {
    return {
      coding: 'المستخدم يحتاج مساعدة برمجية في "{topic}". الكلمات المفتاحية: {keywords}. مستوى الطلب: {complexity}. الهدف هو الحصول على كود عملي ونظيف يمكن استخدامه مباشرة.',
      marketing: 'المطلوب إنشاء محتوى تسويقي عن "{topic}". الكلمات المفتاحية المستهدفة: {keywords}. الهدف هو جذب الجمهور وتحفيزه على التفاعل والتحويل.',
      creative: 'المطلوب كتابة محتوى إبداعي حول "{topic}". العناصر الأساسية: {keywords}. الهدف هو إنتاج نص أصيل ومؤثر يترك انطباعاً لدى القارئ.',
      academic: 'المطلوب إعداد محتوى أكاديمي/بحثي عن "{topic}". المحاور: {keywords}. مستوى العمق: {complexity}. يجب الالتزام بالمعايير العلمية.',
      seo: 'المطلوب إنشاء محتوى محسّن لـ SEO عن "{topic}". الكلمات المفتاحية المستهدفة: {keywords}. الهدف هو التصدر في نتائج البحث مع تقديم قيمة حقيقية.',
      business: 'المطلوب إعداد محتوى أعمال حول "{topic}". العناصر: {keywords}. مستوى التفصيل: {complexity}.',
      general: 'المستخدم يطلب المساعدة في "{topic}". النقاط الرئيسية: {keywords}. مستوى التفصيل المطلوب: {complexity}.'
    };
  }

  initConstraints() {
    return {
      universal: [
        'تجنب المقدمات الطويلة',
        'لا تكرر السؤال في الإجابة',
        'كن محدداً وتجنب العمومية'
      ]
    };
  }

  initOutputFormats() {
    return {
      markdown: 'Markdown مع عناوين وقوائم',
      code: 'Code blocks مع الشرح',
      table: 'جداول منظمة',
      json: 'JSON منسق',
      prose: 'نص سردي متصل'
    };
  }
}

export default ExpertPromptEngine;
