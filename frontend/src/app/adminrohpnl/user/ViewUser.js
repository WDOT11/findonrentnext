'use client';
import styles from '../admin.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function ViewUser({ user, onClose }) {
  const router = useRouter();

  if (!user) return null;

  const filePath = user.file_path || '';
  const fileName = user.file_name || '';
  const profile_picture_url = `${filePath}${fileName}`.trim();

  const imageToShow =
    profile_picture_url && profile_picture_url !== '/nullnull'
      ? profile_picture_url
      : '/uploads/media/users/profile/dummy-profile-img.jpg';

  const handleViewBusiness = () => {
    if (user.business_slug) {
      window.open(`${WEB_BASE_DOMAIN_URL}/rental-service-provider/${user.business_slug}`, '_blank');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <div className={styles.modalHeader}>
          <h2>User Details</h2>
          <div className={styles.headerLine}></div>
        </div>

        <div className={styles.profileSection}>
          <img
            src={WEB_BASE_URL + imageToShow}
            alt="Profile"
            width={120}
            height={120}
            className={styles.profileImage}
          />
          <h3>{user.first_name} {user.last_name}</h3>

          <span
            className={`${styles.status} ${
              user.active === 1 ? styles.active : styles.inactive
            }`}
          >
            {user.active === 1 ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className={styles.infoBox}>
          <p><strong>Username:</strong> {user.user_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone_number}</p>
          <p>
            <strong>Address:</strong> {user.address_1}, {user.landmark}, {user.city}, {user.state} - {user.pincode}
          </p>
        </div>

        {/* Show button only if business_slug exists */}
        {/* {user.business_slug && (
          <button
            onClick={handleViewBusiness}
            className={styles.primaryBtn}
            style={{ marginBottom: '10px' }}
          >
            View Business Page
          </button>
        )} */}
        {user.business_slug && (
          <a
            target='_blank'
            href={`/rental-service-provider/${user.business_slug}`}
            className={styles.primaryBtn}
            style={{ marginBottom: '10px', textAlign: 'center' }}
          >
            View Business Page
          </a>
        )}

        <button onClick={onClose} className={styles.primaryBtn}>
          Close
        </button>
      </div>
    </div>
  );
}