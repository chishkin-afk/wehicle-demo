import { DemoProvider } from "@/entities/workspace/model/provider";
import "@/shared/styles/globals.scss";
import "@fontsource/manrope/cyrillic-400.css";
import "@fontsource/manrope/cyrillic-500.css";
import "@fontsource/manrope/cyrillic-600.css";
import "@fontsource/manrope/cyrillic-700.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "Wehicle — забота о вашем автомобиле",
    template: "%s · Wehicle",
  },
  description:
    "Автосервис и управление бизнесом. Записи, клиенты, команда и мастерская.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ru'>
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
