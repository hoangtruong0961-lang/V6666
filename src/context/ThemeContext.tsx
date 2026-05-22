import React, { createContext, useContext, useEffect, useState } from 'react';
import { dbService } from '../services/db/indexedDB';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  visualEffects: boolean;
  setVisualEffects: (enabled: boolean) => void;
  interfaceMode: 'pc' | 'mobile';
  setInterfaceMode: (mode: 'pc' | 'mobile') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [fontFamily, setFontFamilyState] = useState<string>('Inter');
  const [fontSize, setFontSizeState] = useState<number>(16);
  const [visualEffects, setVisualEffectsState] = useState<boolean>(true);
  const [interfaceMode, setInterfaceModeState] = useState<'pc' | 'mobile'>('pc');

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await dbService.getSettings();
      setThemeState(settings.theme || 'dark');
      setFontFamilyState(settings.systemFont || 'Inter');
      setFontSizeState(settings.fontSize || 16);
      setVisualEffectsState(settings.visualEffects !== undefined ? settings.visualEffects : true);
      setInterfaceModeState(settings.interfaceMode || 'pc');
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--font-system', fontFamily);
    root.style.setProperty('--font-size-base', `${fontSize}px`);
  }, [fontFamily, fontSize]);

  useEffect(() => {
    // Co giãn giao diện 70% được xử lý hoàn hảo trong MainLayout.tsx bằng standard CSS Transform.
    // Việc này đảm bảo tính tương thích và mượt mà trên mọi trình duyệt (Safari, Firefox, Chrome).
  }, [interfaceMode]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setFontFamily = (font: string) => {
    setFontFamilyState(font);
  };

  const setFontSize = (size: number) => {
    setFontSizeState(size);
  };

  const setVisualEffects = (enabled: boolean) => {
    setVisualEffectsState(enabled);
  };

  const setInterfaceMode = (mode: 'pc' | 'mobile') => {
    setInterfaceModeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, toggleTheme, setTheme, 
      fontFamily, setFontFamily, 
      fontSize, setFontSize,
      visualEffects, setVisualEffects,
      interfaceMode, setInterfaceMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
