import { useState } from "react";

export function Header() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-800 shadow-xl">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-10 w-10" />
        <h1 className="text-2xl font-bold text-red-100">My Website</h1>
      </div>
      <nav className="hidden md:flex gap-6">
        <a href="#" className="text-sm font-medium text-red-100 hover:text-red-200 transition">Home</a>
        <a href="#" className="text-sm font-medium text-red-100 hover:text-red-200 transition">About</a>
        <a href="#" className="text-sm font-medium text-red-100 hover:text-red-200 transition">Services</a>
        <a href="#" className="text-sm font-medium text-red-100 hover:text-red-200 transition">Contact</a>
      </nav>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 text-sm font-medium text-red-100 bg-red-700 rounded-lg hover:bg-red-800 transition"
      >
        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Theme
      </button>
    </header>
  );
}
