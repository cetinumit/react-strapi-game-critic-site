import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import {
  SecureNodeIcon,
  ChannelIcon,
  KeyMarkIcon,
  AdvanceIcon,
  WarningIcon,
} from "../components/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError("Giriş başarısız! E-posta/Kullanıcı adı veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-panel border border-line animate-fade-in relative">
      <div className="absolute top-0 left-0 text-[9px] font-data text-zinc-600 tracking-widest px-3 py-1.5 border-b border-r border-line">
        ACCESS-01
      </div>

      <div className="text-center mb-8 pt-4">
        <div className="inline-flex p-3 bg-phosphor/10 text-phosphor mb-4 border border-phosphor/20">
          <SecureNodeIcon className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white font-gaming uppercase tracking-tight">
          Editör Girişi
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Yeni inceleme eklemek için yetkili hesabınızla giriş yapın.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-critical/10 border border-critical/30 text-critical text-xs flex items-center gap-2.5">
          <WarningIcon className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 font-data">
            E-Posta veya Kullanıcı Adı
          </label>
          <div className="relative">
            <ChannelIcon className="w-4 h-4 text-zinc-600 absolute left-0 top-3" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@techcritic.com"
              className="w-full bg-transparent border-b border-line py-2.5 pl-7 pr-2 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-phosphor transition-all font-data"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 font-data">
            Şifre
          </label>
          <div className="relative">
            <KeyMarkIcon className="w-4 h-4 text-zinc-600 absolute left-0 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-line py-2.5 pl-7 pr-2 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-phosphor transition-all font-data"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-phosphor hover:bg-phosphor-dim disabled:opacity-50 text-black font-bold py-3 px-4 text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group font-gaming"
        >
          <span>{loading ? "DOĞRULANIYOR..." : "DOĞRULA"}</span>
          {!loading && (
            <AdvanceIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
