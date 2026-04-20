"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./newdashboard.module.css";
import Sidebar from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import UserDetailsView from "./views/UserDetailsView";
import RecentlyViewedView from "./views/RecentlyViewedView";
import EditProfileView from "./views/EditProfileView";
import SettingsView from "./views/SettingsView";
import ItemListingView from "./views/ItemListingView";
import BusinessDetiles from "./views/BusinessDetiles";
import { LuMenu, LuUserRoundPlus, LuPlus } from "react-icons/lu";
import Link from "next/link";

export default function DashboardClient() {

  const currentYear = new Date().getFullYear();

  const router = useRouter();
  const params = useSearchParams();

  const activeView = params.get("view") || "dashboard";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const val = document.cookie.split("; ").find(row => row.startsWith("authUser="));
    if (val) setAuthUser(JSON.parse(val.split("=")[1]));
  }, []);

  const changeView = (view) => {
    router.replace(`?view=${view}`, { scroll: false });
    setSidebarOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case "details":
        return <UserDetailsView />;
      case "viewed":
        return <RecentlyViewedView />;
      case "edit":
        return <EditProfileView />;
      case "items":
        return <ItemListingView />;
      case "business-details":
        return <BusinessDetiles />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <>
      <div className={styles.dashboardContainer}>
        <div
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarMobileOpen : ""
          }`}
        >
          <Sidebar activeView={activeView} changeView={changeView} />
        </div>

        {sidebarOpen && (
          <div
            className={`${styles.sidebarBackdrop} ${styles.sidebarBackdropShow}`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className={styles.mainContent}>
          <header className={styles.roh_dashboar_header}>
            <div className="d-flex align-items-center">
              <button
                className={styles.sidebarToggle}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <LuMenu />
              </button>
              <h5 className={styles.headerTitle}>Dashboard</h5>
            </div>
            <div className={`${styles.roh_dashboar_header_btns}`}>
              {/* if user is service provider show add item button */}
              {authUser?.is_service_provider == 1 && (
              <a href="/add-item">
                <LuPlus size={18} />
                Add Items
              </a>
              )}
              {/* if user is not service provider show become a vendor button */}
              {authUser?.is_service_provider !== 1 && (
                <a href="/become-a-host">
                  <LuUserRoundPlus size={18} /> Become a Vendor
                </a>
              )}
            </div>
          </header>

          <div className={styles.contentWrapper}>{renderView()}</div>         

          <footer className={`${styles.roh_dashboar_footer}`}>
             <a href="/" className={`${styles.roh_backToHome} text-center d-flex align-items-center justify-content-center d-md-none d-block`}>Back to Home</a>
            <div
              className={`${styles.roh_copyBar} d-flex flex-wrap align-items-center`}
            >
              <div className="roh_terms_conditions">
                <div className="d-flex gap-1">
                  <a className={`${styles.roh_fineLink}`} href="#">
                    Privacy &amp; Policy
                  </a>
                  <a className={`${styles.roh_fineLink}`} href="#">
                    Terms & Conditions
                  </a>
                </div>
              </div>
              <div className="roh_copyrigh_textRight">
                <p className={`${styles.roh_copyText}`}>
                  © {currentYear} <strong>Find On Rent</strong>. All rights reserved. |
                  Powered by{" "}
                  <a href="https://webdevops.ltd/" target="_blank" rel="noopener">
                    WebDevOps Pvt Ltd
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
