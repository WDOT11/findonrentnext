'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import { getAuthToken, getAuthUser } from "../../../utils/utilities";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function Header() {

  const [profileImage, setProfileImage] = useState('/uploads/media/users/profile/dummy-profile-img.jpg');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = JSON.parse(getAuthUser() || "{}");
      if (!user?.id) return;

      const token = getAuthToken();

      const res = await fetch(`${API_ADMIN_BASE_URL}/user/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await res.json();

      if (data.status && data.data?.length > 0) {
        const u = data.data[0];

        const path = u.file_path || "";
        const name = u.file_name || "";

        if (name) {
          setProfileImage(path + name);
        }
      }

    } catch (err) {
      console.error("Profile load error:", err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <a href="/adminrohpnl" className={styles.logo}>
          FindOnRent
        </a>
      </div>

      <div className={styles.profileWrapper}>
        <img
          src={WEB_BASE_URL + profileImage}
          alt="Profile"
          width={40}
          height={40}
          className={styles.profilePic}
        />
      </div>
    </header>
  );
}
