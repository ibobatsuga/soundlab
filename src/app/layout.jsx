import "./globals.css";
import WhatsAppSupport from "@/components/WhatsAppSupport";

export const metadata = {
  title: "XXLCHICKEN Sound Lab — Generator Musik Electronic & EDM Indonesia",
  description: "Studio AI Pertama Spesialis Electronic, EDM, Phonk & Indobounce. Buat Lagu Club & Festival Custom dalam 60 Detik. Bayar instan via QRIS.",
  keywords: "xxlchicken, edm ai, generator musik elektronik, indobounce, drift phonk, slap house, dj generator, bikin lagu dugem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-obsidian-950 font-sans text-slate-100 antialiased selection:bg-lime-neon selection:text-obsidian-950">
        {children}
        <WhatsAppSupport />
      </body>
    </html>
  );
}
