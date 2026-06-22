import { useState } from "react";

export function Header() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
  };

  return (
    <header className="flex items-center justify-between p-6 bg-accent shadow-md">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold text-ink">My Website</h1>
      </div>
      <nav className="hidden md:flex gap-6">
        <a href="#" className="text-sm font-medium text-muted hover:text-ink transition">Home</a>
        <a href="#" className="text-sm font-medium text-muted hover:text-ink transition">About</a>
        <a href="#" className="text-sm font-medium text-muted hover:text-ink transition">Services</a>
        <a href="#" className="text-sm font-medium text-muted hover:text-ink transition">Contact</a>
      </nav>
      <div className="flex-1"></div>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 text-sm font-medium text-ink bg-accent rounded-lg hover:bg-accent-soft transition"
      >
        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Theme
      </button>
    </header>
  );
}
