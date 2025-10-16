import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TalentMatch — Graduate Employability Platform (Malaysia)",
  description:
    "TalentMatch helps Malaysia's fresh graduates showcase skills, build winning CVs, and get matched to the right jobs while enabling employers to hire job‑ready talent.",
  metadataBase: new URL("https://talentmatch.example.com"),
  openGraph: {
    title: "TalentMatch — Graduate Employability Platform (Malaysia)",
    description:
      "Match with jobs, build skills profiles, and launch your graduate career.",
    type: "website",
    locale: "en_MY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
