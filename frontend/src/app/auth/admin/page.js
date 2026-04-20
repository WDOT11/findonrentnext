'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AnimatedBackground from './components/AnimatedBackground';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

/** Admin login - Coded by Raj & Vishnu - Updated for Rental Panel */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const token = getCookie('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        window.location.href = "/adminrohpnl";
      }
    }
  }, []);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await res.json();

      if (data.status === false) {
        throw new Error(data.message || 'Login failed');
      }

      document.cookie = `authToken=${data.token}; path=/`;
      document.cookie = `authUser=${JSON.stringify(data.user)}; path=/`;
      window.location.href = "/adminrohpnl";
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* <AnimatedBackground /> */}
      <div style={styles.container}>
        {/* Left Banner */}
        <div style={styles.leftPane}>
          <h1 style={styles.brandTitle}>FindOnRent</h1>
          <p style={styles.subtitle}>Rental Management Admin Panel</p>
          <p style={styles.tagline}>Manage vehicles, users, and bookings all in one place.</p>
        </div>

        {/* Right Form */}
        <div style={styles.rightPane}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.signinTitle}>Admin Login</h3>

            <div style={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={styles.showPasswordBtn}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button type="submit" style={styles.loginButton}>LOGIN</button>
          </form>

          <p style={styles.footerNote}>© {new Date().getFullYear()} WebDevOps Private Limited</p>
        </div>
      </div>
    </div>
  );
}

// Stylish Rental Admin Panel Theme
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #00264d 0%, #007bff 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    width: '920px',
    height: '520px',
    display: 'flex',
    borderRadius: '20px',
    boxShadow: '0 0 35px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    background: '#fff',
  },
  leftPane: {
    flex: 1,
    background: 'linear-gradient(135deg, #0056b3 0%, #00aaff 100%)',
    color: '#fff',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '1rem',
    letterSpacing: '1px',
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: '500',
    marginBottom: '0.5rem',
  },
  tagline: {
    fontSize: '15px',
    opacity: 0.9,
    maxWidth: '80%',
  },
  rightPane: {
    flex: 1,
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  signinTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '2rem',
    borderBottom: '3px solid #007bff',
    width: 'fit-content',
    paddingBottom: '0.5rem',
    color: '#007bff',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '15px',
    transition: '0.3s',
  },
  showPasswordBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  loginButton: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: '0.3s',
  },
  footerNote: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '13px',
    color: '#888',
  },
};
