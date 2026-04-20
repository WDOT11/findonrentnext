import styles from '../adminrohpnl/page.module.css'

export default function userAuth() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Welcome, Login here to access the account.</h2>
      <p className={styles.intro}>This is your control panel. Manage categories, users, and app settings from here.</p>

      {/* Stats Section */}
      <div className={styles.section}>
        <h3>Stats Overview</h3>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <strong>24</strong>
            <p>Total Categories</p>
          </div>
          <div className={styles.card}>
            <strong>157</strong>
            <p>Registered Users</p>
          </div>
          <div className={styles.card}>
            <strong>3</strong>
            <p>Pending Requests</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h3>Recent Activity</h3>
        <ul>
          <li>User "LXGyS@example.com" registered</li>
          <li>Request to delete "Outdated Products" category</li>
        </ul>
      </div>
    </div>
  )
}