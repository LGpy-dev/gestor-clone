import GestorPortalLayout from '../components/GestorPortalLayout';

export default function DashboardPage() {
  return (
    <GestorPortalLayout>
      <div className="gestor-dashboard-metrics">
        <article className="gestor-dashboard-card mission">
          <header>MISSAO</header>
          <div className="gestor-dashboard-card-body gestor-dashboard-card-body-mission">
            <div className="gestor-bars-icon" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </article>

        <article className="gestor-dashboard-card service">
          <header>Tempo de Servico</header>
          <div className="gestor-dashboard-card-body">
            <p>Efetivo Servico:</p>
          </div>
        </article>

        <article className="gestor-dashboard-card extra">
          <header>Extraordinario</header>
          <div className="gestor-dashboard-card-body">
            <p>Voce tirou Extraordinarios referente ao Mes Atual</p>
          </div>
        </article>
      </div>

      <div className="gestor-dashboard-panels">
        <section className="gestor-dashboard-panel">
          <header>Informacoes funcional</header>
          <div className="gestor-dashboard-panel-body gestor-dashboard-functional">
            <div className="gestor-dashboard-functional-row">
              <span>SITUACAO FUNCIONAL</span>
              <strong>PRONTO PARA EXERCICIO DAS ATRIBUICOES</strong>
            </div>

            <div className="gestor-dashboard-functional-row">
              <span>COMPORTAMENTO DISCIPLINAR</span>
              <strong />
            </div>

            <div className="gestor-dashboard-functional-row">
              <span>SETOR DE ATIVIDADE NA UNIDADE</span>
              <strong>SECAO DE ADMINISTRACAO TECNOLOGICA</strong>
            </div>

            <div className="gestor-dashboard-functional-row">
              <span>FUNCAO DE ATIVIDADE NA UNIDADE</span>
              <strong>VOLUNTARIO CIVIL (DITEL)</strong>
            </div>
          </div>
        </section>

        <section className="gestor-dashboard-panel">
          <header>Diarias Pendentes</header>
          <div className="gestor-dashboard-panel-body gestor-dashboard-pending">
            <p>Parabens, voce nao possui nenhuma pendencia no SIAFE.</p>
          </div>
        </section>
      </div>
    </GestorPortalLayout>
  );
}
