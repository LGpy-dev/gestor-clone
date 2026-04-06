import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useAuth } from '../context/AuthContext';
import brasaoPm from '../assets/images/brasao-pm-clean.png';
import fundoImage from '../assets/images/fundo.jpg';
import fundoImage2 from '../assets/images/fundo2.jpg';
import fundoImage3 from '../assets/images/fundo3.jpg';
import fundoImage4 from '../assets/images/fundo4.jpg';

const LOGIN_BACKGROUNDS = [fundoImage, fundoImage2, fundoImage3, fundoImage4];

function formatCpfInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d+)/, '$1.$2');
  }

  if (digits.length <= 9) {
    return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
}

function PasswordEyeIcon({ hidden }) {
  return hidden ? (
    <svg
      className="password-toggle-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3 21 21" />
      <path d="M10.58 10.58a2 2 0 0 0 2.84 2.84" />
      <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.9c5.05 0 9.27 3.11 10.5 7.1a11.66 11.66 0 0 1-4.04 5.46" />
      <path d="M6.61 6.62A11.6 11.6 0 0 0 1.5 12c1.23 3.99 5.45 7.1 10.5 7.1 1.72 0 3.36-.36 4.82-1" />
    </svg>
  ) : (
    <svg
      className="password-toggle-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 12S5.5 4.9 12 4.9 22.5 12 22.5 12 18.5 19.1 12 19.1 1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeBackground, setActiveBackground] = useState(0);
  const toast = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBackground((current) => (current + 1) % LOGIN_BACKGROUNDS.length);
    }, 6200);

    return () => window.clearInterval(interval);
  }, []);

  function renderBackgroundSlides(scopeClass = '') {
    return LOGIN_BACKGROUNDS.map((image, index) => (
      <span
        key={`${scopeClass || 'screen'}-${index}`}
        className={`gestor-login-bg-slide ${scopeClass} ${index === activeBackground ? 'is-active' : ''}`.trim()}
        style={{ '--gestor-login-slide-image': `url(${image})` }}
      />
    ));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) {
      return;
    }

    setSubmitting(true);
    try {
      await login(cpf, password);
      navigate('/');
    } catch (error) {
      const inactiveAccess = error.message?.toLowerCase().includes('desativado');
      toast.current?.show({
        severity: inactiveAccess ? 'warn' : 'error',
        summary: inactiveAccess ? 'Acesso bloqueado' : 'Falha no login',
        detail: error.message,
        life: 3600
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="center-screen gestor-login-screen">
      <div className="gestor-login-bg-slideshow" aria-hidden="true">
        {renderBackgroundSlides()}
      </div>

      <Toast ref={toast} position="top-right" />

      <section className="login-card gestor-login-card gestor-login-card-pmpa">
        <Card>
          <div className="gestor-login-photo-fade" aria-hidden="true">
            {renderBackgroundSlides('is-inner')}
          </div>

          <div className="gestor-login-crest-wrap">
            <img src={brasaoPm} alt="Brasao da PMPA" className="gestor-login-crest" />
          </div>

          <form onSubmit={handleSubmit} className="form-col gestor-login-form gestor-login-form-pmpa">
            <label className="sr-only" htmlFor="login-cpf">CPF</label>
            <InputText
              id="login-cpf"
              type="text"
              inputMode="numeric"
              placeholder="CPF"
              value={cpf}
              disabled={submitting}
              autoComplete="username"
              onChange={(e) => setCpf(formatCpfInput(e.target.value))}
            />

            <label className="sr-only" htmlFor="login-password">Senha</label>
            <div className="password-field">
              <InputText
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                disabled={submitting}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="password-field-input"
              />
              <button
                type="button"
                className="password-toggle"
                disabled={submitting}
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <PasswordEyeIcon hidden={showPassword} />
              </button>
            </div>

            <Button
              type="submit"
              label={submitting ? 'Entrando...' : 'Entrar'}
              loading={submitting}
              disabled={submitting}
              className="login-submit-button gestor-login-submit gestor-login-submit-pmpa"
            />

            <button type="button" className="login-helper-link gestor-login-helper" disabled={submitting}>
              Esqueci minha senha
            </button>
          </form>

          <div className="gestor-login-footer gestor-login-footer-pmpa">
            <strong>Gestor</strong>
            <span>P M P A</span>
            <small>Versao 1.3.83</small>
          </div>
        </Card>
      </section>
    </div>
  );
}
