import 'bootstrap/dist/css/bootstrap.min.css';
import './external.module.css';
import AppShell from './main/AppShell';
import { AlertProvider } from "./globalComponents/alerts/AlertContext";
import AlertUI from "./globalComponents/alerts/AlertUI";
import LanguagePopUp from "./globalComponents/LanguagePopUp";
import { DM_Sans } from "next/font/google";
import GoogleAnalytics from "./globalComponents/GoogleAnalytics";
import GoogleTranslate from "./globalComponents/GoogleTranslate";

export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-family-body"
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/images/homepg/bg-img-3.svg" fetchPriority="high" as="image" type="image/svg+xml" />
      </head>
      <body className={dmSans.variable} style={{ margin: 0 }}>
        <GoogleAnalytics />
        <GoogleTranslate />
        <AlertProvider>
          <LanguagePopUp />
          <AlertUI />
          <AppShell>{children}</AppShell>
        </AlertProvider>
      </body>
    </html>
  );
}
