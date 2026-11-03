import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Assistant, Cormorant_Garamond, Frank_Ruhl_Libre, Jost } from "next/font/google";
import "../globals.css";
import site from "@/data/site.json";
import { dirOf, getDict, isLocale, locales } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

// Aucune police n'est préchargée : le préchargement vaudrait pour les 4 langues (Jost ne sert presque pas
// en hébreu, Frank Ruhl pas en latin). Le CSS étant inliné, chaque page ne demande que ses polices,
// et le texte s'affiche tout de suite avec une police de secours aux mêmes métriques (swap).
const jost = Jost({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-jost", display: "swap", preload: false });
const assistant = Assistant({ subsets: ["hebrew", "latin"], weight: ["300", "400", "600"], variable: "--font-assistant", display: "swap", preload: false });
const frank = Frank_Ruhl_Libre({ subsets: ["hebrew", "latin"], weight: ["300", "400"], variable: "--font-frank", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400"], style: ["italic"], variable: "--font-cormorant", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.nameLatin,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#faf6f0", width: "device-width", initialScale: 1 };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

const introScript = `try{if(sessionStorage.getItem("morcin-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${jost.variable} ${assistant.variable} ${frank.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <Providers lang={lang} d={d}>
          <Intro skipLabel={d.intro.skip} />
          <SmoothScroll />
          <Header />
          <main id="main">{children}</main>
          <Footer lang={lang} d={d} />
          <WhatsAppFloat label={d.whatsapp.float} message={d.whatsapp.hello} />
        </Providers>
      </body>
    </html>
  );
}
