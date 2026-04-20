import { cookies } from "next/headers";
import Header from "./header";
import Footer from "./footer";
import ChromeGuard from "./ChromeGuard";
// import GlobalPopup from "../globalComponents/GlobalPopup";

export default async function AppShell({ children }) {

  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("authUser");

  return (
    <>
      <ChromeGuard>
        <Header isLoggedIn={isLoggedIn} />
      </ChromeGuard>
      <main id="main-content" aria-label="Main content">
        {children}
      </main>
      <ChromeGuard>
        <Footer />
      </ChromeGuard>

      {/* popup always LAST */}
      {/* <GlobalPopup /> */}
    </>
  );
}