'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  }

  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Naam moet minimaal 2 tekens bevatten';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Voer een geldig e-mailadres in';
    }

    if (!formData.password) {
      newErrors.password = 'Wachtwoord is verplicht';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Wachtwoord moet minimaal 6 tekens bevatten';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Bevestig je wachtwoord';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Wachtwoorden komen niet overeen';
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || 'Registratie mislukt. Probeer het opnieuw.');
      } else {
        setSuccessMessage(`Account aangemaakt! Je unieke ID: ${data.userId}`);
        setTimeout(() => {
          router.push('/login');
        }, 2500);
      }
    } catch {
      setServerError('Er is een verbindingsfout opgetreden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authLogo}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/>
            </svg>
          </div>
          <h1 className={styles.authTitle}>Account aanmaken</h1>
          <p className={styles.authSubtitle}>Maak een gratis account aan en begin met trainen</p>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit} noValidate>
          {serverError && (
            <div className={styles.alertError}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className={styles.alertSuccess}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {successMessage} — je wordt doorgestuurd...
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Volledige naam
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
              placeholder="Jan de Vries"
              disabled={loading}
            />
            {errors.name && (
              <p className={styles.fieldError}>{errors.name}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
              placeholder="jouw@email.nl"
              disabled={loading}
            />
            {errors.email && (
              <p className={styles.fieldError}>{errors.email}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Wachtwoord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
              placeholder="Minimaal 6 tekens"
              disabled={loading}
            />
            {errors.password ? (
              <p className={styles.fieldError}>{errors.password}</p>
            ) : (
              <p className={styles.passwordHint}>Minimaal 6 tekens</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Wachtwoord bevestigen
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Herhaal je wachtwoord"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className={styles.fieldError}>{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !!successMessage}
          >
            {loading ? (
              <span className={styles.btnContent}>
                <span className={styles.spinner} />
                Registreren...
              </span>
            ) : (
              'Account aanmaken'
            )}
          </button>
        </form>

        <div className={styles.authFooter} style={{ marginTop: '24px' }}>
          Al een account?{' '}
          <Link href="/login" className={styles.authLink}>
            Log hier in
          </Link>
        </div>
      </div>
    </div>
  );
}