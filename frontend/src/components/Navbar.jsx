import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, PlusCircle, LogOut, LogIn, User } from "lucide-react";
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

        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Ana Sayfa
          </Link>

          {/* Eğer kullanıcı giriş yaptıysa (Yetkili Editörse) */}
          {isAuth ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <span className="hidden md:flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                <User className="w-3.5 h-3.5" />
                {user?.username || "Editör"}
              </span>

              {/* Bir sonraki adımda yapacağımız sayfanın linki */}
              <Link
                to="/new-review"
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-600/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">İnceleme Ekle</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Giriş Yapılmadıysa */
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-800 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Editör Girişi</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
