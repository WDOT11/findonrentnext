"use client";
import styles from "../newdashboard.module.css";
import Image from "next/image";
import Link from "next/link";
import { LuLayoutDashboard, LuUserRound, LuEye, LuSquarePen, LuSettings, LuLogOut, LuList, LuBriefcaseBusiness, LuHouse} from "react-icons/lu";
import { useEffect, useState } from "react";
import { useAlert } from "../../globalComponents/alerts/AlertContext";

export default function Sidebar({ activeView, changeView }) {
  const [authUser, setAuthUser] = useState(null);
  const { showConfirm, showSuccess } = useAlert();


  useEffect(() => {
    const val = document.cookie.split("; ").find(row => row.startsWith("authUser="));
    if (val) setAuthUser(JSON.parse(val.split("=")[1]));
  }, []);

  const handleLogout = () => {
    showConfirm("Are you sure you want to logout?", () => {
        performLogout();
        showSuccess("Logged out successfully!");
      }, () => {
        /** Else here */
      }
    );
  };

  const performLogout = () => {
    document.cookie = 'authToken=; Max-Age=0; path=/';
    document.cookie = 'authUser=; Max-Age=0; path=/';
    window.location.href = '/login';
  };

  const NavItem = ({ view, icon, label }) => (
    <button
      className={`${styles.navItem} ${activeView === view ? styles.active : ""}`}
      onClick={() => changeView(view)}
      // onClick={handleLogout}
    >
      <span className={styles.icon}>{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <aside>
      <div className={styles.sidebarHeader}>
        <a href="/" >
        <Image src="/images/global-imgs/roh_logo_white.svg" alt="Logo" width={100} height={36}/></a>
      </div>

      <nav className={styles.sidebarNav}>
        <NavItem view="dashboard" icon={<LuLayoutDashboard />} label="Dashboard" />
        <NavItem view="details" icon={<LuUserRound />} label="User Details" />
        <NavItem view="viewed" icon={<LuEye />} label="Recently Viewed" />
        <NavItem view="edit" icon={<LuSquarePen />} label="Edit Profile" />

        {/* Show Item Listing only if is_service_provider === 1 */}
        {authUser?.is_service_provider === 1 && (
          <NavItem view="items" icon={<LuList />} label="Item Listing" />
        )}
        {authUser?.is_service_provider === 1 && (
          <NavItem view="business-details" icon={<LuBriefcaseBusiness />} label="Business Details" />
        )}

        <NavItem view="settings" icon={<LuSettings />} label="Settings" />
        <a href="/"  className={`${styles.navItem}`}> <LuHouse size={20} />Back to Home</a>

        <button className={`${styles.navItem} ${styles.roh_dashboardLogot_btn}`} onClick={handleLogout}>
          <span className={styles.icon}><LuLogOut /></span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
