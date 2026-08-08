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
      {/* overflow-hidden şart: logonun kart sınırından taşan kısmını kesen bu */}
      <div className="relative overflow-hidden bg-panel border border-line">
        {/*
          Sağ kenardan taşan logo. İki ayar birlikte çalışıyor:
          - translate-x-[40%]  -> yaklaşık ortasından kesilmesini sağlıyor
          - mask-image         -> sola doğru söndürüyor. Bu olmadan parlak fosfor
            çizgiler "Bize Ulaşın" sütununun altında kalıp yazıyı okunmaz yapıyor.
            Sağ kenarda tam parlaklıkta, metne yaklaşırken kayboluyor.
        */}
        <img
          src="/logo-512.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none select-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-[40%] w-[560px] opacity-90 sm:block lg:w-[760px] [mask-image:linear-gradient(to_left,black_35%,transparent_85%)] [-webkit-mask-image:linear-gradient(to_left,black_35%,transparent_85%)]"
        />

        {/* z-10: metin her koşulda logonun üstünde kalsın */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <h2 className="text-4xl sm:text-5xl font-black text-phosphor font-gaming uppercase tracking-tighter">
            Hakkımızda
          </h2>
          <p className="mt-6 max-w-xl text-base text-zinc-300 leading-relaxed">
            Dijital oyun kültürünü, donanım dünyasını ve e-spor ekosistemini
            bağımsız, şeffaf ve analitik bir bakış açısıyla inceliyoruz.
          </p>

          {/* Üç segment yan yana: şeffaf zemin, başlık altında ince çizgi */}
          <div className="mt-16 sm:mt-20 grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {SEGMENTS.map((segment) => (
              <div key={segment.title}>
                <h3 className="border-b border-line pb-4 font-gaming text-sm font-black uppercase tracking-widest text-white">
                  {segment.title}
                </h3>

                <dl className="mt-6 space-y-6">
                  {segment.rows.map((row) => (
                    <div key={row.label}>
                      <dt className="mb-1.5 font-data text-[10px] uppercase tracking-widest text-zinc-500">
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
          <p className="mt-16 max-w-3xl border-t border-line pt-8 text-xs leading-relaxed text-zinc-600">
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
