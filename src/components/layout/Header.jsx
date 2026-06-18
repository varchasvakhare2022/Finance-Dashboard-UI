import { useState } from "react";

export function Header() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-surface shadow-md">
      <h1 className="text-xl font-bold text-ink">My Website</h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 text-sm font-medium text-ink bg-accent rounded-lg hover:bg-accent-soft"
      >
        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Theme
      </button>
    </header>
  );
}
