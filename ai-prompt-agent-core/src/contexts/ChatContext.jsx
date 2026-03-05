import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'pm_chats';
const ACTIVE_KEY = 'pm_active_chat';

/* ─── Helpers ─── */

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function generateTitle(messages) {
  const firstUser = messages.find((m) => m.role === 'user');
  if (!firstUser) return 'New Chat';
  const text = firstUser.content.slice(0, 60);
  return text.length < firstUser.content.length ? text + '…' : text;
}

function loadChats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChats(chats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {}
}

function loadActiveChatId() {
  try {
    return localStorage.getItem(ACTIVE_KEY) || null;
  } catch {
    return null;
  }
}

function saveActiveChatId(id) {
  try {
    localStorage.setItem(ACTIVE_KEY, id || '');
  } catch {}
}

/* ─── Context ─── */

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chats, setChats] = useState(() => loadChats());
  const [activeChatId, setActiveChatIdState] = useState(() => {
    const stored = loadActiveChatId();
    const chatList = loadChats();
    // If stored ID exists in list, use it; otherwise null
    if (stored && chatList.some((c) => c.id === stored)) return stored;
    return chatList.length > 0 ? chatList[0].id : null;
  });

  // Persist chats whenever they change
  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  // Persist active chat ID
  useEffect(() => {
    saveActiveChatId(activeChatId);
  }, [activeChatId]);

  // Get active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Create a brand new chat
  const newChat = useCallback(() => {
    const id = generateId();
    const chat = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats((prev) => [chat, ...prev]);
    setActiveChatIdState(id);
    return id;
  }, []);

  // Switch to an existing chat
  const switchChat = useCallback((id) => {
    setActiveChatIdState(id);
  }, []);

  // Update messages for active chat
  const updateMessages = useCallback(
    (updater) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== activeChatId) return chat;
          const newMessages = typeof updater === 'function' ? updater(chat.messages) : updater;
          return {
            ...chat,
            messages: newMessages,
            title: newMessages.length > 0 ? generateTitle(newMessages) : chat.title,
            updatedAt: Date.now(),
          };
        })
      );
    },
    [activeChatId]
  );

  // Delete a chat
  const deleteChat = useCallback(
    (id) => {
      setChats((prev) => {
        const next = prev.filter((c) => c.id !== id);
        // If we deleted the active chat, switch to the first remaining
        if (id === activeChatId) {
          setActiveChatIdState(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeChatId]
  );

  // Start a "new chat" that saves the current one if it has messages
  const startNewChat = useCallback(() => {
    // If current chat exists and has messages, it's already saved in state
    // Just create a new empty chat
    return newChat();
  }, [newChat]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        newChat,
        switchChat,
        updateMessages,
        deleteChat,
        startNewChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}
