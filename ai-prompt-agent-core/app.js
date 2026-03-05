/**
 * AI Prompt Agent Core - نقطة الانطلاق الرئيسية
 * وكيل ذكي لتحسين وإنشاء البرومبتات
 */

import { Input } from './src/components/Input.js';
import { Result } from './src/components/Result.js';
import { Sidebar } from './src/components/Sidebar.js';
import { PromptBuilder } from './src/engine/promptBuilder.js';
import { PromptValidator } from './src/engine/validators.js';
import { PromptStore } from './src/store/PromptStore.js';

class PromptAgentApp {
  constructor() {
    this.builder = new PromptBuilder();
    this.validator = new PromptValidator();
    this.store = new PromptStore();
    
    this.components = {
      input: null,
      result: null,
      sidebar: null
    };

    this.lastInput = null;
    this.init();
  }

  /**
   * تهيئة التطبيق
   */
  async init() {
    this.renderLayout();
    this.initComponents();
    this.attachGlobalListeners();
    console.log('🚀 AI Prompt Agent initialized successfully!');
  }

  /**
   * إنشاء التخطيط الأساسي
   */
  renderLayout() {
    const app = document.getElementById('app');
    
    if (!app) {
      console.error('App container not found!');
      return;
    }

    app.innerHTML = `
      <div class="app-container">
        <!-- Sidebar -->
        <aside id="sidebar-container" class="sidebar-wrapper"></aside>
        
        <!-- Main Content -->
        <main class="main-content">
          <header class="app-header">
            <h1 class="text-gradient">🤖 مساعد البرومبت الذكي</h1>
            <p class="header-subtitle">حوّل أفكارك إلى برومبتات احترافية</p>
          </header>
          
          <div class="content-grid">
            <!-- Input Section -->
            <section id="input-container" class="input-section"></section>
            
            <!-- Result Section -->
            <section id="result-container" class="result-section"></section>
          </div>
          
          <!-- Stats Footer -->
          <footer class="app-footer">
            <div id="stats-container" class="stats"></div>
          </footer>
        </main>
      </div>
    `;

    this.addLayoutStyles();
  }

  /**
   * إضافة أنماط التخطيط
   */
  addLayoutStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .app-container {
        display: flex;
        min-height: 100vh;
        direction: rtl;
      }
      
      .sidebar-wrapper {
        width: 320px;
        flex-shrink: 0;
      }
      
      .main-content {
        flex: 1;
        padding: 2rem;
        margin-right: 320px;
        max-width: 1200px;
      }
      
      .app-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .app-header h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }
      
      .header-subtitle {
        color: var(--text-secondary, #94a3b8);
        font-size: 1.1rem;
      }
      
      .content-grid {
        display: grid;
        gap: 2rem;
      }
      
      .input-section,
      .result-section {
        width: 100%;
      }
      
      .app-footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .stats {
        display: flex;
        justify-content: center;
        gap: 2rem;
        color: var(--text-secondary, #94a3b8);
        font-size: 0.875rem;
      }
      
      @media (max-width: 768px) {
        .app-container {
          flex-direction: column;
        }
        
        .sidebar-wrapper {
          width: 100%;
          position: relative;
        }
        
        .main-content {
          margin-right: 0;
          padding: 1rem;
        }
        
        .app-header h1 {
          font-size: 1.75rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * تهيئة المكونات
   */
  initComponents() {
    this.components.input = new Input('input-container');
    this.components.result = new Result('result-container');
    this.components.sidebar = new Sidebar('sidebar-container');
    
    this.updateStats();
  }

  /**
   * إضافة المستمعين العامين
   */
  attachGlobalListeners() {
    // إنشاء البرومبت
    document.addEventListener('generatePrompt', (e) => {
      this.handleGenerate(e.detail);
    });

    // حفظ البرومبت
    document.addEventListener('savePrompt', (e) => {
      this.handleSave(e.detail);
    });

    // إعادة إنشاء البرومبت
    document.addEventListener('regeneratePrompt', () => {
      if (this.lastInput) {
        this.handleGenerate(this.lastInput);
      }
    });

    // استخدام برومبت محفوظ
    document.addEventListener('usePrompt', (e) => {
      this.handleUsePrompt(e.detail);
    });

    // استخدام قالب
    document.addEventListener('useTemplate', (e) => {
      this.handleUseTemplate(e.detail);
    });

    // اختصارات لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter لإنشاء البرومبت
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const input = this.components.input.getValue();
        if (input.text) {
          this.handleGenerate(input);
        }
      }
      
      // Ctrl/Cmd + S للحفظ
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this.components.result.currentPrompt) {
          this.handleSave({ prompt: this.components.result.currentPrompt });
        }
      }
    });
  }

  /**
   * معالجة إنشاء البرومبت
   */
  async handleGenerate(input) {
    this.lastInput = input;
    this.components.input.disable();
    this.components.result.showLoading();

    try {
      // بناء البرومبت
      const prompt = this.builder.build(input);
      
      // التحقق من الجودة
      const validation = this.validator.validate(prompt);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      // محاكاة تأخير للتأثير البصري
      await this.delay(500);

      // عرض النتيجة
      this.components.result.displayPrompt(prompt, {
        category: this.getCategoryLabel(input.category),
        tone: this.getToneLabel(input.tone)
      });

      // عرض التحذيرات إن وجدت
      if (validation.warnings.length > 0) {
        console.warn('تحذيرات:', validation.warnings);
      }

      // عرض الاقتراحات
      if (validation.suggestions.length > 0) {
        console.info('اقتراحات:', validation.suggestions);
      }

    } catch (error) {
      this.components.result.showError(error.message);
    } finally {
      this.components.input.enable();
      this.updateStats();
    }
  }

  /**
   * معالجة حفظ البرومبت
   */
  handleSave(data) {
    const saved = this.store.save({
      text: data.prompt,
      category: this.lastInput?.category,
      tone: this.lastInput?.tone
    });

    // تحديث الشريط الجانبي
    this.components.sidebar.refresh();
    this.updateStats();
    
    return saved;
  }

  /**
   * استخدام برومبت محفوظ
   */
  handleUsePrompt(prompt) {
    this.components.result.displayPrompt(prompt.text, {
      category: this.getCategoryLabel(prompt.category),
      tone: this.getToneLabel(prompt.tone)
    });
  }

  /**
   * استخدام قالب
   */
  handleUseTemplate(template) {
    // تعيين الفئة في المدخلات
    const categorySelect = document.querySelector('#category-select');
    if (categorySelect && template.category) {
      categorySelect.value = template.category;
    }

    // تحديث placeholder
    const textarea = document.querySelector('#prompt-input');
    if (textarea) {
      textarea.placeholder = `أدخل ${template.name}...`;
      textarea.focus();
    }

    // حفظ القالب للاستخدام
    this.currentTemplate = template;
  }

  /**
   * تحديث الإحصائيات
   */
  updateStats() {
    const stats = this.store.getStats();
    const statsContainer = document.getElementById('stats-container');
    
    if (statsContainer) {
      statsContainer.innerHTML = `
        <span>📝 البرومبتات المحفوظة: ${stats.total}</span>
        <span>⭐ المفضلة: ${stats.favorites}</span>
        <span>📅 آخر إنشاء: ${stats.lastCreated ? this.formatDate(stats.lastCreated) : '-'}</span>
      `;
    }
  }

  /**
   * دوال مساعدة
   */
  getCategoryLabel(category) {
    const labels = {
      marketing: 'تسويق',
      coding: 'برمجة',
      creative: 'كتابة إبداعية'
    };
    return labels[category] || category || '-';
  }

  getToneLabel(tone) {
    const labels = {
      professional: 'احترافية',
      casual: 'غير رسمية',
      creative: 'إبداعية',
      academic: 'أكاديمية'
    };
    return labels[tone] || tone || '-';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} دقيقة`;
    if (diff < 86400000) return `منذ ${Math.floor(diff / 3600000)} ساعة`;
    
    return date.toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric'
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  window.promptAgent = new PromptAgentApp();
});

export default PromptAgentApp;
