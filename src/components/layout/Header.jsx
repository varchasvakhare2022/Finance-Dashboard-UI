import { useState } from "react";

export function Header() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 shadow-lg rounded-b-lg">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-12 w-12" />
        <h1 className="text-2xl font-semibold text-white tracking-wide">Northstar Finance</h1>
      </div>
      <nav className="hidden md:flex gap-8">
        <a href="#" className="text-sm font-semibold text-white hover:text-yellow-300 transition duration-300 ease-in-out">home</a>
        <a href="#" className="text-sm font-semibold text-white hover:text-yellow-300 transition duration-300 ease-in-out">About</a>
        <a href="#" className="text-sm font-semibold text-white hover:text-yellow-300 transition duration-300 ease-in-out">Services</a>
        <a href="#" className="text-sm font-semibold text-white hover:text-yellow-300 transition duration-300 ease-in-out">Contact</a>
      </nav>
    </header>
  );
}
