import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import IndonesianTranslationProvider from "@/src/components/i18n/IndonesianTranslationProvider";
import { locale } from "@/src/i18n/id";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SapiGo",
  description: "Platform manajemen sapi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={locale.split("-")[0]}
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-screen ">
        <div className="mx-auto max-w-md min-h-screen shadow-lg bg-primary relative">
          <IndonesianTranslationProvider>{children}</IndonesianTranslationProvider>
        </div>
      </body>
    </html>
  );
}
