import { useState } from "react";

export function Header() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-700 shadow-xl">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-12 w-12" />
        <h1 className="text-2xl font-bold text-gold-100">Northstar Finance</h1>
      </div>
      <nav className="hidden md:flex gap-6">
        <a href="#" className="text-sm font-medium text-red-100 hover:text-red-200 transition">Home</a>
        <a href="#" className="text-sm font-medium text-red-100 hover:text-red-200 transition">About</a>
        <a href="#" className="text-sm font-medium text-red-100 hover:text-red-200 transition">Services</a>
        <a href="#" className="text-sm font-medium text-red-100 hover:text-red-200 transition">Contact</a>
      </nav>
    </header>
  );
}
