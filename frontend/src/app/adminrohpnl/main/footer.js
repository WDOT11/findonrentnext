import styles from '../admin.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} FindOnRent. All rights reserved.</p>
      <p>
        Developed by{' '}
        <a href="https://webdevops.ltd/" target="_blank" rel="noopener">
          WebDevOps Pvt Ltd
        </a>
      </p>
    </footer>
  );
}
