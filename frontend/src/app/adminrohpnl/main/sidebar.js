'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';
import { useAlert } from "../../globalComponents/alerts/AlertContext";

export default function Sidebar() {
  const [currentUrl, setCurrentUrl] = useState('')
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const router = useRouter();
  const { showConfirm, showSuccess } = useAlert();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      setCurrentUrl(path);
      
      // Auto-open submenu if we are currently inside the products section
      if (path.includes('/adminrohpnl/products')) {
        setIsProductsOpen(true);
      }
    }
  }, [])
  const isActive = (path) => currentUrl == path;

  const handleLogout = () => {
    showConfirm("Are you sure you want to logout?", () => {
        performLogout();
        showSuccess("Logged out successfully!");
      }, () => {
        /** Else  */
      }
    );
  };

  const performLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'authUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = "/auth/admin";
  };

  const toggleProducts = (e) => {
    e.preventDefault();
    setIsProductsOpen(!isProductsOpen);
  };

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.menuList}>
        <li><a href="/adminrohpnl"     className={`${styles.menuLink} ${isActive('/adminrohpnl') ? styles.menuActive : ''}`}>Dashboard</a></li>
        <li><a href="/adminrohpnl/category" className={`${styles.menuLink} ${isActive('/adminrohpnl/category') ? styles.menuActive : ''}`}>Categories</a></li>
        <li><a href="/adminrohpnl/brand" className={`${styles.menuLink} ${isActive('/adminrohpnl/brand') ? styles.menuActive : ''}`}>Brands</a></li>
        <li><a href="/adminrohpnl/tag" className={`${styles.menuLink} ${isActive('/adminrohpnl/tag') ? styles.menuActive : ''}`}>Tags</a></li>
        <li><a href="/adminrohpnl/model" className={`${styles.menuLink} ${isActive('/adminrohpnl/model') ? styles.menuActive : ''}`}>Models</a></li>
        <li><a href="/adminrohpnl/post" className={`${styles.menuLink} ${isActive('/adminrohpnl/post') ? styles.menuActive : ''}`}>Posts</a></li>
        <li><a href="/adminrohpnl/faq" className={`${styles.menuLink} ${isActive('/adminrohpnl/faq') ? styles.menuActive : ''}`}>FAQs</a></li>
        <li><a href="/adminrohpnl/inquirie" className={`${styles.menuLink} ${isActive('/adminrohpnl/inquirie') ? styles.menuActive : ''}`}>Inquiries</a></li>
        
        <li 
            className={`${styles.hasSubmenu} ${isProductsOpen ? styles.submenuOpen : ''}`}
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
        >
            <span className={styles.menuLink} onClick={toggleProducts} style={{ cursor: 'pointer' }}>
              Products {isProductsOpen ? '▲' : '▼'}
            </span>

            <ul className={styles.submenu}>
              <li>
                <a
                  href="/adminrohpnl/products/vehicles"
                  className={`${styles.menuLink} ${isActive('/adminrohpnl/products/vehicles') ? styles.menuActive : ''}`}
                >
                  Vehicles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${styles.menuLink} ${isActive('/adminrohpnl/products/electronics') ? styles.menuActive : ''}`}
                >
                  Electronics
                </a>
              </li>
            </ul>
        </li>

        <li><a href="/adminrohpnl/user" className={`${styles.menuLink} ${isActive('/adminrohpnl/user') ? styles.menuActive : ''}`}>Users</a></li>
        <li><a href="/adminrohpnl/role" className={`${styles.menuLink} ${isActive('/adminrohpnl/role') ? styles.menuActive : ''}`}>Roles</a></li>
        <li><a href="/adminrohpnl/route" className={`${styles.menuLink} ${isActive('/adminrohpnl/route') ? styles.menuActive : ''}`}>Routes</a></li>
        <li><a href="/adminrohpnl/roh-seo" className={`${styles.menuLink} ${isActive('/adminrohpnl/roh-seo') ? styles.menuActive : ''}`}>ROH SEO</a></li>
        <li><a href="/adminrohpnl/state-city" className={`${styles.menuLink} ${isActive('/adminrohpnl/state-city') ? styles.menuActive : ''}`}>State & City</a></li>
        <li><a href="/adminrohpnl/roh-redirect" className={`${styles.menuLink} ${isActive('/adminrohpnl/roh-redirect') ? styles.menuActive : ''}`}>ROH Redirect</a></li>
        <li><a href="/adminrohpnl/settings" className={`${styles.menuLink} ${isActive('/adminrohpnl/settings') ? styles.menuActive : ''}`}>Settings</a></li>
        <li>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </aside>
  );
}
