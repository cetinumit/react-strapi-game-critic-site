import React from "react";
import { Mail, MapPin, Code2, PenTool, Globe } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-[#08080a] relative border-t border-zinc-900 overflow-hidden"
    >
      {/* Arkaplan Işık Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Başlık Alanı */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-gaming uppercase tracking-tighter mb-4 drop-shadow-lg">
            TECH<span className="text-zinc-600">CRITIC</span> KÜNYE
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
            Dijital oyun kültürünü, donanım dünyasını ve e-spor ekosistemini
            bağımsız, şeffaf ve analitik bir bakış açısıyla inceliyoruz.
          </p>
        </div>

        {/* Künye Izgarası (3 Kolonlu Tasarım) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Kutu: Yönetim & Altyapı */}
          <div className="bg-[#111116]/80 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 shadow-xl hover:border-indigo-500/30 transition-colors group">
            <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-white font-gaming font-black tracking-widest uppercase mb-6 border-b border-zinc-800 pb-4 text-sm">
              Geliştirme & Yönetim
            </h3>

            <div className="space-y-5 text-sm">
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                  Kurucu & Teknik Lider
                </p>
                <p className="text-zinc-200 font-medium">Ümit Çetin</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                  Altyapı & CMS
                </p>
                <p className="text-zinc-200 font-medium">
                  React, Tailwind v4 & Strapi v5
                </p>
              </div>
            </div>
          </div>

          {/* 2. Kutu: Editöryal Kadro */}
          <div className="bg-[#111116]/80 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 shadow-xl hover:border-rose-500/30 transition-colors group">
            <div className="inline-flex p-3 bg-rose-500/10 text-rose-400 rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-white font-gaming font-black tracking-widest uppercase mb-6 border-b border-zinc-800 pb-4 text-sm">
              Yayın Kadrosu
            </h3>

            <div className="space-y-5 text-sm">
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                  Genel Yayın Yönetmeni
                </p>
                <p className="text-zinc-200 font-medium">Ümit Çetin</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                  Kıdemli İnceleme Editörleri
                </p>
                <p className="text-zinc-200 font-medium">Alpcan Ekşi</p>
                <p className="text-zinc-200 font-medium mt-1">Hüseyin Yatar</p>
                <p className="text-zinc-200 font-medium mt-1">Hüseyin Yığcı</p>
              </div>
            </div>
          </div>

          {/* 3. Kutu: İletişim & Lokasyon */}
          <div className="bg-[#111116]/80 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 shadow-xl hover:border-emerald-500/30 transition-colors group">
            <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-white font-gaming font-black tracking-widest uppercase mb-6 border-b border-zinc-800 pb-4 text-sm">
              Bize Ulaşın
            </h3>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                    İletişim & Reklam
                  </p>
                  <a
                    href="mailto:umitc5534@gmail.com"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    umitc5534@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                    Yönetim Yeri
                  </p>
                  <p className="text-zinc-200 font-medium leading-relaxed">
                    Sakarya Üniversitesi Teknokent
                    <br />
                    Serdivan / Sakarya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yasal Uyarı Footer'ı */}
        <div className="mt-16 text-center border-t border-zinc-800/50 pt-8">
          <p className="text-zinc-500 text-xs leading-relaxed max-w-4xl mx-auto">
            Bu yayının dijital operasyonları ve altyapısı bağımsız olarak
            yönetilmektedir. TechCritic sitesinde yayımlanan inceleme, haber ve
            materyallerin her türlü telif hakkı saklıdır. İzin alınmadan kaynak
            gösterilerek dahi iktibas edilemez.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
