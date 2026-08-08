import React from "react";

// Künye içeriği tek yerde; düzen aşağıda tek bir desenle çiziliyor
const SEGMENTS = [
  {
    title: "Geliştirme & Yönetim",
    rows: [
      { label: "Kurucu & Teknik Lider", values: ["Ümit Çetin"] },
      { label: "Altyapı & CMS", values: ["React, Tailwind v4 & Strapi v5"] },
    ],
  },
  {
    title: "Yayın Kadrosu",
    rows: [
      { label: "Genel Yayın Yönetmeni", values: ["Ümit Çetin"] },
      {
        label: "Kıdemli İnceleme Editörleri",
        values: ["Alpcan Ekşi", "Hüseyin Yatar", "Hüseyin Yığcı"],
      },
    ],
  },
  {
    title: "Bize Ulaşın",
    rows: [
      {
        label: "İletişim & Reklam",
        values: ["umitc5534@gmail.com"],
        mailto: true,
      },
      {
        label: "Yönetim Yeri",
        values: ["Sakarya Üniversitesi", "Serdivan / Sakarya"],
      },
    ],
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 sm:py-28">
      {/* overflow-hidden şart: logonun kart sınırından taşan yarısını kesen bu */}
      <div className="relative overflow-hidden bg-panel border border-line">
        {/* Sağ kenardan yarısı dışarı taşıyor; translate-x-1/2 tam ortadan kesiyor.
            Görünürlüğü değiştirmek istersen tek ayar noktası: opacity-20 */}
        <img
          src="/logo-512.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[320px] lg:w-[440px] opacity-20 hidden sm:block"
        />

        <div className="relative p-8 sm:p-12 lg:p-16">
          {/* Başlık ve kısa tanıtım — sol üstte */}
          <h2 className="text-3xl sm:text-5xl font-black text-white font-gaming uppercase tracking-tighter">
            TECH<span className="text-zinc-600">CRITIC</span> KÜNYE
          </h2>
          <p className="mt-5 max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            Dijital oyun kültürünü, donanım dünyasını ve e-spor ekosistemini
            bağımsız, şeffaf ve analitik bir bakış açısıyla inceliyoruz.
          </p>

          {/* Segmentler: solda başlık, sağda içerik, aralarında ince çizgi */}
          <div className="mt-14 sm:mt-20 border-t border-line">
            {SEGMENTS.map((segment) => (
              <div
                key={segment.title}
                className="grid gap-x-10 gap-y-6 border-b border-line py-8 md:grid-cols-[200px_1fr]"
              >
                <h3 className="font-gaming text-xs font-black uppercase tracking-widest text-white">
                  {segment.title}
                </h3>

                <dl className="space-y-6">
                  {segment.rows.map((row) => (
                    <div
                      key={row.label}
                      className="grid gap-x-8 gap-y-1 sm:grid-cols-[220px_1fr]"
                    >
                      <dt className="font-data text-[10px] uppercase tracking-widest text-zinc-500 pt-1">
                        {row.label}
                      </dt>
                      <dd className="space-y-1 text-sm text-zinc-200">
                        {row.values.map((value) =>
                          row.mailto ? (
                            <a
                              key={value}
                              href={`mailto:${value}`}
                              className="block text-phosphor hover:text-phosphor-dim transition-colors"
                            >
                              {value}
                            </a>
                          ) : (
                            <p key={value}>{value}</p>
                          ),
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {/* Telif */}
          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-zinc-600">
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
