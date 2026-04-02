import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useAuth } from '../context/AuthContext';
import brasaoPm from '../assets/images/brasao-pm.png';
import fundoImage from '../assets/images/fundo.jpg';

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

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div
      className="center-screen gestor-login-screen"
      style={{ '--gestor-login-bg': `url(${fundoImage})` }}
    >
      <Toast ref={toast} position="top-right" />

      <section className="login-card gestor-login-card gestor-login-card-pmpa">
        <Card>
          <div className="gestor-login-photo-fade" />

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
                <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`} />
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
