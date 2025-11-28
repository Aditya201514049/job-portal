import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/providers/AuthProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Job Portal",
  description: "Find your next career opportunity. Browse jobs, apply to positions, and connect with employers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <div className="page-shell space-y-4">
            <Header />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
