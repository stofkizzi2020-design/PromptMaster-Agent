import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

/* ─── Translation dictionaries ─── */
const translations = {
  en: {
    // Sidebar
    'sidebar.brand': 'PromptMaster',
    'sidebar.pro': 'Pro',
    'sidebar.newChat': 'New Chat',
    'sidebar.recentChats': 'Recent Chats',
    'sidebar.main': 'Main',
    'sidebar.system': 'System',
    'sidebar.chat': 'Chat',
    'sidebar.promptStudio': 'Prompt Studio',
    'sidebar.templates': 'Templates',
    'sidebar.saved': 'Saved',
    'sidebar.history': 'History',
    'sidebar.settings': 'Settings',
    'sidebar.help': 'Help & Support',
    'sidebar.noChats': 'No conversations yet',
    'sidebar.searchChats': 'Search chats...',

    // Chat
    'chat.title': 'What prompt can I craft for you?',
    'chat.subtitle': "Describe your idea in plain language. I'll transform it into a professional, optimized prompt with structured components.",
    'chat.placeholder': 'Describe the prompt you need...',
    'chat.shiftEnter': 'Shift + Enter for new line',
    'chat.copy': 'Copy',
    'chat.copied': 'Copied',
    'chat.regenerate': 'Regenerate',
    'chat.quality': 'Quality',
    'chat.tokens': 'tokens',
    'chat.writeBlog': 'Write a blog post',
    'chat.codeFeature': 'Code a feature',
    'chat.marketingCopy': 'Marketing copy',
    'chat.businessPlan': 'Business plan',
    'chat.researchSummary': 'Research summary',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account preferences and configuration.',
    'settings.apiKeys': 'API Keys',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.language': 'Language',
    'settings.save': 'Save Changes',
    'settings.saved': 'Saved!',
    'settings.cancel': 'Cancel',

    // Appearance
    'appearance.theme': 'Theme',
    'appearance.themeDesc': 'Choose how PromptMaster looks.',
    'appearance.light': 'Light',
    'appearance.dark': 'Dark',
    'appearance.system': 'System',

    // API Keys
    'api.title': 'API Configuration',
    'api.desc': 'Connect your AI provider keys for enhanced prompt generation.',
    'api.openai': 'OpenAI API Key',
    'api.anthropic': 'Anthropic API Key',
    'api.usage': 'Usage',
    'api.usageDesc': 'Track your API usage and limits.',
    'api.promptsGenerated': 'Prompts Generated',
    'api.apiCalls': 'API Calls',
    'api.tokensUsed': 'Tokens Used',
    'api.of': 'of',

    // Notifications
    'notif.title': 'Notification Preferences',
    'notif.desc': 'Control what notifications you receive.',
    'notif.email': 'Email notifications',
    'notif.emailDesc': 'Receive weekly summaries',
    'notif.tips': 'Prompt tips',
    'notif.tipsDesc': 'Get AI-powered improvement suggestions',
    'notif.updates': 'Product updates',
    'notif.updatesDesc': 'New features and announcements',

    // Privacy
    'privacy.title': 'Privacy & Data',
    'privacy.desc': 'Manage how your data is handled.',
    'privacy.analytics': 'Usage analytics',
    'privacy.analyticsDesc': 'Help improve PromptMaster',
    'privacy.storeHistory': 'Store prompt history',
    'privacy.storeHistoryDesc': 'Save your generations locally',
    'privacy.deleteAll': 'Delete all my data',

    // Language
    'lang.title': 'Language & Region',
    'lang.desc': 'Set your preferred language.',

    // Help
    'help.title': 'Help & Support',
    'help.subtitle': 'Find answers, guides, and support resources.',
    'help.searchPlaceholder': 'Search for help...',
    'help.faq': 'Frequently Asked Questions',
    'help.quickStart': 'Quick Start Guides',
    'help.contact': 'Contact Support',

    // Common
    'common.comingSoon': 'Coming Soon',
  },

  ar: {
    // Sidebar
    'sidebar.brand': 'بروميت ماستر',
    'sidebar.pro': 'برو',
    'sidebar.newChat': 'محادثة جديدة',
    'sidebar.recentChats': 'المحادثات الأخيرة',
    'sidebar.main': 'الرئيسية',
    'sidebar.system': 'النظام',
    'sidebar.chat': 'المحادثة',
    'sidebar.promptStudio': 'استوديو البرومبت',
    'sidebar.templates': 'القوالب',
    'sidebar.saved': 'المحفوظات',
    'sidebar.history': 'السجل',
    'sidebar.settings': 'الإعدادات',
    'sidebar.help': 'المساعدة والدعم',
    'sidebar.noChats': 'لا توجد محادثات بعد',
    'sidebar.searchChats': 'ابحث في المحادثات...',

    // Chat
    'chat.title': 'ما البرومبت الذي يمكنني صياغته لك؟',
    'chat.subtitle': 'صِف فكرتك بلغة بسيطة. سأحولها إلى برومبت احترافي ومُحسّن بمكونات منظمة.',
    'chat.placeholder': 'صِف البرومبت الذي تحتاجه...',
    'chat.shiftEnter': 'Shift + Enter لسطر جديد',
    'chat.copy': 'نسخ',
    'chat.copied': 'تم النسخ',
    'chat.regenerate': 'إعادة التوليد',
    'chat.quality': 'الجودة',
    'chat.tokens': 'رمز',
    'chat.writeBlog': 'اكتب مقالة',
    'chat.codeFeature': 'اكتب كود برمجي',
    'chat.marketingCopy': 'نص تسويقي',
    'chat.businessPlan': 'خطة عمل',
    'chat.researchSummary': 'ملخص بحثي',

    // Settings
    'settings.title': 'الإعدادات',
    'settings.subtitle': 'إدارة تفضيلات حسابك وإعداداته.',
    'settings.apiKeys': 'مفاتيح API',
    'settings.appearance': 'المظهر',
    'settings.notifications': 'الإشعارات',
    'settings.privacy': 'الخصوصية',
    'settings.language': 'اللغة',
    'settings.save': 'حفظ التغييرات',
    'settings.saved': 'تم الحفظ!',
    'settings.cancel': 'إلغاء',

    // Appearance
    'appearance.theme': 'السمة',
    'appearance.themeDesc': 'اختر مظهر بروميت ماستر.',
    'appearance.light': 'فاتح',
    'appearance.dark': 'داكن',
    'appearance.system': 'النظام',

    // API Keys
    'api.title': 'إعدادات API',
    'api.desc': 'اربط مفاتيح مزودي الذكاء الاصطناعي لتحسين توليد البرومبت.',
    'api.openai': 'مفتاح OpenAI API',
    'api.anthropic': 'مفتاح Anthropic API',
    'api.usage': 'الاستخدام',
    'api.usageDesc': 'تتبع استخدامك لـ API والحدود.',
    'api.promptsGenerated': 'البرومبتات المُولّدة',
    'api.apiCalls': 'استدعاءات API',
    'api.tokensUsed': 'الرموز المستخدمة',
    'api.of': 'من',

    // Notifications
    'notif.title': 'تفضيلات الإشعارات',
    'notif.desc': 'تحكم في الإشعارات التي تتلقاها.',
    'notif.email': 'إشعارات البريد الإلكتروني',
    'notif.emailDesc': 'استلم ملخصات أسبوعية',
    'notif.tips': 'نصائح البرومبت',
    'notif.tipsDesc': 'احصل على اقتراحات تحسين بالذكاء الاصطناعي',
    'notif.updates': 'تحديثات المنتج',
    'notif.updatesDesc': 'ميزات جديدة وإعلانات',

    // Privacy
    'privacy.title': 'الخصوصية والبيانات',
    'privacy.desc': 'إدارة كيفية التعامل مع بياناتك.',
    'privacy.analytics': 'تحليلات الاستخدام',
    'privacy.analyticsDesc': 'ساعد في تحسين بروميت ماستر',
    'privacy.storeHistory': 'تخزين سجل البرومبت',
    'privacy.storeHistoryDesc': 'حفظ التوليدات محلياً',
    'privacy.deleteAll': 'حذف جميع بياناتي',

    // Language
    'lang.title': 'اللغة والمنطقة',
    'lang.desc': 'اختر لغتك المفضلة.',

    // Help
    'help.title': 'المساعدة والدعم',
    'help.subtitle': 'ابحث عن إجابات وأدلة وموارد دعم.',
    'help.searchPlaceholder': 'ابحث عن المساعدة...',
    'help.faq': 'الأسئلة الشائعة',
    'help.quickStart': 'أدلة البدء السريع',
    'help.contact': 'اتصل بالدعم',

    // Common
    'common.comingSoon': 'قريباً',
  },
};

/* ─── RTL languages ─── */
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/* ─── Context ─── */
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      return localStorage.getItem('pm_locale') || 'en';
    } catch {
      return 'en';
    }
  });

  // Apply dir and lang on mount and locale change
  useEffect(() => {
    const isRTL = RTL_LANGUAGES.includes(locale);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
    try {
      localStorage.setItem('pm_locale', locale);
    } catch {}
  }, [locale]);

  const t = useCallback(
    (key) => {
      const dict = translations[locale] || translations.en;
      return dict[key] || translations.en[key] || key;
    },
    [locale]
  );

  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale);
  }, []);

  const isRTL = RTL_LANGUAGES.includes(locale);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
