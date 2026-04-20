// layout.js
import Header from './main/header';
import Sidebar from './main/sidebar';
import Footer from './main/footer';
import SessionTracker from './main/SessionTracker';
import styles from './admin.module.css';

export const metadata = {
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }) {
  return (
    <>
      <style>{`
        html, body {
          height: auto !important;
          overflow: auto !important;
          overflow-x: hidden !important;
          position: static !important;
        }
      `}</style>
      <div className={styles.layoutBody}>
        <SessionTracker />
        <div className={styles.layoutWrapper}>
          <Header />
          <div className={styles.layoutContent}>
            <Sidebar />
            <main className={styles.mainArea}>
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}