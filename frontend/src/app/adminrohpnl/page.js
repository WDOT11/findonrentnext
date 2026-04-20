'use client';
import styles from './admin.module.css';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAuthToken } from '../../utils/utilities';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

import { LuLayoutGrid, LuUser, LuSlidersHorizontal, LuHeadset } from "react-icons/lu";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalUsers: 0,
    pendingRequests: 0,
    totalProducts: 0
  });
  const [activity, setActivity] = useState({
    users: [],
    products: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /** Admin login token check */
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const token = getCookie('authToken');
    const authUserData = getCookie('authUser');
    
    let parsedAuthUserData = null;
    if (authUserData) {
      try {
        parsedAuthUserData = JSON.parse(decodeURIComponent(authUserData));
      } catch (e) {
        try {
          parsedAuthUserData = JSON.parse(authUserData);
        } catch (e2) {
          console.error("Error parsing authUser:", e2);
        }
      }
    }
    
    let isTokenExpired = false;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) isTokenExpired = true;
      } catch (err) { isTokenExpired = true; }
    }

    if (!token || isTokenExpired || (parsedAuthUserData && parsedAuthUserData.role_id !== 1)) {
      window.location.href = "/auth/admin";
      return;
    }

    /** Fetch Dashboard Stats */
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_ADMIN_BASE_URL}/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
          setActivity(data.recentActivity);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); 

  if (loading) return (
    <div className={styles.container}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Welcome, Admin</h2>
      <p className={styles.intro}>Everything you need to manage your platform at a glance.</p>

      {/* Stats Section */}
      <div className={styles.cardGrid}>
        <div className={`${styles.card} ${styles.categoryCard}`}>
          <LuLayoutGrid className={styles.cardIcon} size={64} />
          <strong>{stats.totalCategories}</strong>
          <p>Total Categories</p>
        </div>
        <div className={`${styles.card} ${styles.userCard}`}>
          <LuUser className={styles.cardIcon} size={64} />
          <strong>{stats.totalUsers}</strong>
          <p>Registered Users</p>
        </div>
        <div className={`${styles.card} ${styles.productCard}`}>
          <LuSlidersHorizontal className={styles.cardIcon} size={64} />
          <strong>{stats.totalProducts}</strong>
          <p>Total Products</p>
        </div>
        <div className={`${styles.card} ${styles.pendingCard}`}>
          <LuHeadset className={styles.cardIcon} size={64} />
          <strong style={{ color: stats.pendingRequests > 0 ? '#f43f5e' : 'inherit' }}>
            {stats.pendingRequests}
          </strong>
          <p>Pending Requests</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Recent Users */}
        <div className={styles.section}>
          <h3><LuUser size={22} color="#3b82f6" /> Recent Users</h3>
          <ul className={styles.activityList}>
            {activity.users.length > 0 ? activity.users.map((u, i) => (
              <li key={i} className={styles.userCard}>
                <strong>{u.first_name} {u.last_name}</strong>
                <span>{u.email}</span>
                <small>{new Date(u.add_date).toLocaleDateString()}</small>
              </li>
            )) : <li>No recent users</li>}
          </ul>
        </div>

        {/* Recent Products */}
        <div className={styles.section}>
          <h3><LuSlidersHorizontal size={22} color="#8b5cf6" /> Recent Products</h3>
          <ul className={styles.activityList}>
            {activity.products.length > 0 ? activity.products.map((p, i) => (
              <li key={i} className={styles.productCard}>
                <strong>{p.item_name}</strong>
                <small>{new Date(p.add_date).toLocaleDateString()}</small>
              </li>
            )) : <li>No recent products</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
