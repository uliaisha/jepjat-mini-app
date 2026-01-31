'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { TelegramUser } from '@/lib/types';

interface TelegramContextType {
  user: TelegramUser | null;
  isReady: boolean;
  webApp: typeof window.Telegram.WebApp | null;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  isReady: false,
  webApp: null,
});

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe: {
          user?: TelegramUser;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        colorScheme: 'light' | 'dark';
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState<typeof window.Telegram.WebApp | null>(null);

  useEffect(() => {
    const initTelegram = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        setWebApp(tg);
        setUser(tg.initDataUnsafe.user || null);
        setIsReady(true);
      } else {
        // Development mode - mock user
        setUser({
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
        });
        setIsReady(true);
      }
    };

    initTelegram();
  }, []);

  return (
    <TelegramContext.Provider value={{ user, isReady, webApp }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}
