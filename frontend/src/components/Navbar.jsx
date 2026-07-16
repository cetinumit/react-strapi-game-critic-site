import React from "react";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span>
            Tech<span className="text-indigo-500">Critic</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">
            Ana Sayfa
          </Link>
          <a href="#about" className="hover:text-white transition-colors">
            Hakkımızda
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
