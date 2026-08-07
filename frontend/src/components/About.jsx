import React from "react";
import { Mail, MapPin, Code2, PenTool, Globe } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-void relative border-t border-line overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-phosphor/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-gaming uppercase tracking-tighter mb-4">
            TECH<span className="text-zinc-600">CRITIC</span> KÜNYE
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
            Dijital oyun kültürünü, donanım dünyasını ve e-spor ekosistemini
            bağımsız, şeffaf ve analitik bir bakış açısıyla inceliyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-panel/80 backdrop-blur-sm border border-line p-8 hover:border-phosphor/40 transition-colors group">
            <div className="inline-flex p-3 bg-phosphor/10 text-phosphor mb-6 border border-phosphor/20 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-white font-gaming font-black tracking-widest uppercase mb-6 border-b border-line pb-4 text-sm">
              Geliştirme & Yönetim
            </h3>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1 font-data">
                  Kurucu & Teknik Lider
                </p>
                <p className="text-zinc-200 font-medium">Ümit Çetin</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1 font-data">
                  Altyapı & CMS
                </p>
                <p className="text-zinc-200 font-medium">
                  React, Tailwind v4 & Strapi v5
                </p>
              </div>
            </div>
          </div>

          <div className="bg-panel/80 backdrop-blur-sm border border-line p-8 hover:border-amber-500/40 transition-colors group">
            <div className="inline-flex p-3 bg-amber-500/10 text-amber-400 mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-white font-gaming font-black tracking-widest uppercase mb-6 border-b border-line pb-4 text-sm">
              Yayın Kadrosu
            </h3>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1 font-data">
                  Genel Yayın Yönetmeni
                </p>
                <p className="text-zinc-200 font-medium">Ümit Çetin</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1 font-data">
                  Kıdemli İnceleme Editörleri
                </p>
                <p className="text-zinc-200 font-medium">Alpcan Ekşi</p>
                <p className="text-zinc-200 font-medium mt-1">Hüseyin Yatar</p>
                <p className="text-zinc-200 font-medium mt-1">Hüseyin Yığcı</p>
              </div>
            </div>
          </div>

          <div className="bg-panel/80 backdrop-blur-sm border border-line p-8 hover:border-zinc-500/40 transition-colors group">
            <div className="inline-flex p-3 bg-zinc-700/20 text-zinc-300 mb-6 border border-zinc-600/30 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-white font-gaming font-black tracking-widest uppercase mb-6 border-b border-line pb-4 text-sm">
              Bize Ulaşın
            </h3>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1 font-data">
                    İletişim & Reklam
                  </p>
                  <a
                    href="mailto:umitc5534@gmail.com"
                    className="text-phosphor hover:text-phosphor-dim transition-colors font-medium"
                  >
                    umitc5534@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1 font-data">
                    Yönetim Yeri
                  </p>
                  <p className="text-zinc-200 font-medium leading-relaxed">
                    Sakarya Üniversitesi
                    <br />
                    Serdivan / Sakarya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center border-t border-line pt-8">
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
