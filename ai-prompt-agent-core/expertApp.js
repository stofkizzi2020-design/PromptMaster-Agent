/**
 * AI Prompt Agent Core - Expert Edition
 * نقطة الانطلاق الرئيسية للوكيل المتقدم
 */

import { SmartInput } from './src/components/SmartInput.js';
import { SplitScreenPreview } from './src/components/SplitScreenPreview.js';
import { Sidebar } from './src/components/Sidebar.js';
import { ExpertPromptEngine } from './src/engine/ExpertPromptEngine.js';
import { PromptValidator } from './src/engine/validators.js';
import { PromptStore } from './src/store/PromptStore.js';

class ExpertPromptAgentApp {
  constructor() {
    this.engine = new ExpertPromptEngine();
    this.validator = new PromptValidator();
    this.store = new PromptStore();
    
    this.components = {
      smartInput: null,
      preview: null,
      sidebar: null
    };

    this.lastInput = null;
    this.lastResult = null;
    this.isLiveMode = true;
    
    this.init();
  }

  /**
   * تهيئة التطبيق
   */
  async init() {
    this.renderLayout();
    this.initComponents();
    this.attachGlobalListeners();
    this.initKeyboardShortcuts();
    
    console.log('🚀 Expert AI Prompt Agent initialized!');
    this.showWelcomeMessage();
  }

  /**
   * إنشاء التخطيط الرئيسي - Split Screen
   */
  renderLayout() {
    const app = document.getElementById('app');
    
    if (!app) {
      console.error('App container not found!');
      return;
    }

    app.innerHTML = `
      <div class="expert-app-container">
        <!-- Sidebar -->
        <aside id="sidebar-container" class="expert-sidebar"></aside>
        
        <!-- Main Content - Split Screen -->
        <main class="expert-main">
          <!-- Header -->
          <header class="expert-header">
            <div class="header-content">
              <div class="logo-section">
                <span class="logo-icon">🤖</span>
                <div class="logo-text">
                  <h1>مساعد البرومبت الخبير</h1>
                  <p class="tagline">حوّل أفكارك البسيطة إلى برومبتات احترافية</p>
                </div>
              </div>
              
              <div class="header-actions">
                <div class="mode-toggle">
                  <button id="live-mode-btn" class="mode-btn active" title="الوضع المباشر">
                    ⚡ مباشر
                  </button>
                  <button id="manual-mode-btn" class="mode-btn" title="الوضع اليدوي">
                    ✋ يدوي
                  </button>
                </div>
                
                <button id="help-btn" class="help-btn" title="المساعدة">
                  ❓
                </button>
              </div>
            </div>
          </header>

          <!-- Split Screen Container -->
          <div class="split-container">
            <!-- Left Panel - Input -->
            <section class="panel input-panel">
              <div class="panel-header">
                <span class="panel-icon">✏️</span>
                <span class="panel-title">فكرتك</span>
              </div>
              <div id="smart-input-container" class="panel-content"></div>
            </section>

            <!-- Divider -->
            <div class="panel-divider" id="panel-divider">
              <div class="divider-handle">
                <span class="divider-icon">⟷</span>
              </div>
            </div>

            <!-- Right Panel - Preview -->
            <section class="panel preview-panel">
              <div class="panel-header">
                <span class="panel-icon">✨</span>
                <span class="panel-title">البرومبت الاحترافي</span>
              </div>
              <div id="preview-container" class="panel-content"></div>
            </section>
          </div>

          <!-- Footer Stats -->
          <footer class="expert-footer">
            <div class="footer-stats">
              <span class="stat">
                <span class="stat-icon">📝</span>
                <span id="total-generated">0</span> تم إنشاؤها
              </span>
              <span class="stat">
                <span class="stat-icon">💾</span>
                <span id="total-saved">0</span> محفوظة
              </span>
              <span class="stat">
                <span class="stat-icon">⌨️</span>
                <kbd>Ctrl</kbd>+<kbd>Enter</kbd> للإنشاء السريع
              </span>
            </div>
            
            <div class="footer-branding">
              Powered by <strong>Expert Prompt Engine</strong> v2.0
            </div>
          </footer>
        </main>
      </div>
      
      <!-- Help Modal -->
      <div id="help-modal" class="modal hidden">
        <div class="modal-content help-content">
          <div class="modal-header">
            <h3>🎯 كيفية الاستخدام</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="help-section">
              <h4>✍️ كتابة الفكرة</h4>
              <p>اكتب فكرتك بشكل بسيط مثل: "اكتب لي مقال عن الذكاء الاصطناعي"</p>
            </div>
            <div class="help-section">
              <h4>⚡ التحويل التلقائي</h4>
              <p>سيقوم النظام بتحليل فكرتك وتحويلها إلى برومبت احترافي يتضمن: الدور، السياق، المهام، القيود، والتنسيق</p>
            </div>
            <div class="help-section">
              <h4>🎹 اختصارات لوحة المفاتيح</h4>
              <ul>
                <li><kbd>Ctrl</kbd>+<kbd>Enter</kbd> - إنشاء البرومبت</li>
                <li><kbd>Ctrl</kbd>+<kbd>S</kbd> - حفظ البرومبت</li>
                <li><kbd>Ctrl</kbd>+<kbd>C</kbd> - نسخ البرومبت</li>
                <li><kbd>Esc</kbd> - إغلاق النوافذ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    this.addLayoutStyles();
  }

  /**
   * إضافة أنماط التخطيط المتقدم
   */
  addLayoutStyles() {
    const style = document.createElement('style');
    style.id = 'expert-app-styles';
    style.textContent = `
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
        background: #0f172a;
        color: #e2e8f0;
        font-family: 'Cairo', 'Inter', sans-serif;
        overflow-x: hidden;
      }

      .expert-app-container {
        display: flex;
        min-height: 100vh;
        direction: rtl;
      }

      /* Sidebar */
      .expert-sidebar {
        width: 300px;
        flex-shrink: 0;
        background: rgba(15, 23, 42, 0.95);
        border-left: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Main Content */
      .expert-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        overflow: hidden;
      }

      /* Header */
      .expert-header {
        background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 16px 24px;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1600px;
        margin: 0 auto;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .logo-icon {
        font-size: 2.5rem;
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      .logo-text h1 {
        margin: 0;
        font-size: 1.5rem;
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #22c55e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .tagline {
        margin: 4px 0 0;
        font-size: 0.9rem;
        color: #64748b;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .mode-toggle {
        display: flex;
        background: rgba(30, 41, 59, 0.8);
        border-radius: 10px;
        padding: 4px;
      }

      .mode-btn {
        padding: 8px 16px;
        background: none;
        border: none;
        border-radius: 8px;
        color: #64748b;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .mode-btn:hover {
        color: #e2e8f0;
      }

      .mode-btn.active {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
      }

      .help-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(51, 65, 85, 0.5);
        border: 1px solid #475569;
        color: #94a3b8;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .help-btn:hover {
        background: rgba(99, 102, 241, 0.3);
        color: #fff;
      }

      /* Split Container */
      .split-container {
        flex: 1;
        display: flex;
        padding: 24px;
        gap: 0;
        overflow: hidden;
      }

      .panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        background: rgba(30, 41, 59, 0.3);
        border-radius: 16px;
        overflow: hidden;
      }

      .panel-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px;
        background: rgba(51, 65, 85, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .panel-icon {
        font-size: 1.3rem;
      }

      .panel-title {
        font-weight: 600;
        color: #e2e8f0;
      }

      .panel-content {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
      }

      /* Divider */
      .panel-divider {
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: col-resize;
        position: relative;
      }

      .divider-handle {
        width: 6px;
        height: 60px;
        background: rgba(99, 102, 241, 0.3);
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .divider-handle:hover {
        background: rgba(99, 102, 241, 0.6);
        width: 8px;
      }

      .divider-icon {
        color: #6366f1;
        font-size: 0.8rem;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .panel-divider:hover .divider-icon {
        opacity: 1;
      }

      /* Footer */
      .expert-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        background: rgba(15, 23, 42, 0.8);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .footer-stats {
        display: flex;
        gap: 24px;
      }

      .stat {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #64748b;
        font-size: 0.85rem;
      }

      .stat-icon {
        font-size: 1rem;
      }

      kbd {
        display: inline-block;
        padding: 2px 6px;
        background: rgba(51, 65, 85, 0.5);
        border: 1px solid #475569;
        border-radius: 4px;
        font-size: 0.75rem;
        font-family: monospace;
      }

      .footer-branding {
        color: #475569;
        font-size: 0.8rem;
      }

      .footer-branding strong {
        color: #6366f1;
      }

      /* Modal */
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal.hidden {
        display: none;
      }

      .modal-content {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 16px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        animation: modalIn 0.3s ease;
      }

      @keyframes modalIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #334155;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 1.2rem;
      }

      .modal-close {
        background: none;
        border: none;
        color: #64748b;
        font-size: 1.5rem;
        cursor: pointer;
      }

      .modal-body {
        padding: 24px;
      }

      .help-section {
        margin-bottom: 24px;
      }

      .help-section h4 {
        margin: 0 0 8px;
        color: #6366f1;
      }

      .help-section p,
      .help-section li {
        color: #94a3b8;
        line-height: 1.6;
      }

      .help-section ul {
        padding-right: 20px;
        margin: 8px 0 0;
      }

      .help-section li {
        margin-bottom: 8px;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .expert-sidebar {
          position: fixed;
          right: -300px;
          top: 0;
          height: 100vh;
          z-index: 100;
          transition: right 0.3s;
        }

        .expert-sidebar.open {
          right: 0;
        }

        .split-container {
          flex-direction: column;
          padding: 16px;
        }

        .panel-divider {
          width: 100%;
          height: 24px;
          cursor: row-resize;
        }

        .divider-handle {
          width: 60px;
          height: 6px;
        }
      }

      @media (max-width: 640px) {
        .header-content {
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }

        .logo-section {
          flex-direction: column;
        }

        .footer-stats {
          flex-wrap: wrap;
          justify-content: center;
        }

        .expert-footer {
          flex-direction: column;
          gap: 12px;
          text-align: center;
        }
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(30, 41, 59, 0.5);
      }

      ::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }

      /* Loader */
      .loader {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(99, 102, 241, 0.3);
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * تهيئة المكونات
   */
  initComponents() {
    this.components.smartInput = new SmartInput('smart-input-container');
    this.components.preview = new SplitScreenPreview('preview-container');
    this.components.sidebar = new Sidebar('sidebar-container');

    // ربط المدخلات بالمعاينة المباشرة
    this.components.smartInput.onInput((input) => {
      if (this.isLiveMode) {
        this.handleLiveUpdate(input);
      }
    });

    this.updateStats();
  }

  /**
   * إضافة المستمعين العامين
   */
  attachGlobalListeners() {
    // إنشاء البرومبت
    document.addEventListener('generateExpertPrompt', (e) => {
      this.handleGenerate(e.detail);
    });

    // حفظ البرومبت
    document.addEventListener('savePrompt', (e) => {
      this.handleSave(e.detail);
    });

    // تحسين البرومبت (One-Click Optimization)
    document.addEventListener('optimizePrompt', () => {
      this.handleOptimize();
    });

    // استخدام برومبت محفوظ
    document.addEventListener('usePrompt', (e) => {
      this.handleUsePrompt(e.detail);
    });

    // استخدام قالب
    document.addEventListener('useTemplate', (e) => {
      this.handleUseTemplate(e.detail);
    });

    // أزرار الوضع
    document.getElementById('live-mode-btn').addEventListener('click', () => {
      this.setMode('live');
    });

    document.getElementById('manual-mode-btn').addEventListener('click', () => {
      this.setMode('manual');
    });

    // زر المساعدة
    document.getElementById('help-btn').addEventListener('click', () => {
      this.toggleHelpModal();
    });

    // إغلاق المودال
    document.querySelector('.modal-close').addEventListener('click', () => {
      this.toggleHelpModal(false);
    });

    document.getElementById('help-modal').addEventListener('click', (e) => {
      if (e.target.id === 'help-modal') {
        this.toggleHelpModal(false);
      }
    });
  }

  /**
   * اختصارات لوحة المفاتيح
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter = إنشاء البرومبت
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const input = this.components.smartInput.getValue();
        if (input.idea.trim()) {
          this.handleGenerate(input);
        }
      }

      // Ctrl/Cmd + S = حفظ البرومبت
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (this.lastResult) {
          this.handleSave({ prompt: this.lastResult.prompt });
        }
      }

      // Escape = إغلاق المودال
      if (e.key === 'Escape') {
        this.toggleHelpModal(false);
      }
    });
  }

  /**
   * التحديث المباشر للمعاينة
   */
  handleLiveUpdate(input) {
    if (!input.idea || input.idea.trim().length < 5) {
      this.components.preview.showEmptyState();
      return;
    }

    // Debounce للتحديث
    clearTimeout(this.liveUpdateTimer);
    this.liveUpdateTimer = setTimeout(() => {
      this.components.preview.updateLivePreview(input);
    }, 300);
  }

  /**
   * إنشاء البرومبت الاحترافي
   */
  async handleGenerate(input) {
    this.lastInput = input;
    this.components.smartInput.disable();
    this.components.preview.showLoading();

    try {
      // تحويل الفكرة باستخدام المحرك الخبير
      const result = this.engine.transform(input);
      
      this.lastResult = result;

      // محاكاة تأخير للتأثير البصري
      await this.delay(600);

      // عرض النتيجة
      this.components.preview.displayPrompt(result);

      // تحديث الإحصائيات
      this.incrementGenerated();

      console.log('✅ Prompt generated successfully', result);

    } catch (error) {
      console.error('Generation error:', error);
      this.showNotification(error.message, 'error');
    } finally {
      this.components.smartInput.enable();
    }
  }

  /**
   * التحسين السحري (One-Click Optimization)
   */
  async handleOptimize() {
    if (!this.lastResult) return;

    this.components.preview.showLoading();

    try {
      // إعادة التوليد مع تحسينات
      const optimized = this.engine.optimize(this.lastResult.prompt);
      
      await this.delay(800);

      this.lastResult = optimized;
      this.components.preview.displayPrompt(optimized);
      
      this.showNotification('تم تحسين البرومبت! ✨');

    } catch (error) {
      console.error('Optimization error:', error);
      this.showNotification('فشل التحسين', 'error');
    }
  }

  /**
   * حفظ البرومبت
   */
  handleSave(data) {
    if (!data.prompt) return;

    const saved = this.store.save({
      text: data.prompt,
      category: this.lastResult?.metadata?.category,
      tone: this.lastResult?.metadata?.tone
    });

    this.components.sidebar.refresh();
    this.updateStats();
    this.showNotification('تم الحفظ بنجاح! 💾');
    
    return saved;
  }

  /**
   * استخدام برومبت محفوظ
   */
  handleUsePrompt(prompt) {
    this.components.smartInput.setValue(prompt.text);
  }

  /**
   * استخدام قالب
   */
  handleUseTemplate(template) {
    this.components.smartInput.setValue(template.template);
  }

  /**
   * تبديل الوضع
   */
  setMode(mode) {
    this.isLiveMode = mode === 'live';
    
    document.getElementById('live-mode-btn').classList.toggle('active', mode === 'live');
    document.getElementById('manual-mode-btn').classList.toggle('active', mode === 'manual');
  }

  /**
   * تبديل مودال المساعدة
   */
  toggleHelpModal(show) {
    const modal = document.getElementById('help-modal');
    if (show === undefined) {
      modal.classList.toggle('hidden');
    } else {
      modal.classList.toggle('hidden', !show);
    }
  }

  /**
   * عرض رسالة ترحيب
   */
  showWelcomeMessage() {
    console.log(`
    ╔═══════════════════════════════════════════╗
    ║   🤖 Expert AI Prompt Agent v2.0          ║
    ║   ─────────────────────────────────────   ║
    ║   حوّل أفكارك إلى برومبتات احترافية      ║
    ║                                           ║
    ║   ⌨️  Ctrl+Enter للإنشاء السريع          ║
    ║   💾  Ctrl+S للحفظ                        ║
    ╚═══════════════════════════════════════════╝
    `);
  }

  /**
   * تحديث الإحصائيات
   */
  updateStats() {
    const stats = this.store.getStats();
    
    const savedEl = document.getElementById('total-saved');
    if (savedEl) {
      savedEl.textContent = stats.total;
    }
  }

  /**
   * زيادة عداد الإنشاء
   */
  incrementGenerated() {
    const el = document.getElementById('total-generated');
    if (el) {
      el.textContent = parseInt(el.textContent || 0) + 1;
    }
  }

  /**
   * عرض إشعار
   */
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 24px;
      padding: 12px 24px;
      background: ${type === 'success' ? '#22c55e' : '#ef4444'};
      color: white;
      border-radius: 10px;
      font-weight: 500;
      z-index: 1001;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2500);
  }

  /**
   * تأخير
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// تشغيل التطبيق
document.addEventListener('DOMContentLoaded', () => {
  window.expertPromptAgent = new ExpertPromptAgentApp();
});

export default ExpertPromptAgentApp;
