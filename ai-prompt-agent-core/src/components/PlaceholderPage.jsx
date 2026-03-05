import React from 'react';
import {
  Clock,
  Bookmark,
  Star,
  FolderOpen,
  Settings,
  HelpCircle,
  Construction,
} from 'lucide-react';

const pageConfig = {
  history: { icon: Clock, title: 'History', description: 'Your recently generated prompts will appear here.' },
  saved: { icon: Bookmark, title: 'Saved Prompts', description: 'Prompts you\'ve bookmarked for quick access.' },
  favorites: { icon: Star, title: 'Favorites', description: 'Your favorite and most-used prompts.' },
  collections: { icon: FolderOpen, title: 'Collections', description: 'Organize your prompts into custom collections.' },
  settings: { icon: Settings, title: 'Settings', description: 'Configure your preferences and account settings.' },
  help: { icon: HelpCircle, title: 'Help & Support', description: 'Documentation, tutorials, and support resources.' },
};

export default function PlaceholderPage({ pageId }) {
  const config = pageConfig[pageId] || {
    icon: Construction,
    title: 'Page Not Found',
    description: 'This page doesn\'t exist yet.',
  };
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h1 className="mt-5 text-xl font-bold text-gray-900">{config.title}</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{config.description}</p>
      <div className="mt-6 inline-flex items-center gap-x-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
        <Construction className="h-4 w-4" />
        Coming Soon
      </div>
    </div>
  );
}
