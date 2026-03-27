import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "SaaS Starter Kit — Ship Your SaaS Fast",
  description:
    "Production-ready SaaS boilerplate with authentication, payments, database, cron jobs, and email alerts. Built with Next.js, Neon, Creem, and Resend.",
  keywords: [
    "SaaS boilerplate",
    "Next.js starter",
    "SaaS template",
    "indie hacker",
    "vibe coding",
  ],
  openGraph: {
    title: "SaaS Starter Kit — Ship Your SaaS Fast",
    description:
      "Auth, payments, DB, cron, email — all wired up. Just add your business logic.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
