import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AddEntryIcon, ExitIcon, AccessIcon, OperatorIcon } from "./icons";
import { isAuthenticated, getCurrentUser, logoutUser } from "../api";
// 84x84 kaynak, CSS ile 28px gösteriliyor — her ekran yoğunluğunda net kalsın diye
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  // Rota değişince mobil menü açık kalmasın
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Escape ile kapat
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    window.location.reload();
  };

  const scrollToLatest = () =>
    document.getElementById("latest")?.scrollIntoView({ behavior: "smooth" });

  const handleReviewsClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      scrollToLatest();
    } else {
      navigate("/");
      setTimeout(scrollToLatest, 100);
    }
  };

  const isHomeActive = location.pathname === "/" && location.hash !== "#latest";
  const isReviewsActive =
    location.pathname.startsWith("/review") || location.hash === "#latest";

  const linkClass = (active) =>
    `transition-colors ${active ? "text-white" : "text-zinc-400 hover:text-white"}`;

  // Masaüstü ve mobil aynı aksiyonları paylaşıyor, sadece yerleşim değişiyor
  const renderActions = (mobile) =>
    isAuth ? (
      <>
        <span
          className={`items-center gap-1.5 h-8 px-3 bg-panel border border-line text-[11px] font-data uppercase tracking-wider text-zinc-300 ${
            mobile ? "hidden" : "hidden lg:flex"
          }`}
        >
          <OperatorIcon className="w-3.5 h-3.5 text-phosphor" />
          {user?.username || "EDİTÖR"}
        </span>

        <Link
          to="/new-review"
          onClick={() => setMenuOpen(false)}
          className={`flex items-center justify-center gap-1.5 h-8 px-3 bg-phosphor hover:bg-phosphor-dim text-black text-[11px] font-data font-bold uppercase tracking-wider transition-colors ${
            mobile ? "flex-1" : ""
          }`}
        >
          <AddEntryIcon className="w-3.5 h-3.5 text-black" />
          YENİ İNCELEME
        </Link>

        <button
          onClick={handleLogout}
          title="Çıkış Yap"
          aria-label="Çıkış Yap"
          className={`flex items-center justify-center h-8 border border-line text-zinc-400 hover:text-amber hover:border-amber/40 transition-colors ${
            mobile ? "px-4" : "w-8"
          }`}
        >
          <ExitIcon className="w-4 h-4" />
        </button>
      </>
    ) : (
      <Link
        to="/login"
        onClick={() => setMenuOpen(false)}
        className={`flex items-center justify-center gap-2 h-8 px-4 bg-phosphor/10 hover:bg-phosphor hover:text-black border border-phosphor/30 hover:border-phosphor text-phosphor text-[11px] font-data uppercase tracking-wider transition-colors group ${
          mobile ? "flex-1" : ""
        }`}
      >
        <AccessIcon className="w-3.5 h-3.5" />
        EDİTÖR GİRİŞİ
      </Link>
    );

  return (
    <header className="sticky top-0 z-50 bg-void/90 backdrop-blur-md border-b border-line">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-6">
        {/* Üst çubuk: 56px yükseklik, 12px dikey padding */}
        <div className="h-14 flex items-center gap-5">
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={logo}
              width={28}
              height={28}
              alt=""
              className="w-7 h-7 group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-white font-gaming font-black text-base tracking-wider uppercase">
              TECH<span className="text-zinc-500">CRITIC</span>
            </span>
          </Link>

          <span
            className="hidden md:block text-zinc-700 font-data select-none"
            aria-hidden="true"
          >
            /
          </span>

          <nav className="hidden md:flex items-center gap-5 font-data text-[11px] uppercase tracking-wider">
            <Link
              to="/"
              className={linkClass(isHomeActive)}
              aria-current={isHomeActive ? "page" : undefined}
            >
              ANA SAYFA
            </Link>
            <a
              href="#latest"
              onClick={handleReviewsClick}
              className={`cursor-pointer ${linkClass(isReviewsActive)}`}
            >
              İNCELEMELER
            </a>
            <a href="/#about" className={linkClass(false)}>
              HAKKIMIZDA
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              {renderActions(false)}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-8 h-8 -mr-1 text-zinc-300 hover:text-white transition-colors"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              aria-controls="mobil-menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobil panel: çubuğun altında açılır, içeriği aşağı iter */}
        {menuOpen && (
          <div id="mobil-menu" className="md:hidden border-t border-line pb-6">
            <nav className="flex flex-col font-data text-sm uppercase tracking-wider">
              <Link
                to="/"
                className={`py-4 ${linkClass(isHomeActive)}`}
                aria-current={isHomeActive ? "page" : undefined}
              >
                ANA SAYFA
              </Link>
              <a
                href="#latest"
                onClick={handleReviewsClick}
                className={`py-4 cursor-pointer ${linkClass(isReviewsActive)}`}
              >
                İNCELEMELER
              </a>
              <a href="/#about" className={`py-4 ${linkClass(false)}`}>
                HAKKIMIZDA
              </a>
            </nav>

            <div className="flex items-stretch gap-3 pt-4">
              {renderActions(true)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
