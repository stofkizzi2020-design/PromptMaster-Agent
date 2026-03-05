/**
 * PromptMaster Pro - Main Application Entry Point
 * Professional SaaS Prompt Engineering Platform
 */

import { Layout } from './src/components/Layout.js';
import { Dashboard } from './src/components/Dashboard.js';
import { PromptGenerator } from './src/components/PromptGenerator.js';
import { ExpertPromptEngine } from './src/engine/ExpertPromptEngine.js';
import { PromptStore } from './src/store/PromptStore.js';
import './src/styles/main.css';

class PromptMasterApp {
  constructor() {
    this.store = new PromptStore();
    this.engine = new ExpertPromptEngine();
    this.layout = null;
    this.currentPage = 'dashboard';
    this.init();
  }

  init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bootstrap());
    } else {
      this.bootstrap();
    }
  }

  bootstrap() {
    // Initialize layout
    this.layout = new Layout('app');
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load initial page
    this.navigateTo('dashboard');
    
    // Initialize toast system
    this.initToastSystem();
    
    console.log('PromptMaster Pro initialized');
  }

  setupEventListeners() {
    // Navigation
    document.addEventListener('navigate', (e) => {
      this.navigateTo(e.detail.page);
    });

    // New prompt
    document.addEventListener('newPrompt', () => {
      this.navigateTo('generator');
    });

    // Show toast
    document.addEventListener('showToast', (e) => {
      this.showToast(e.detail.message, e.detail.type);
    });

    // Edit prompt
    document.addEventListener('editPrompt', (e) => {
      this.editPrompt(e.detail.id);
    });

    // View prompt
    document.addEventListener('viewPrompt', (e) => {
      this.viewPrompt(e.detail.id);
    });

    // Use template
    document.addEventListener('useTemplate', (e) => {
      this.useTemplate(e.detail.templateId);
    });

    // Open search
    document.addEventListener('openSearch', () => {
      this.openSearchModal();
    });

    // Open optimizer
    document.addEventListener('openOptimizer', () => {
      this.openOptimizerModal();
    });

    // Open import
    document.addEventListener('openImport', () => {
      this.openImportModal();
    });

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }

      // Ctrl/Cmd + N for new prompt
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        this.navigateTo('generator');
      }

      // Ctrl/Cmd + / for help
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        this.showKeyboardShortcuts();
      }
    });
  }

  navigateTo(page) {
    this.currentPage = page;
    const container = this.layout.getContentContainer();
    
    switch (page) {
      case 'dashboard':
        const dashboard = new Dashboard(container, this.store);
        dashboard.render();
        break;
      case 'generator':
        const generator = new PromptGenerator(container, this.engine, this.store);
        generator.render();
        break;
      case 'templates':
        this.renderTemplatesPage(container);
        break;
      case 'history':
        this.renderHistoryPage(container);
        break;
      case 'saved':
        this.renderSavedPage(container);
        break;
      case 'favorites':
        this.renderFavoritesPage(container);
        break;
      case 'collections':
        this.renderCollectionsPage(container);
        break;
      case 'settings':
        this.renderSettingsPage(container);
        break;
      case 'help':
        this.renderHelpPage(container);
        break;
      default:
        const defaultDashboard = new Dashboard(container, this.store);
        defaultDashboard.render();
    }

    // Update active nav item
    this.updateNavigation(page);
  }

  updateNavigation(page) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === page) {
        item.classList.add('active');
      }
    });

    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb-item');
    if (breadcrumb) {
      const pageTitles = {
        dashboard: 'Dashboard',
        generator: 'Prompt Generator',
        templates: 'Templates',
        history: 'History',
        saved: 'Saved Prompts',
        favorites: 'Favorites',
        collections: 'Collections',
        settings: 'Settings',
        help: 'Help & Support'
      };
      breadcrumb.textContent = pageTitles[page] || 'Dashboard';
    }
  }

  renderTemplatesPage(container) {
    container.innerHTML = `
      <div class="templates-page">
        <div class="page-header">
          <div class="page-title-section">
            <h1 class="page-title">Templates</h1>
            <p class="page-description">Browse and use pre-built prompt templates for various use cases.</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" id="create-template-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              <span>Create Template</span>
            </button>
          </div>
        </div>
        
        <div class="template-categories">
          ${this.renderTemplateCategories()}
        </div>
      </div>
    `;
  }

  renderTemplateCategories() {
    const categories = [
      { id: 'marketing', name: 'Marketing', count: 5, color: 'blue' },
      { id: 'coding', name: 'Development', count: 6, color: 'green' },
      { id: 'creative', name: 'Creative Writing', count: 6, color: 'purple' },
      { id: 'business', name: 'Business', count: 4, color: 'amber' },
      { id: 'academic', name: 'Academic', count: 3, color: 'cyan' },
      { id: 'seo', name: 'SEO', count: 4, color: 'indigo' }
    ];

    return `
      <div class="stats-grid">
        ${categories.map(cat => `
          <div class="stat-card cursor-pointer hover:border-indigo-200" data-category="${cat.id}">
            <div class="stat-icon ${cat.color}">
              ${this.getCategoryIcon(cat.id)}
            </div>
            <div class="stat-content">
              <span class="stat-value">${cat.count}</span>
              <span class="stat-label">${cat.name}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  getCategoryIcon(category) {
    const icons = {
      marketing: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
      coding: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      creative: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/></svg>',
      business: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>',
      academic: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
      seo: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
    };
    return icons[category] || icons.marketing;
  }

  renderHistoryPage(container) {
    const history = this.store.getSavedPrompts() || [];
    
    container.innerHTML = `
      <div class="history-page">
        <div class="page-header">
          <div class="page-title-section">
            <h1 class="page-title">History</h1>
            <p class="page-description">View and manage your prompt generation history.</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-secondary" id="clear-history-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
              <span>Clear All</span>
            </button>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-content">
            ${history.length > 0 ? this.renderPromptsList(history) : this.renderEmptyState('No history yet', 'Your prompt generation history will appear here.')}
          </div>
        </div>
      </div>
    `;
  }

  renderSavedPage(container) {
    const saved = this.store.getSavedPrompts() || [];
    
    container.innerHTML = `
      <div class="saved-page">
        <div class="page-header">
          <div class="page-title-section">
            <h1 class="page-title">Saved Prompts</h1>
            <p class="page-description">Access your saved prompts for quick reuse.</p>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-content">
            ${saved.length > 0 ? this.renderPromptsList(saved) : this.renderEmptyState('No saved prompts', 'Save your best prompts for easy access.')}
          </div>
        </div>
      </div>
    `;
  }

  renderFavoritesPage(container) {
    const favorites = (this.store.getSavedPrompts() || []).filter(p => p.favorite);
    
    container.innerHTML = `
      <div class="favorites-page">
        <div class="page-header">
          <div class="page-title-section">
            <h1 class="page-title">Favorites</h1>
            <p class="page-description">Your starred and favorite prompts.</p>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-content">
            ${favorites.length > 0 ? this.renderPromptsList(favorites) : this.renderEmptyState('No favorites yet', 'Star your best prompts to add them here.')}
          </div>
        </div>
      </div>
    `;
  }

  renderCollectionsPage(container) {
    container.innerHTML = `
      <div class="collections-page">
        <div class="page-header">
          <div class="page-title-section">
            <h1 class="page-title">Collections</h1>
            <p class="page-description">Organize your prompts into custom collections.</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-primary" id="create-collection-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              <span>New Collection</span>
            </button>
          </div>
        </div>
        
        <div class="dashboard-card">
          <div class="card-content">
            ${this.renderEmptyState('No collections yet', 'Create collections to organize your prompts.')}
          </div>
        </div>
      </div>
    `;
  }

  renderSettingsPage(container) {
    container.innerHTML = `
      <div class="settings-page">
        <div class="page-header">
          <div class="page-title-section">
            <h1 class="page-title">Settings</h1>
            <p class="page-description">Configure your PromptMaster preferences.</p>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <div class="card-header">
              <h2 class="card-title">General</h2>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label class="form-label">Default Category</label>
                <div class="select-wrapper">
                  <select class="form-select" id="default-category">
                    <option value="auto">Auto-detect</option>
                    <option value="coding">Development</option>
                    <option value="marketing">Marketing</option>
                    <option value="creative">Creative Writing</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="select-icon">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Default Tone</label>
                <div class="select-wrapper">
                  <select class="form-select" id="default-tone">
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="select-icon">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-header">
              <h2 class="card-title">Data</h2>
            </div>
            <div class="card-content">
              <div class="form-group">
                <button class="btn btn-secondary btn-full" id="export-data-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                  </svg>
                  <span>Export All Data</span>
                </button>
              </div>
              <div class="form-group">
                <button class="btn btn-secondary btn-full" id="import-data-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" x2="12" y1="3" y2="15"/>
                  </svg>
                  <span>Import Data</span>
                </button>
              </div>
              <div class="form-group">
                <button class="btn btn-secondary btn-full text-red-600" id="clear-data-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  <span>Clear All Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderHelpPage(container) {
    container.innerHTML = `
      <div class="help-page">
        <div class="page-header">
          <div class="page-title-section">
            <h1 class="page-title">Help & Support</h1>
            <p class="page-description">Get help with using PromptMaster Pro.</p>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <div class="card-header">
              <h2 class="card-title">Keyboard Shortcuts</h2>
            </div>
            <div class="card-content">
              <div class="tips-list">
                <div class="tip-item">
                  <div class="tip-icon">⌘K</div>
                  <div class="tip-content">
                    <span class="tip-title">Search</span>
                    <span class="tip-desc">Open quick search</span>
                  </div>
                </div>
                <div class="tip-item">
                  <div class="tip-icon">⌘N</div>
                  <div class="tip-content">
                    <span class="tip-title">New Prompt</span>
                    <span class="tip-desc">Create a new prompt</span>
                  </div>
                </div>
                <div class="tip-item">
                  <div class="tip-icon">⌘↵</div>
                  <div class="tip-content">
                    <span class="tip-title">Generate</span>
                    <span class="tip-desc">Generate prompt</span>
                  </div>
                </div>
                <div class="tip-item">
                  <div class="tip-icon">Esc</div>
                  <div class="tip-content">
                    <span class="tip-title">Close</span>
                    <span class="tip-desc">Close modal/dialog</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-card tips-card">
            <div class="card-header">
              <h2 class="card-title">Quick Tips</h2>
            </div>
            <div class="card-content">
              <div class="tips-list">
                <div class="tip-item">
                  <div class="tip-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                      <path d="M9 18h6"/>
                      <path d="M10 22h4"/>
                    </svg>
                  </div>
                  <div class="tip-content">
                    <span class="tip-title">Be Specific</span>
                    <span class="tip-desc">Include context, constraints, and desired output format.</span>
                  </div>
                </div>
                <div class="tip-item">
                  <div class="tip-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                  </div>
                  <div class="tip-content">
                    <span class="tip-title">Use Structure</span>
                    <span class="tip-desc">Break prompts into role, context, tasks, and constraints.</span>
                  </div>
                </div>
                <div class="tip-item">
                  <div class="tip-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                    </svg>
                  </div>
                  <div class="tip-content">
                    <span class="tip-title">Iterate</span>
                    <span class="tip-desc">Refine prompts based on outputs for better results.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderPromptsList(prompts) {
    return `
      <div class="prompts-list">
        ${prompts.map(prompt => `
          <div class="prompt-item" data-id="${prompt.id}">
            <div class="prompt-item-icon ${this.getColorFromCategory(prompt.category)}">
              ${this.getCategoryIcon(prompt.category || 'marketing')}
            </div>
            <div class="prompt-item-content">
              <span class="prompt-item-title">${this.truncate(prompt.title || prompt.idea, 50)}</span>
              <span class="prompt-item-meta">${prompt.category || 'General'} • ${this.formatDate(prompt.createdAt)}</span>
            </div>
            <div class="prompt-item-actions">
              <button class="icon-btn" data-action="copy" title="Copy">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              </button>
              <button class="icon-btn" data-action="delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderEmptyState(title, description) {
    return `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
          <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/>
          <path d="M15 3v4a2 2 0 0 0 2 2h4"/>
        </svg>
        <p class="empty-title">${title}</p>
        <p class="empty-desc">${description}</p>
      </div>
    `;
  }

  getColorFromCategory(category) {
    const colors = {
      coding: 'green',
      marketing: 'blue',
      creative: 'purple',
      academic: 'cyan',
      seo: 'amber',
      business: 'indigo'
    };
    return colors[category?.toLowerCase()] || 'gray';
  }

  truncate(str, length) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  formatDate(date) {
    if (!date) return 'Just now';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  editPrompt(id) {
    const prompt = this.store.getSavedPrompts().find(p => p.id === id);
    if (prompt) {
      // Navigate to generator with preloaded data
      this.navigateTo('generator');
      setTimeout(() => {
        const ideaInput = document.querySelector('#idea-input');
        if (ideaInput && prompt.idea) {
          ideaInput.value = prompt.idea;
          ideaInput.dispatchEvent(new Event('input'));
        }
      }, 100);
    }
  }

  viewPrompt(id) {
    const prompt = this.store.getSavedPrompts().find(p => p.id === id);
    if (prompt) {
      this.showPromptModal(prompt);
    }
  }

  showPromptModal(prompt) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width: 600px;">
        <div class="modal-header">
          <h3 class="modal-title">${this.truncate(prompt.title || prompt.idea, 40)}</h3>
          <button class="modal-close" id="close-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <div class="preview-quality mb-4">
            <span class="quality-label">Quality Score</span>
            <div class="quality-bar">
              <div class="quality-fill" style="width: ${prompt.quality || 85}%"></div>
            </div>
            <span class="quality-value">${prompt.quality || 85}%</span>
          </div>
          <div class="preview-text">
            ${prompt.fullPrompt || prompt.idea}
          </div>
        </div>
        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button class="btn btn-secondary" id="copy-prompt-btn">Copy</button>
          <button class="btn btn-primary" id="use-prompt-btn">Use as Template</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelector('#copy-prompt-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(prompt.fullPrompt || prompt.idea);
      this.showToast('Copied to clipboard');
    });

    modal.querySelector('#use-prompt-btn').addEventListener('click', () => {
      modal.remove();
      this.editPrompt(prompt.id);
    });
  }

  useTemplate(templateId) {
    // Navigate to generator with template
    this.navigateTo('generator');
    this.showToast('Template loaded');
  }

  openSearchModal() {
    // Search modal implementation
    console.log('Open search modal');
  }

  openOptimizerModal() {
    this.navigateTo('generator');
    this.showToast('Optimizer ready - enter a prompt to optimize');
  }

  openImportModal() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.fullPrompt || data.idea) {
              this.store.savePrompt({
                ...data,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
              });
              this.showToast('Prompt imported successfully');
              this.navigateTo('saved');
            }
          } catch (err) {
            this.showToast('Invalid file format', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
  }

  showKeyboardShortcuts() {
    this.navigateTo('help');
  }

  initToastSystem() {
    // Toast container is created dynamically
  }

  showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Initialize app
const app = new PromptMasterApp();
export default app;
