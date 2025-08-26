import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { Theme } from '../hooks/useTheme';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header className="md:hidden bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 shadow-sm border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-lg font-bold">Meu Controle</h1>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};

export default Header;
