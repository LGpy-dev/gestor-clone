import { useEffect, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router';
import GestorPortalLayout from '../components/GestorPortalLayout';
import { useAuth } from '../context/AuthContext';
import { request } from '../services/api';

const SEARCH_OPTIONS = [
  { label: 'RG', value: 'rg' },
  { label: 'CPF', value: 'cpf' },
  { label: 'NOME', value: 'displayName' },
  { label: 'NOME DE GUERRA', value: 'warName' }
];

const FALLBACK_MOCK_PEOPLE = [
  {
    _id: 'fallback-adm-1',
    name: 'Capitao Responsavel',
    cpf: '12345678901',
    email: 'adm@gestor-pmpa.local',
    role: 'adm',
    active: true,
    displayName: 'CEL QOPM RG 27311 DANIEL PEREIRA MONTEIRO',
    fullName: 'DANIEL PEREIRA MONTEIRO',
    warName: 'MONTEIRO',
    rg: '27311',
    registration: '27311',
    rank: 'CEL QOPM',
    unitPlacement: 'DITEL',
    activityUnit: 'DITEL',
    duty: 'DIRETOR DA DIRETORIA DE TELEMATICA',
    status: 'PRONTO PARA EXERCICIO DAS ATRIBUICOES',
    phone: '(91) 98411-2731',
    civilRg: '4509721',
    cnh: '00192173361',
    cnhCategory: 'B',
    cnhValidity: '01/01/2032',
    susCard: '700 1000 2000 3002',
    voterTitle: '0369 6568 1350',
    voterZone: '001',
    voterSection: '0021',
    birthDate: '30/03/1979',
    birthPlace: 'BELEM-PA',
    nationality: 'BRASILEIRO',
    civilStatus: 'SOLTEIRO',
    religion: 'CATOLICO',
    sex: 'M',
    race: 'PARDA CLARA',
    education: 'MEDIO COMPLETO',
    professionalSkill: 'INFORMATICA BASICA',
    sportSkill: 'FUTEBOL / NATACAO',
    higherEducation: 'GESTAO PUBLICA',
    healthPlan: 'IASEP',
    subJudice: 'NAO'
  },
  {
    _id: 'fallback-user-1',
    name: 'Operador Alfa',
    cpf: '12345678902',
    email: 'alfa@gestor-pmpa.local',
    role: 'user',
    active: true,
    displayName: 'TEN CEL QOPM RG 33433 MARCOS VINICIUS BARBOSA LEAL',
    fullName: 'MARCOS VINICIUS BARBOSA LEAL',
    warName: 'BARBOSA',
    rg: '33433',
    registration: '33433',
    rank: 'TEN CEL QOPM',
    unitPlacement: 'DITEL',
    activityUnit: 'DITEL',
    duty: 'SUBDIRETOR DA DIRETORIA DE TELEMATICA',
    status: 'GOZANDO FERIAS',
    phone: '(91) 98412-3343',
    civilRg: '5211042',
    cnh: '00214573343',
    cnhCategory: 'AB',
    cnhValidity: '14/09/2030',
    susCard: '700 1000 2000 3003',
    voterTitle: '1458 2200 3343',
    voterZone: '007',
    voterSection: '0143',
    birthDate: '12/08/1981',
    birthPlace: 'ANANINDEUA-PA',
    nationality: 'BRASILEIRO',
    civilStatus: 'CASADO',
    religion: 'EVANGELICO',
    sex: 'M',
    race: 'PARDA',
    education: 'ENSINO SUPERIOR COMPLETO',
    professionalSkill: 'TELECOMUNICACOES',
    sportSkill: 'VOLEI',
    higherEducation: 'ENGENHARIA DA COMPUTACAO',
    healthPlan: 'IASEP',
    subJudice: 'NAO'
  },
  {
    _id: 'fallback-user-2',
    name: 'Operador Bravo',
    cpf: '12345678903',
    email: 'bravo@gestor-pmpa.local',
    role: 'user',
    active: true,
    displayName: 'MAJ QOPM RG 35492 ROBERTO CESAR FARIAS COSTA',
    fullName: 'ROBERTO CESAR FARIAS COSTA',
    warName: 'FARIAS',
    rg: '35492',
    registration: '35492',
    rank: 'MAJ QOPM',
    unitPlacement: 'DITEL',
    activityUnit: 'DITEL',
    duty: 'SUBDIRETOR DA DIRETORIA DE TELEMATICA / CHEFE DA SECAO DE ADMINISTRACAO TECNOLOGICA',
    status: 'PRONTO PARA EXERCICIO DAS ATRIBUICOES',
    phone: '(91) 98413-5492',
    civilRg: '6032184',
    cnh: '00317435492',
    cnhCategory: 'B',
    cnhValidity: '22/11/2033',
    susCard: '700 1000 2000 3004',
    voterTitle: '2587 9900 5492',
    voterZone: '011',
    voterSection: '0208',
    birthDate: '09/11/1984',
    birthPlace: 'CASTANHAL-PA',
    nationality: 'BRASILEIRO',
    civilStatus: 'SOLTEIRO',
    religion: 'CATOLICO',
    sex: 'M',
    race: 'BRANCA',
    education: 'ENSINO SUPERIOR COMPLETO',
    professionalSkill: 'ADMINISTRACAO DE REDES',
    sportSkill: 'CICLISMO',
    higherEducation: 'CIENCIA DA COMPUTACAO',
    healthPlan: 'UNIMED',
    subJudice: 'NAO'
  },
  {
    _id: 'fallback-user-3',
    name: 'Operador Charlie',
    cpf: '12345678904',
    email: 'charlie@gestor-pmpa.local',
    role: 'user',
    active: true,
    displayName: 'CAP QOPM RG 38107 LEONARDO SOUSA FERNANDES',
    fullName: 'LEONARDO SOUSA FERNANDES',
    warName: 'FERNANDES',
    rg: '38107',
    registration: '38107',
    rank: 'CAP QOPM',
    unitPlacement: 'DITEL',
    activityUnit: 'DITEL',
    duty: 'CHEFE DO CENTRO DE MONITORAMENTO DA DITEL',
    status: 'EM ATIVIDADE',
    phone: '(91) 98414-8107',
    civilRg: '6447811',
    cnh: '00418338107',
    cnhCategory: 'A',
    cnhValidity: '03/02/2034',
    susCard: '700 1000 2000 3005',
    voterTitle: '3698 4400 8107',
    voterZone: '009',
    voterSection: '0189',
    birthDate: '21/02/1987',
    birthPlace: 'MARABA-PA',
    nationality: 'BRASILEIRO',
    civilStatus: 'CASADO',
    religion: 'CATOLICO',
    sex: 'M',
    race: 'PARDA',
    education: 'ENSINO SUPERIOR COMPLETO',
    professionalSkill: 'MONITORAMENTO OPERACIONAL',
    sportSkill: 'MUSCULACAO',
    higherEducation: 'SEGURANCA PUBLICA',
    healthPlan: 'IASEP',
    subJudice: 'NAO'
  }
];

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function normalizeSearchValue(value) {
  return normalizeText(value).replace(/[^a-z0-9]/g, '');
}

function formatCpf(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11);

  if (digits.length !== 11) {
    return digits;
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function buildMockBgPublications(cpf) {
  switch (normalizeSearchValue(cpf)) {
    case '12345678901':
      return [
        { _id: 'bg-adm-1', date: '25/10/2001', bulletin: 'BG n 199/01', publication: 'APRESENTACAO para reforco operacional no municipio de Ferro/PA durante o segundo turno das eleicoes.' },
        { _id: 'bg-adm-2', date: '19/03/2004', bulletin: 'BG n 044/04', publication: 'EXAME DE INSPECAO DE SAUDE com comparecimento na Formacao Sanitaria do 3 BPM, conforme escala publicada.' },
        { _id: 'bg-adm-3', date: '06/02/2006', bulletin: 'BG n 026/06', publication: 'PORTARIA de sindicancia com designacao para acompanhamento administrativo e entrega de relatorio.' }
      ];
    case '12345678902':
      return [
        { _id: 'bg-user1-1', date: '12/05/2008', bulletin: 'BG n 088/08', publication: 'ELOGIO INDIVIDUAL pela coordenacao de equipe tecnica na implantacao de enlace de dados entre unidades.' },
        { _id: 'bg-user1-2', date: '03/11/2011', bulletin: 'BG n 201/11', publication: 'DESLOCAMENTO EM SERVICO para vistoria de infraestrutura de telecomunicacoes em unidades do interior.' }
      ];
    case '12345678903':
      return [
        { _id: 'bg-user2-1', date: '18/08/2014', bulletin: 'BG n 151/14', publication: 'MOVIMENTACAO interna para chefia da Secao de Administracao Tecnologica da DITEL.' },
        { _id: 'bg-user2-2', date: '27/02/2018', bulletin: 'BG n 041/18', publication: 'QUALIFICACAO concluida em gestao de redes, seguranca perimetral e resposta a incidentes.' }
      ];
    case '12345678904':
      return [
        { _id: 'bg-user3-1', date: '09/09/2019', bulletin: 'BG n 173/19', publication: 'DESIGNACAO para coordenacao do Centro de Monitoramento da DITEL em escala extraordinaria.' },
        { _id: 'bg-user3-2', date: '14/04/2022', bulletin: 'BG n 069/22', publication: 'ELOGIO pela atuacao em integracao de imagens e acompanhamento operacional em grande evento.' }
      ];
    default:
      return [];
  }
}

function enrichPerson(person) {
  return {
    ...person,
    displayName: person.displayName || person.name,
    fullName: person.fullName || person.displayName || person.name,
    warName: person.warName || person.name,
    rg: person.rg || person.registration || '',
    registration: person.registration || '00000',
    rank: person.rank || (person.role === 'adm' ? 'CEL QOPM' : 'SD PM'),
    unitPlacement: person.unitPlacement || 'QCG',
    activityUnit: person.activityUnit || 'QCG',
    duty: person.duty || 'OPERADOR ADMINISTRATIVO',
    status: person.status || (person.active === false ? 'ACESSO DESATIVADO' : 'EM ATIVIDADE'),
    phone: person.phone || '(91) 98000-0000',
    civilRg: person.civilRg || '0',
    cnh: person.cnh || '',
    cnhCategory: person.cnhCategory || '',
    cnhValidity: person.cnhValidity || '',
    susCard: person.susCard || '',
    voterTitle: person.voterTitle || '',
    voterZone: person.voterZone || '',
    voterSection: person.voterSection || '',
    birthDate: person.birthDate || '',
    birthPlace: person.birthPlace || '',
    nationality: person.nationality || '',
    civilStatus: person.civilStatus || '',
    religion: person.religion || '',
    sex: person.sex || '',
    race: person.race || '',
    education: person.education || '',
    professionalSkill: person.professionalSkill || '',
    sportSkill: person.sportSkill || '',
    higherEducation: person.higherEducation || '',
    healthPlan: person.healthPlan || '',
    subJudice: person.subJudice || '',
    bgPublications: Array.isArray(person.bgPublications) && person.bgPublications.length > 0
      ? person.bgPublications
      : buildMockBgPublications(person.cpf)
  };
}

function mergePersonData(basePerson = {}, apiPerson = {}) {
  const merged = { ...basePerson };

  for (const [key, value] of Object.entries(apiPerson || {})) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === 'string' && value.trim() === '') {
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

function getPlaceholder(selectedField) {
  switch (selectedField) {
    case 'rg':
      return 'Consulte por RG';
    case 'warName':
      return 'Consulte por nome de guerra';
    case 'displayName':
      return 'Consulte por nome';
    case 'cpf':
      return 'Consulte por CPF';
    default:
      return 'Consulte por nome';
  }
}

function VisualizarIcon() {
  return (
    <svg className="gestor-consult-visualizar-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.1" fill="currentColor" />
      <rect x="4.6" y="7.2" width="3.6" height="4.2" rx="0.65" fill="#1482e6" />
      <circle cx="6.4" cy="8.9" r="0.95" fill="currentColor" />
      <path d="M10.3 8.5h8.2" stroke="#1482e6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.3 11.9h8.2" stroke="#1482e6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.8 15.2h13.8" stroke="#1482e6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EditarIcon() {
  return (
    <svg className="gestor-consult-editar-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.8 18.4h3.2l9.4-9.4-3.2-3.2-9.4 9.4Zm10.7-13.6 3.2 3.2 1.1-1.1a1.13 1.13 0 0 0 0-1.6l-1.6-1.6a1.13 1.13 0 0 0-1.6 0Z" fill="currentColor" />
      <path d="M4.2 19.8h15.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="gestor-consult-search-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="5.8" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <path d="M15.2 15.2L20 20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ConsultPeoplePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canEditPeople = user?.role === 'super' || user?.role === 'adm';
  const [people, setPeople] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    function buildVisiblePeople(apiUsers = []) {
      const apiPeople = apiUsers.filter((item) => item.role !== 'super');
      const apiByCpf = new Map(apiPeople.map((item) => [String(item.cpf).replace(/\D/g, ''), item]));
      const fallbackByCpf = new Map(FALLBACK_MOCK_PEOPLE.map((item) => [String(item.cpf), enrichPerson(item)]));

      if (user?.role === 'user') {
        const ownCpf = String(user?.cpf ?? '').replace(/\D/g, '');
        const ownApiRecord = apiPeople.find((item) => String(item.cpf).replace(/\D/g, '') === ownCpf);
        const ownFallback = fallbackByCpf.get(ownCpf);
        if (ownApiRecord && ownFallback) {
          return [enrichPerson(mergePersonData(ownFallback, ownApiRecord))];
        }

        if (ownApiRecord) {
          return [enrichPerson(ownApiRecord)];
        }

        return ownFallback ? [ownFallback] : [];
      }

      const merged = FALLBACK_MOCK_PEOPLE.map((basePerson) => {
        const cpf = String(basePerson.cpf);
        const fallbackPerson = enrichPerson(basePerson);
        const apiPerson = apiByCpf.get(cpf);
        return apiPerson ? enrichPerson(mergePersonData(fallbackPerson, apiPerson)) : fallbackPerson;
      });

      const extraApi = apiPeople
        .filter((item) => !fallbackByCpf.has(String(item.cpf).replace(/\D/g, '')))
        .map(enrichPerson);
      return [...merged, ...extraApi];
    }

    async function load() {
      setLoading(true);
      setError('');

      try {
        const data = await request('/users');
        if (!active) {
          return;
        }

        setPeople(buildVisiblePeople(data));
      } catch (loadError) {
        if (active) {
          const fallbackPeople = buildVisiblePeople([]);
          if (fallbackPeople.length > 0) {
            setPeople(fallbackPeople);
          } else {
            setError(loadError.message || 'Nao foi possivel carregar a consulta de pessoas.');
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [user?.id, user?.role]);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(appliedQuery).trim();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter((person) => {
      if (selectedField) {
        return normalizeSearchValue(person[selectedField]).includes(normalizedQuery);
      }

      return [
        person.displayName,
        person.warName,
        person.rg,
        person.cpf,
        person.unitPlacement,
        person.activityUnit,
        person.duty,
        person.status
      ]
        .map(normalizeSearchValue)
        .join(' ')
        .includes(normalizedQuery);
    });
  }, [people, appliedQuery, selectedField]);

  function handleSearch() {
    setAppliedQuery(query);
  }

  function handleQueryChange(event) {
    const nextValue = event.target.value;
    setQuery(nextValue);

    if (!nextValue.trim()) {
      setAppliedQuery('');
    }
  }

  function handleQueryKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  }

  function handleView(person) {
    navigate(`/consultar-pessoas/${String(person.cpf).replace(/\D/g, '')}?mode=view`, {
      state: { person, mode: 'view' }
    });
  }

  function handleEdit(person) {
    navigate(`/consultar-pessoas/${String(person.cpf).replace(/\D/g, '')}?mode=edit`, {
      state: { person, mode: 'edit' }
    });
  }

  return (
    <GestorPortalLayout>
      <section className="gestor-consult-page">
        <header className="gestor-consult-model-header">
          <h1>Consultar Pessoas</h1>
        </header>

        <section className="gestor-consult-model-filters">
          <div className="gestor-consult-model-filter-block">
            <label>Escolha a forma de consulta</label>
            <Dropdown
              value={selectedField}
              options={SEARCH_OPTIONS}
              onChange={(event) => {
                setSelectedField(event.value);
                if (query.trim()) {
                  setAppliedQuery(query);
                }
              }}
              placeholder="Selecione a Opção"
              className="gestor-consult-model-select"
              panelClassName="gestor-consult-dropdown-panel"
            />
          </div>

          <div className="gestor-consult-model-filter-block is-search">
            <label>Digite no campo abaixo</label>
            <div className="gestor-consult-model-searchbar">
              <InputText
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleQueryKeyDown}
                placeholder={getPlaceholder(selectedField)}
              />
              <Button type="button" icon={<SearchIcon />} aria-label="Pesquisar" onClick={handleSearch} />
            </div>
          </div>
        </section>

        <section className="gestor-consult-results">
          {error ? (
            <div className="gestor-consult-feedback is-error">{error}</div>
          ) : loading ? (
            <div className="gestor-consult-feedback">Carregando relacao de pessoas...</div>
          ) : filteredPeople.length === 0 ? (
            <div className="gestor-consult-feedback">Nenhum registro encontrado.</div>
          ) : (
            filteredPeople.map((person) => (
              <article key={person._id || person.id || person.cpf} className="gestor-consult-result-card">
                <div className="gestor-consult-result-copy">
                  <p><strong>Nome:</strong> {person.displayName}</p>
                  <p><strong>CPF:</strong> {String(person.cpf).replace(/\D/g, '')}</p>
                  <p><strong>Unidade Lotacao:</strong> {person.unitPlacement}</p>
                  <p><strong>Unidade Atividade:</strong> {person.activityUnit}</p>
                  <p><strong>Funcao:</strong> {person.duty}</p>
                  <p><strong>Situacao:</strong> {person.status}</p>
                </div>

                <div className="gestor-consult-result-actions">
                  <Button
                    type="button"
                    label="Visualizar"
                    className="gestor-consult-result-button gestor-consult-result-button-view"
                    icon={<VisualizarIcon />}
                    onClick={() => handleView(person)}
                  />
                  {canEditPeople && (
                    <Button
                      type="button"
                      label="Editar"
                      className="gestor-consult-result-button gestor-consult-result-button-edit"
                      icon={<EditarIcon />}
                      onClick={() => handleEdit(person)}
                    />
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </section>

    </GestorPortalLayout>
  );
}
