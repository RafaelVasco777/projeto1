import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebar?: boolean;
}

const themeOptions: { value: Theme; icon: React.ElementType }[] = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: Monitor },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme, isSidebar = false }) => {
  if (isSidebar) {
    return (
      <div className="mt-auto p-2 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
        <div className="flex items-center justify-center space-x-1">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`p-2 rounded-md transition-colors ${
                theme === option.value
                  ? 'bg-primary text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
              title={`Tema ${option.value}`}
            >
              <option.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`p-2 rounded-full transition-colors ${
            theme === option.value
              ? 'bg-primary/10 text-primary dark:bg-primary/20'
              : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
          title={`Tema ${option.value}`}
        >
          <option.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
