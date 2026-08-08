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
  const [scrolled, setScrolled] = useState(false);

  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  // Tepedeyken navbar siteyle iç içe dursun; kaydırınca zemin + çizgi belirsin
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Çapa linkleri: URL'e hash yazmıyoruz. Yazsaydık Home'un kaydırma geri
  // yükleme efekti navType değişimiyle tetiklenip sayfayı tepeye atardı.
  // Zaten ana sayfadayken Link rotayı değiştirmiyor, dolayısıyla Home'un
  // kaydırma efekti de tetiklenmiyor ve hiçbir şey olmuyordu. Bu durumda
  // gezinmeyi iptal edip doğrudan başa dönüyoruz.
  const handleHomeClick = (e) => {
    setMenuOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Home mount olurken kendi kaydırmasını yapıyor; hedefi ona bırakıyoruz.
      // location.state kullanmıyoruz: o history kaydına yapışıp kalıcı oluyor,
      // geri dönüşte ve yenilemede tekrar tetikleniyordu.
      sessionStorage.setItem("scrollToOnHome", id);
      navigate("/");
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
    // border-b hep duruyor, sadece rengi değişiyor — belirirken 1px kayma olmasın diye
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-void/90 backdrop-blur-md border-line"
          : "bg-transparent border-transparent"
      }`}
    >
      {/* MainLayout ve Footer ile aynı konteyner — soldan sağda içerikle hizalı dursun */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Üst çubuk: 56px yükseklik, 12px dikey padding */}
        <div className="h-14 flex items-center gap-5">
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            onClick={handleHomeClick}
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
              onClick={handleHomeClick}
              className={linkClass(isHomeActive)}
              aria-current={isHomeActive ? "page" : undefined}
            >
              ANA SAYFA
            </Link>
            <a
              href="/#latest"
              onClick={(e) => handleAnchorClick(e, "latest")}
              className={`cursor-pointer ${linkClass(isReviewsActive)}`}
            >
              İNCELEMELER
            </a>
            <a
              href="/#about"
              onClick={(e) => handleAnchorClick(e, "about")}
              className={`cursor-pointer ${linkClass(false)}`}
            >
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
                onClick={handleHomeClick}
                className={`py-4 ${linkClass(isHomeActive)}`}
                aria-current={isHomeActive ? "page" : undefined}
              >
                ANA SAYFA
              </Link>
              <a
                href="/#latest"
                onClick={(e) => handleAnchorClick(e, "latest")}
                className={`py-4 cursor-pointer ${linkClass(isReviewsActive)}`}
              >
                İNCELEMELER
              </a>
              <a
                href="/#about"
                onClick={(e) => handleAnchorClick(e, "about")}
                className={`py-4 cursor-pointer ${linkClass(false)}`}
              >
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
