import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { SiteSettingsProvider } from "@/lib/site-settings-context";
import { LanguageProvider } from "@/lib/language-context";
import PopupAd from "@/components/layout/PopupAd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ganma Shami - Movies & TV Series",
  description: "Your ultimate destination for movies and TV series. Stream unlimited content anytime, anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${notoNaskhArabic.variable} antialiased bg-modern-dark text-white min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <SiteSettingsProvider>
              <LanguageProvider>
                <Header />
                <PopupAd />
                <main>{children}</main>
                <Footer />
              </LanguageProvider>
            </SiteSettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
