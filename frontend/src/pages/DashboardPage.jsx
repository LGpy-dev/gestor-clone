import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import AppMenu from '../components/AppMenu';
import { request } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, clients: 0, products: 0 });

  useEffect(() => {
    request('/dashboard').then(setStats).catch(console.error);
  }, []);

  return (
    <div className="page">
      <AppMenu />

      <div className="page-content">
        <section className="stats-hero gestor-hero">
          <div className="gestor-hero-kicker">Painel operacional PMPA</div>
          <h1>Gestor Web</h1>
          <p>
            Acompanhe usuarios, bases cadastradas e registros mockados em um unico
            painel para demonstracao do ambiente administrativo.
          </p>
          <div className="hero-meta">
            <span className="hero-pill">Acesso por perfil</span>
            <span className="hero-pill">Dados mockados em MongoDB</span>
          </div>
        </section>

        <div className="grid-cards">
          <div className="stat-card">
            <Card title="Usuarios">
              <h2 className="stat-value">{stats.users}</h2>
            </Card>
          </div>

          <div className="stat-card">
            <Card title="Clientes">
              <h2 className="stat-value">{stats.clients}</h2>
            </Card>
          </div>

          <div className="stat-card">
            <Card title="Registros">
              <h2 className="stat-value">{stats.products}</h2>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
