import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/header/Header";
import { FloatingWhatsApp } from "react-floating-whatsapp";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mess Bazar - Annoor Foods",
  description: "Manage your mess efficiently with Annoor Foods",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <AuthProvider>
          <div className="w-full">
            <Header />
          </div>
          {/* <AuthProvider>{children}</AuthProvider> */}
          <main className="flex-1">{children}</main>

          <div className="footer flex flex-col items-center justify-center p-8 border-t border-gray-200 bg-3 text-gray-300">
            {/* Footer or additional content can go here */}
            <p>© 2025 Mutadeen. All rights reserved.</p>
            <FloatingWhatsApp
              phoneNumber="+8801840031889"
              accountName="Tech Support"
              notification
              notificationSound
              onSubmit={(e) => {
                console.log(e);
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
