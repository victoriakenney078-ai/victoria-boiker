import { AuthGate } from "@/components/AuthGate";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartContext";
import { Grain } from "@/components/Grain";
import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Victoria Boiker — Unique Art",
  description:
    "A private gallery for collectors who look beyond the surface of the canvas. Viewing by appointment.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} overflow-x-clip`}>
      <body className="overflow-x-clip bg-navy font-sans text-ink antialiased">
        <Grain />
        <AuthGate>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthGate>
      </body>
    </html>
  );
}
