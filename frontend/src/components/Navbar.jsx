import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Gamepad2,
  PlusCircle,
  LogOut,
  LogIn,
  User,
  Sparkles,
} from "lucide-react";
import { isAuthenticated, getCurrentUser, logoutUser } from "../api";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#08080a]/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Sol Logo - Vatic.gg Tarzı Keskin ve Modern */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xl font-gaming tracking-tighter rounded-sm transform group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            TC
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-xl tracking-wider font-gaming uppercase">
              TECH<span className="text-zinc-500">CRITIC</span>
            </span>
            <span className="text-[9px] text-zinc-400 tracking-[0.2em] uppercase -mt-1 font-semibold">
              Review Magazine
            </span>
          </div>
        </Link>

        {/* Orta Navigasyon Linkleri - Esports Portal Havası */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <Link
            to="/"
            className="text-white hover:text-zinc-300 transition-colors py-2 border-b-2 border-white"
          >
            HOME
          </Link>
          <a
            href="#latest"
            className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-zinc-700"
          >
            REVIEWS
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-zinc-700"
          >
            ABOUT
          </a>
        </nav>

        {/* Sağ Kullanıcı & Aksiyon Alanı - Keskin Köşeli Butonlar */}
        <div className="flex items-center gap-4">
          {isAuth ? (
            <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 p-1.5 rounded-lg">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-300 px-3 py-1 bg-zinc-800/50 rounded-md">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                {user?.username || "EDITOR"}
              </span>

              {/* İnceleme Ekle Butonu - Görseldeki Premium Beyaz Buton Havası */}
              <Link
                to="/new-review"
                className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-extrabold px-4 py-2 rounded-md transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] uppercase tracking-wider font-gaming"
              >
                <PlusCircle className="w-4 h-4 text-black" />
                <span className="hidden sm:inline">NEW REVIEW</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Giriş Yapılmadıysa - Keskin Çerçeveli Modern Buton */
            <Link
              to="/login"
              className="flex items-center gap-2 bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black text-xs font-bold px-5 py-2.5 rounded-md border border-zinc-800 hover:border-white transition-all duration-300 uppercase tracking-widest font-gaming shadow-sm group"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400 group-hover:text-black transition-colors" />
              <span>EDITOR LOGIN</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
