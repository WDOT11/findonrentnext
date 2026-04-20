'use client';
import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const hideChrome =
    pathname.startsWith('/adminrohpnl') || pathname.startsWith('/auth');

  return (
    <>
      {!hideChrome && <Header />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}
