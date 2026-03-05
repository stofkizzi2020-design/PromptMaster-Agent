/**
 * Prompt Store - مخزن البرومبتات
 * لتخزين البرومبتات التي أنشأها المستخدم في Local Storage
 */

export class PromptStore {
  constructor(storageKey = 'ai_prompt_agent_prompts') {
    this.storageKey = storageKey;
    this.maxItems = 100;
    this.init();
  }

  /**
   * تهيئة المخزن
   */
  init() {
    if (!this.getStorage()) {
      this.setStorage([]);
    }
  }

  /**
   * الحصول على جميع البرومبتات
   */
  getAll() {
    return this.getStorage() || [];
  }

  /**
   * الحصول على برومبت بواسطة المعرف
   */
  getById(id) {
    const prompts = this.getAll();
    return prompts.find(p => p.id === id);
  }

  /**
   * حفظ برومبت جديد
   */
  save(promptData) {
    const prompts = this.getAll();
    
    const newPrompt = {
      id: this.generateId(),
      text: promptData.text || promptData,
      category: promptData.category || null,
      tone: promptData.tone || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: promptData.tags || [],
      isFavorite: false
    };

    // إضافة في البداية
    prompts.unshift(newPrompt);

    // الحفاظ على الحد الأقصى
    if (prompts.length > this.maxItems) {
      prompts.pop();
    }

    this.setStorage(prompts);
    return newPrompt;
  }

  /**
   * تحديث برومبت موجود
   */
  update(id, updates) {
    const prompts = this.getAll();
    const index = prompts.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('البرومبت غير موجود');
    }

    prompts[index] = {
      ...prompts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.setStorage(prompts);
    return prompts[index];
  }

  /**
   * حذف برومبت
   */
  delete(id) {
    const prompts = this.getAll();
    const filtered = prompts.filter(p => p.id !== id);
    this.setStorage(filtered);
    return true;
  }

  /**
   * تبديل حالة المفضلة
   */
  toggleFavorite(id) {
    const prompt = this.getById(id);
    if (prompt) {
      return this.update(id, { isFavorite: !prompt.isFavorite });
    }
    return null;
  }

  /**
   * الحصول على المفضلات
   */
  getFavorites() {
    return this.getAll().filter(p => p.isFavorite);
  }

  /**
   * البحث في البرومبتات
   */
  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(p => 
      p.text.toLowerCase().includes(lowerQuery) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  /**
   * الفلترة حسب الفئة
   */
  getByCategory(category) {
    return this.getAll().filter(p => p.category === category);
  }

  /**
   * الفلترة حسب التاريخ
   */
  getByDateRange(startDate, endDate) {
    return this.getAll().filter(p => {
      const date = new Date(p.createdAt);
      return date >= startDate && date <= endDate;
    });
  }

  /**
   * مسح جميع البرومبتات
   */
  clearAll() {
    this.setStorage([]);
  }

  /**
   * تصدير البرومبتات
   */
  export() {
    const prompts = this.getAll();
    return JSON.stringify(prompts, null, 2);
  }

  /**
   * استيراد البرومبتات
   */
  import(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      if (!Array.isArray(imported)) {
        throw new Error('البيانات غير صالحة');
      }

      const existingPrompts = this.getAll();
      const existingIds = new Set(existingPrompts.map(p => p.id));

      // إضافة البرومبتات الجديدة فقط
      const newPrompts = imported.filter(p => !existingIds.has(p.id));
      
      this.setStorage([...newPrompts, ...existingPrompts]);
      return newPrompts.length;
    } catch (error) {
      throw new Error('فشل في استيراد البيانات: ' + error.message);
    }
  }

  /**
   * الحصول على الإحصائيات
   */
  getStats() {
    const prompts = this.getAll();
    
    const categoryCounts = prompts.reduce((acc, p) => {
      const cat = p.category || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return {
      total: prompts.length,
      favorites: prompts.filter(p => p.isFavorite).length,
      byCategory: categoryCounts,
      lastCreated: prompts[0]?.createdAt || null
    };
  }

  // === الدوال المساعدة الخاصة ===

  getStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  setStorage(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to storage:', error);
      // محاولة تنظيف البيانات القديمة
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
    }
  }

  generateId() {
    return 'prompt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  cleanup() {
    const prompts = this.getAll();
    // الاحتفاظ بالنصف الأحدث فقط
    const half = Math.floor(prompts.length / 2);
    this.setStorage(prompts.slice(0, half));
  }

  // === Compatibility Aliases ===
  
  /**
   * Alias for getAll() - used by components
   */
  getSavedPrompts() {
    return this.getAll();
  }

  /**
   * Alias for save() - used by components
   */
  savePrompt(promptData) {
    const newPrompt = {
      id: promptData.id || this.generateId(),
      text: promptData.fullPrompt || promptData.idea || promptData.text,
      title: promptData.title,
      idea: promptData.idea,
      fullPrompt: promptData.fullPrompt,
      category: promptData.category || null,
      tone: promptData.tone || null,
      quality: promptData.quality,
      components: promptData.components,
      createdAt: promptData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: promptData.tags || [],
      isFavorite: promptData.favorite || false
    };

    const prompts = this.getAll();
    prompts.unshift(newPrompt);

    if (prompts.length > this.maxItems) {
      prompts.pop();
    }

    this.setStorage(prompts);
    return newPrompt;
  }

  /**
   * Get history - alias for recent prompts
   */
  getHistory() {
    return this.getAll().slice(0, 20);
  }
}

export default PromptStore;
