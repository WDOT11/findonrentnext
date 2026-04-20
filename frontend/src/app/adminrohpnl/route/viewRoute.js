'use client';
import styles from '../admin.module.css';

export default function ViewRoute({ routeGroup, route, onClose }) {
  if (!route) return null;

  return (
    <div className={styles.roh_modal_overlay}>
      <div className={styles.roh_viewuser_modal}>
        <button className={styles.modalCloseButton} onClick={onClose}>×</button>
        <h2>Route Details</h2>
        <div className={styles.viewuser_details}>
          <p><strong>Name:</strong> {route.route_name} </p>
          <p><strong>Route Type:</strong> { route.route_type == 1 ? 'Admin' : route.route_type == 2 ? 'User' : route.route_type == 3 ? 'Public' : '' } </p>
          <p><strong>Access Type:</strong> {route.access_type == 1 ? 'View' : route.access_type == 2 ? 'All' : ''} </p>
          <p><strong>Group Name:</strong> { routeGroup.find((group) => group.id == route.group_name)?.groupName || 'Unknown' } </p>
        </div>
        <button onClick={onClose} className={styles.roh_close_btn}>Close</button>
      </div>
    </div>
  );
}