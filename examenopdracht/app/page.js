'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './(auth)/auth.module.css';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('register');

  // Register state
  const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerServerError, setRegisterServerError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginServerError, setLoginServerError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // --- Register ---
  function handleRegisterChange(e) {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (registerErrors[name]) setRegisterErrors((prev) => ({ ...prev, [name]: '' }));
    if (registerServerError) setRegisterServerError('');
  }

  function validateRegister() {
    const errors = {};
    if (!registerData.email.trim()) errors.email = 'E-mailadres is verplicht';
    else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) errors.email = 'Voer een geldig e-mailadres in';
    if (!registerData.password) errors.password = 'Wachtwoord is verplicht';
    else if (registerData.password.length < 6) errors.password = 'Minimaal 6 tekens';
    if (!registerData.confirmPassword) errors.confirmPassword = 'Bevestig je wachtwoord';
    else if (registerData.password !== registerData.confirmPassword) errors.confirmPassword = 'Wachtwoorden komen niet overeen';
    return errors;
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    const errors = validateRegister();
    if (Object.keys(errors).length > 0) { setRegisterErrors(errors); return; }

    setRegisterLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerData.email, password: registerData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegisterServerError(data.error || 'Registratie mislukt.');
      } else {
        setRegisterSuccess('Account aangemaakt! Je kunt nu inloggen.');
        setTimeout(() => { setActiveTab('login'); setRegisterSuccess(''); }, 2000);
      }
    } catch {
      setRegisterServerError('Verbindingsfout. Probeer opnieuw.');
    } finally {
      setRegisterLoading(false);
    }
  }

  // --- Login ---
  function handleLoginChange(e) {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) setLoginErrors((prev) => ({ ...prev, [name]: '' }));
    if (loginServerError) setLoginServerError('');
  }

  function validateLogin() {
    const errors = {};
    if (!loginData.email.trim()) errors.email = 'E-mailadres is verplicht';
    if (!loginData.password) errors.password = 'Wachtwoord is verplicht';
    return errors;
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const errors = validateLogin();
    if (Object.keys(errors).length > 0) { setLoginErrors(errors); return; }

    setLoginLoading(true);
    try {
      const result = await signIn('credentials', {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      });
      if (result?.error) {
        setLoginServerError('Ongeldig e-mailadres of wachtwoord.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setLoginServerError('Er is een fout opgetreden. Probeer opnieuw.');
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>

        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Welkom bij WorkoutApp</h1>
          <p className={styles.authSubtitle}>Registreer of log in om te beginnen</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'register' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Registreren
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Inloggen
          </button>
        </div>

        {/* Register form */}
        {activeTab === 'register' && (
          <form className={styles.authForm} onSubmit={handleRegisterSubmit} noValidate>
            {registerServerError && (
              <div className={styles.alertError}>{registerServerError}</div>
            )}
            {registerSuccess && (
              <div className={styles.alertSuccess}>{registerSuccess}</div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="reg-email" className={styles.formLabel}>E-mailadres</label>
              <input
                id="reg-email" name="email" type="email"
                value={registerData.email} onChange={handleRegisterChange}
                className={`${styles.formInput} ${registerErrors.email ? styles.inputError : ''}`}
                placeholder="naam@email.com" disabled={registerLoading}
              />
              {registerErrors.email && <p className={styles.fieldError}>{registerErrors.email}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-password" className={styles.formLabel}>Wachtwoord</label>
              <input
                id="reg-password" name="password" type="password"
                value={registerData.password} onChange={handleRegisterChange}
                className={`${styles.formInput} ${registerErrors.password ? styles.inputError : ''}`}
                placeholder="••••••••" disabled={registerLoading}
              />
              {registerErrors.password && <p className={styles.fieldError}>{registerErrors.password}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg-confirm" className={styles.formLabel}>Bevestig wachtwoord</label>
              <input
                id="reg-confirm" name="confirmPassword" type="password"
                value={registerData.confirmPassword} onChange={handleRegisterChange}
                className={`${styles.formInput} ${registerErrors.confirmPassword ? styles.inputError : ''}`}
                placeholder="••••••••" disabled={registerLoading}
              />
              {registerErrors.confirmPassword && <p className={styles.fieldError}>{registerErrors.confirmPassword}</p>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={registerLoading}>
              {registerLoading ? (
                <span className={styles.btnContent}><span className={styles.spinner} /> Registreren...</span>
              ) : 'Account aanmaken'}
            </button>

            <p className={styles.authNote}>Elke gebruiker krijgt een uniek ID na registratie</p>
          </form>
        )}

        {/* Login form */}
        {activeTab === 'login' && (
          <form className={styles.authForm} onSubmit={handleLoginSubmit} noValidate>
            {loginServerError && (
              <div className={styles.alertError}>{loginServerError}</div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="login-email" className={styles.formLabel}>E-mailadres</label>
              <input
                id="login-email" name="email" type="email"
                value={loginData.email} onChange={handleLoginChange}
                className={`${styles.formInput} ${loginErrors.email ? styles.inputError : ''}`}
                placeholder="naam@email.com" disabled={loginLoading}
              />
              {loginErrors.email && <p className={styles.fieldError}>{loginErrors.email}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-password" className={styles.formLabel}>Wachtwoord</label>
              <input
                id="login-password" name="password" type="password"
                value={loginData.password} onChange={handleLoginChange}
                className={`${styles.formInput} ${loginErrors.password ? styles.inputError : ''}`}
                placeholder="••••••••" disabled={loginLoading}
              />
              {loginErrors.password && <p className={styles.fieldError}>{loginErrors.password}</p>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loginLoading}>
              {loginLoading ? (
                <span className={styles.btnContent}><span className={styles.spinner} /> Inloggen...</span>
              ) : 'Inloggen'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}