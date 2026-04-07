import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useLocation, useNavigate, useParams } from 'react-router';
import GestorPortalLayout from '../components/GestorPortalLayout';
import { useAuth } from '../context/AuthContext';
import { request } from '../services/api';

const TOAST_LIFE = 4200;
const TOAST_SUCCESS_LIFE = 3200;
const EMPTY_BG_FORM = {
  _id: '',
  date: '',
  bulletin: '',
  publication: ''
};

const EMPTY_JUDICIAL_FORM = {
  _id: '',
  date: '',
  description: ''
};

function normalizeCpf(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function formatCpf(value) {
  const digits = normalizeCpf(value).slice(0, 11);

  if (digits.length !== 11) {
    return digits;
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function parseBrazilianDate(value) {
  const match = String(value ?? '').trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return Number.NEGATIVE_INFINITY;
  }

  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

function parseBrazilianDateToDate(value) {
  const match = String(value ?? '').trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateToBrazilian(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return '';
  }

  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = value.getFullYear();
  return `${day}/${month}/${year}`;
}

function sortItemsByDate(items = []) {
  return [...items].sort((left, right) => parseBrazilianDate(right.date) - parseBrazilianDate(left.date));
}

function sortBgPublications(items = []) {
  return sortItemsByDate(items);
}

function sortJudicialPendencies(items = []) {
  return sortItemsByDate(items);
}

function formatBulletinNumber(value) {
  return String(value ?? '')
    .replace(/^bg\s*(n[oÂºÂ°.]*)?\s*/i, '')
    .trim();
}

function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function buildMockBgPublications(cpf) {
  switch (normalizeCpf(cpf)) {
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

function buildMockJudicialPendencies(cpf) {
  switch (normalizeCpf(cpf)) {
    case '12345678901':
      return [
        { _id: 'jp-adm-1', date: '14/02/2024', description: 'Manifestacao encaminhada a assessoria juridica sobre acompanhamento de processo administrativo disciplinar ja encerrado.' }
      ];
    case '12345678902':
      return [
        { _id: 'jp-user1-1', date: '03/09/2023', description: 'Registro de comparecimento para prestacao de esclarecimentos em procedimento judicial sem pendencias ativas.' }
      ];
    case '12345678903':
      return [
        { _id: 'jp-user2-1', date: '19/06/2022', description: 'Anotacao de acompanhamento de oficio judicial para apresentacao de documentos funcionais junto a unidade competente.' }
      ];
    case '12345678904':
      return [
        { _id: 'jp-user3-1', date: '28/11/2021', description: 'Controle interno de resposta a requisicao judicial referente a relatorio tecnico de operacao concluida.' }
      ];
    default:
      return [];
  }
}

function enrichPerson(person) {
  return {
    ...person,
    displayName: person.displayName || person.name || '',
    fullName: person.fullName || person.displayName || person.name || '',
    rg: person.rg || person.registration || '',
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
      ? sortBgPublications(person.bgPublications.map((item, index) => ({
        _id: item._id || `bg-${index + 1}`,
        date: item.date || '',
        bulletin: item.bulletin || '',
        publication: item.publication || ''
      })))
      : sortBgPublications(buildMockBgPublications(person.cpf)),
    judicialPendencies: Array.isArray(person.judicialPendencies) && person.judicialPendencies.length > 0
      ? sortJudicialPendencies(person.judicialPendencies.map((item, index) => ({
        _id: item._id || `judicial-${index + 1}`,
        date: item.date || '',
        description: item.description || ''
      })))
      : sortJudicialPendencies(buildMockJudicialPendencies(person.cpf)),
    unitPlacement: person.unitPlacement || '',
    activityUnit: person.activityUnit || '',
    duty: person.duty || '',
    status: person.status || '',
    rank: person.rank || '',
    phone: person.phone || '',
    email: person.email || ''
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

function PdfIcon() {
  return (
    <svg className="gestor-profile-button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2.75h7.3L19.75 8v13.1a1.15 1.15 0 0 1-1.15 1.15H7a1.15 1.15 0 0 1-1.15-1.15V3.9A1.15 1.15 0 0 1 7 2.75Z" fill="currentColor" />
      <path d="M14.25 2.75V8h5.5" fill="#f01522" opacity="0.28" />
      <path d="M8.35 15.65c.68 0 1.18-.1 1.5-.3.33-.2.5-.52.5-.97 0-.42-.15-.73-.43-.93-.29-.2-.72-.3-1.3-.3h-.48v2.5h.21Zm-.21 3.2H6.7v-7.07h1.54c1.15 0 2 .16 2.56.49.56.32.84.86.84 1.6 0 .52-.16.96-.48 1.33-.32.36-.79.6-1.4.73l2.56 2.92h-1.7L8.94 15.9h-.8v2.95Zm7.92-3.62c0-.74-.16-1.28-.49-1.62-.33-.34-.84-.51-1.54-.51h-.61v4.4h.5c.76 0 1.31-.19 1.66-.56.32-.35.48-.92.48-1.71Zm1.54-.05c0 1.16-.32 2.07-.97 2.71-.65.64-1.57.96-2.77.96h-1.96v-7.07h2.16c1.11 0 1.98.31 2.6.93.63.61.94 1.43.94 2.47Zm2.34 3.67h-1.47v-7.07h4v1.27h-2.53v1.78h2.35v1.27h-2.35v2.75Z" fill="#ffffff" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg className="gestor-profile-button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open = false }) {
  return (
    <svg className={`gestor-profile-section-icon ${open ? 'is-open' : ''}`} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5 3.25 10.5 8 5 12.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg className="gestor-profile-mini-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5.5v13M5.5 12h13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="gestor-profile-mini-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="5.8" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="m15.5 15.5 4 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg className="gestor-profile-mini-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.8 12s3.4-5.2 9.2-5.2 9.2 5.2 9.2 5.2-3.4 5.2-9.2 5.2S2.8 12 2.8 12Z" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="2.7" fill="currentColor" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="gestor-profile-mini-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.8 18.4h3.2l9.4-9.4-3.2-3.2-9.4 9.4Zm10.7-13.6 3.2 3.2 1.1-1.1a1.13 1.13 0 0 0 0-1.6l-1.6-1.6a1.13 1.13 0 0 0-1.6 0Z" fill="currentColor" />
      <path d="M4.2 19.8h15.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className="gestor-profile-mini-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 6.8h9l-.7 11.1a1.2 1.2 0 0 1-1.2 1.1H9.4a1.2 1.2 0 0 1-1.2-1.1Z" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path d="M5.7 6.8h12.6M9.7 6.8V5.3c0-.55.45-1 1-1h2.6c.55 0 1 .45 1 1v1.5M10.2 10.2v5.5M13.8 10.2v5.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ProfileAvatar() {
  return (
    <div className="gestor-profile-photo" aria-hidden="true">
      <div className="gestor-profile-photo-card">
        <div className="gestor-profile-photo-pattern" />

        <div className="gestor-profile-photo-figure">
          <svg className="gestor-profile-photo-silhouette" viewBox="0 0 120 150">
            <ellipse cx="60" cy="44" rx="26" ry="29" fill="currentColor" />
            <path
              d="M27 131c2-28 16-43 33-43s31 15 33 43"
              fill="currentColor"
            />
            <path
              d="M38 96c8 7 16 11 22 11s14-4 22-11"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function PersonProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { personCpf } = useParams();
  const toast = useRef(null);
  const bgSearchInputRef = useRef(null);
  const judicialSearchInputRef = useRef(null);
  const [person, setPerson] = useState(() => (location.state?.person ? enrichPerson(location.state.person) : null));
  const [loading, setLoading] = useState(!location.state?.person);
  const [error, setError] = useState('');
  const [printAll, setPrintAll] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({
    personal: false,
    functional: false
  });
  const [functionalPanelsOpen, setFunctionalPanelsOpen] = useState({
    other: false,
    judicial: false
  });
  const [bgDialogOpen, setBgDialogOpen] = useState(false);
  const [bgDialogMode, setBgDialogMode] = useState('view');
  const [bgForm, setBgForm] = useState(EMPTY_BG_FORM);
  const [bgSaving, setBgSaving] = useState(false);
  const [bgSearch, setBgSearch] = useState('');
  const [judicialDialogOpen, setJudicialDialogOpen] = useState(false);
  const [judicialDialogMode, setJudicialDialogMode] = useState('view');
  const [judicialForm, setJudicialForm] = useState(EMPTY_JUDICIAL_FORM);
  const [judicialSaving, setJudicialSaving] = useState(false);
  const [judicialSearch, setJudicialSearch] = useState('');
  const queryMode = useMemo(() => new URLSearchParams(location.search).get('mode'), [location.search]);
  const pageMode = queryMode === 'edit' ? 'edit' : 'view';
  const canManageBg = (user?.role === 'super' || user?.role === 'adm') && pageMode === 'edit';
  const bgPublications = Array.isArray(person?.bgPublications) ? person.bgPublications : [];
  const judicialPendencies = Array.isArray(person?.judicialPendencies) ? person.judicialPendencies : [];
  const filteredBgPublications = useMemo(() => {
    const query = normalizeSearchText(bgSearch);

    if (!query) {
      return bgPublications;
    }

    return bgPublications.filter((item) => {
      const haystack = normalizeSearchText([
        item.date,
        formatBulletinNumber(item.bulletin),
        item.publication
      ].join(' '));

      return haystack.includes(query);
    });
  }, [bgPublications, bgSearch]);
  const filteredJudicialPendencies = useMemo(() => {
    const query = normalizeSearchText(judicialSearch);

    if (!query) {
      return judicialPendencies;
    }

    return judicialPendencies.filter((item) => {
      const haystack = normalizeSearchText([
        item.date,
        item.description
      ].join(' '));

      return haystack.includes(query);
    });
  }, [judicialPendencies, judicialSearch]);
  const isBgDialogReadOnly = bgDialogMode === 'view';
  const isJudicialDialogReadOnly = judicialDialogMode === 'view';
  const bgDialogTitle = bgDialogMode === 'create'
    ? 'Adicionar publicação de BG'
    : bgDialogMode === 'edit'
      ? 'Editar publicação de BG'
      : 'Visualizar publicação de BG';
  const judicialDialogTitle = judicialDialogMode === 'create'
    ? 'Adicionar pendência judicial'
    : judicialDialogMode === 'edit'
      ? 'Editar pendência judicial'
      : 'Visualizar pendência judicial';

  useEffect(() => {
    let active = true;
    const normalizedTargetCpf = normalizeCpf(personCpf);

    async function load() {
      setLoading(true);
      setError('');

      try {
        const matched = await request(`/users/by-cpf/${normalizedTargetCpf}`);
        if (!active) {
          return;
        }

        if (!matched) {
          setError('Pessoa nao encontrada.');
          setLoading(false);
          return;
        }

        const basePerson = location.state?.person && normalizeCpf(location.state.person.cpf) === normalizedTargetCpf
          ? enrichPerson(location.state.person)
          : null;

        setPerson(basePerson ? enrichPerson(mergePersonData(basePerson, matched)) : enrichPerson(matched));
      } catch (loadError) {
        if (!active) {
          return;
        }

        if (!location.state?.person || normalizeCpf(location.state.person.cpf) !== normalizedTargetCpf) {
          setError(loadError.message || 'Nao foi possivel carregar a ficha funcional.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (!person || normalizeCpf(person.cpf) !== normalizedTargetCpf) {
      load();
    }

    return () => {
      active = false;
    };
  }, [location.state?.person, person, personCpf]);

  function toggleSection(section) {
    setSectionsOpen((current) => ({
      ...current,
      [section]: !current[section]
    }));
  }

  function toggleFunctionalPanel(panel) {
    setFunctionalPanelsOpen((current) => ({
      ...current,
      [panel]: !current[panel]
    }));
  }

  function openViewBg(item) {
    setBgDialogMode('view');
    setBgForm({
      _id: item._id || '',
      date: item.date || '',
      bulletin: item.bulletin || '',
      publication: item.publication || ''
    });
    setBgDialogOpen(true);
  }

  function openEditBg(item) {
    setBgDialogMode('edit');
    setBgForm({
      _id: item._id || '',
      date: item.date || '',
      bulletin: item.bulletin || '',
      publication: item.publication || ''
    });
    setBgDialogOpen(true);
  }

  function openCreateBg() {
    setBgDialogMode('create');
    setBgForm(EMPTY_BG_FORM);
    setBgDialogOpen(true);
  }

  function closeBgDialog() {
    setBgDialogOpen(false);
    setBgDialogMode('view');
    setBgForm(EMPTY_BG_FORM);
  }

  function openViewJudicial(item) {
    setJudicialDialogMode('view');
    setJudicialForm({
      _id: item._id || '',
      date: item.date || '',
      description: item.description || ''
    });
    setJudicialDialogOpen(true);
  }

  function openEditJudicial(item) {
    setJudicialDialogMode('edit');
    setJudicialForm({
      _id: item._id || '',
      date: item.date || '',
      description: item.description || ''
    });
    setJudicialDialogOpen(true);
  }

  function openCreateJudicial() {
    setJudicialDialogMode('create');
    setJudicialForm(EMPTY_JUDICIAL_FORM);
    setJudicialDialogOpen(true);
  }

  function closeJudicialDialog() {
    setJudicialDialogOpen(false);
    setJudicialDialogMode('view');
    setJudicialForm(EMPTY_JUDICIAL_FORM);
  }

  async function persistBgPublications(nextItems) {
    if (!person?._id) {
      throw new Error('Não foi possível identificar o perfil para salvar as publicações.');
    }

      const response = await request(`/users/${person._id}/bg-publications`, {
        method: 'PUT',
        body: JSON.stringify({ bgPublications: nextItems })
      });

      setPerson((current) => enrichPerson(mergePersonData(current, response)));
    }

  async function persistJudicialPendencies(nextItems) {
    if (!person?._id) {
      throw new Error('Não foi possível identificar o perfil para salvar as pendências.');
    }

    const response = await request(`/users/${person._id}/judicial-pendencies`, {
      method: 'PUT',
      body: JSON.stringify({ judicialPendencies: nextItems })
    });

    setPerson((current) => enrichPerson(mergePersonData(current, response)));
  }

  async function handleSaveBg() {
    if (!canManageBg) {
      return;
    }

      if (!bgForm.date.trim() || !bgForm.publication.trim()) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Campos obrigatórios',
          detail: 'Informe a data e a publicação antes de salvar.',
          life: TOAST_LIFE
        });
        return;
    }

    setBgSaving(true);

    try {
      const currentItems = Array.isArray(person?.bgPublications) ? person.bgPublications : [];
      const nextItem = {
        _id: bgForm._id || `temp-${Date.now()}`,
        date: bgForm.date.trim(),
        bulletin: bgForm.bulletin.trim(),
        publication: bgForm.publication.trim()
      };

      const nextItems = sortBgPublications(bgForm._id
        ? currentItems.map((item) => (String(item._id) === String(bgForm._id) ? nextItem : item))
        : [...currentItems, nextItem]);

      await persistBgPublications(nextItems);
      closeBgDialog();
      setFunctionalPanelsOpen((current) => ({ ...current, other: true }));
        toast.current?.show({
          severity: 'success',
          summary: bgForm._id ? 'Informação atualizada' : 'Informação adicionada',
          detail: bgForm._id ? 'O registro foi atualizado.' : 'O registro foi adicionado.',
          life: TOAST_SUCCESS_LIFE
        });
      } catch (saveError) {
        toast.current?.show({
          severity: 'error',
          summary: 'Falha ao salvar',
          detail: saveError.message || 'Não foi possível salvar a publicação.',
          life: TOAST_LIFE
        });
    } finally {
      setBgSaving(false);
    }
  }

  async function handleSaveJudicial() {
    if (!canManageBg) {
      return;
    }

    if (!judicialForm.date.trim() || !judicialForm.description.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Informe a data e a pendência antes de salvar.',
        life: TOAST_LIFE
      });
      return;
    }

    setJudicialSaving(true);

    try {
      const currentItems = Array.isArray(person?.judicialPendencies) ? person.judicialPendencies : [];
      const nextItem = {
        _id: judicialForm._id || `temp-judicial-${Date.now()}`,
        date: judicialForm.date.trim(),
        description: judicialForm.description.trim()
      };

      const nextItems = sortJudicialPendencies(judicialForm._id
        ? currentItems.map((item) => (String(item._id) === String(judicialForm._id) ? nextItem : item))
        : [...currentItems, nextItem]);

      await persistJudicialPendencies(nextItems);
      closeJudicialDialog();
      setFunctionalPanelsOpen((current) => ({ ...current, judicial: true }));
      toast.current?.show({
        severity: 'success',
        summary: judicialForm._id ? 'Informação atualizada' : 'Informação adicionada',
        detail: judicialForm._id ? 'O registro foi atualizado.' : 'O registro foi adicionado.',
        life: TOAST_SUCCESS_LIFE
      });
    } catch (saveError) {
      toast.current?.show({
        severity: 'error',
        summary: 'Falha ao salvar',
        detail: saveError.message || 'Não foi possível salvar a pendência judicial.',
        life: TOAST_LIFE
      });
    } finally {
      setJudicialSaving(false);
    }
  }

  function handleDeleteBg(item) {
    if (!canManageBg) {
      return;
    }

    confirmDialog({
      message: 'Deseja excluir esta publicação?',
      header: 'Confirmar exclusão',
      className: 'gestor-confirm-delete-dialog',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          const currentItems = Array.isArray(person?.bgPublications) ? person.bgPublications : [];
          const nextItems = currentItems.filter((bgItem) => String(bgItem._id) !== String(item._id));
          await persistBgPublications(nextItems);
          toast.current?.show({
            severity: 'error',
            summary: 'Informação removida',
             detail: 'O registro foi removido.',
            life: TOAST_SUCCESS_LIFE
          });
        } catch (deleteError) {
          toast.current?.show({
            severity: 'error',
            summary: 'Falha ao excluir',
            detail: deleteError.message || 'Não foi possível excluir a publicação.',
            life: TOAST_LIFE
          });
        }
      }
    });
  }

  function handleDeleteJudicial(item) {
    if (!canManageBg) {
      return;
    }

    confirmDialog({
      message: 'Deseja excluir esta pendência judicial?',
      header: 'Confirmar exclusão',
      className: 'gestor-confirm-delete-dialog',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          const currentItems = Array.isArray(person?.judicialPendencies) ? person.judicialPendencies : [];
          const nextItems = currentItems.filter((judicialItem) => String(judicialItem._id) !== String(item._id));
          await persistJudicialPendencies(nextItems);
          toast.current?.show({
            severity: 'error',
            summary: 'Informação removida',
            detail: 'O registro foi removido.',
            life: TOAST_SUCCESS_LIFE
          });
        } catch (deleteError) {
          toast.current?.show({
            severity: 'error',
            summary: 'Falha ao excluir',
            detail: deleteError.message || 'Não foi possível excluir a pendência judicial.',
            life: TOAST_LIFE
          });
        }
      }
    });
  }

  const personalSubsections = [
    { key: 'banking', title: 'II - INFORMAÇÕES BANCÁRIAS' },
    { key: 'affiliation', title: 'III - FILIAÇÃO' },
    { key: 'peculio', title: 'IV - PECÚLIO' },
    { key: 'certidao', title: 'V - CERTIDÃO' },
    { key: 'military', title: 'VI - SITUAÇÃO MILITAR' },
    { key: 'dependents', title: 'DEPENDENTES' }
  ];

  const functionalSubsections = [
    { key: 'functional-data', title: 'I - DADOS FUNCIONAIS' },
    { key: 'functional-status', title: 'II - SITUAÇÕES FUNCIONAIS' },
    { key: 'institution', title: 'III - INCLUSÃO NA INSTITUIÇÃO' },
    { key: 'physical', title: 'IV - PARTICULARIDADES FÍSICAS' },
    { key: 'movements', title: 'V - MOVIMENTAÇÕES' },
    { key: 'jme', title: 'VI - COMPOSIÇÃO DE CONSELHO DE JUSTIÇA JUNTO À JME' },
    { key: 'medals', title: 'VII - CONDECORAÇÕES' },
    { key: 'service-displacement', title: 'VIII - DESLOCAMENTO EM SERVIÇO' },
    { key: 'licenses', title: 'IX - DISPENSAS E LICENÇAS' },
    { key: 'praises', title: 'X - ELOGIOS' },
    { key: 'benefits', title: 'XI - GRATIFICAÇÕES E INDENIZAÇÕES' },
    { key: 'qualifications', title: 'XII - QUALIFICAÇÕES PARA O CARGO POLICIAL MILITAR' },
    { key: 'hospitalization', title: 'XIII - INTERNAÇÕES HOSPITALARES' },
    { key: 'processes', title: 'XIV - PROCESSOS E PROCEDIMENTOS ADMINISTRATIVOS' },
    { key: 'promotion', title: 'XV - PROMOÇÃO' },
    { key: 'discipline', title: 'XVI - PUNIÇÕES DISCIPLINARES' },
    { key: 'service-time', title: 'XVII - TEMPO DE SERVIÇO' },
    { key: 'time-annotations', title: 'XVIII - AVERBAÇÕES DE TEMPO DE SERVIÇO' },
    { key: 'equipment', title: 'XIX - EQUIPAMENTO DE PROTEÇÃO INDIVIDUAL' },
    { key: 'other', title: 'XX - OUTRAS INFORMAÇÕES' },
    { key: 'judicial', title: 'XXI - PENDÊNCIAS JUDICIAIS' }
  ];

  return (
    <GestorPortalLayout>
      <Toast ref={toast} position="top-right" baseZIndex={bgDialogOpen ? 2600 : 1000} appendTo={bgDialogOpen ? document.body : 'self'} className={bgDialogOpen ? 'toast-elevated' : ''} />
      <ConfirmDialog />
      <section className="gestor-profile-page">
        <header className="gestor-profile-header">
          <h1>FICHA FUNCIONAL</h1>

          <div className="gestor-profile-actions">
            <Button
              type="button"
              label="Gerar PDF bloco"
              icon={<PdfIcon />}
              className="gestor-profile-pdf-button"
            />

            <Button
              type="button"
              label="Voltar"
              icon={<BackIcon />}
              className="gestor-profile-back-button"
              onClick={() => navigate('/consultar-pessoas')}
            />
          </div>

          <label className="gestor-profile-print-toggle">
            <input
              type="checkbox"
              checked={printAll}
              onChange={(event) => setPrintAll(event.target.checked)}
            />
            <span>Selecione para imprimir toda a Ficha</span>
          </label>
        </header>

        {error ? (
          <div className="gestor-profile-feedback is-error">{error}</div>
        ) : loading || !person ? (
          <div className="gestor-profile-feedback">Carregando ficha funcional...</div>
        ) : (
          <>
            <section className="gestor-profile-summary-card">
              <ProfileAvatar />

              <div className="gestor-profile-summary-grid">
                <div className="gestor-profile-summary-column">
                  <p><strong>Nome Completo:</strong> {person.fullName}</p>
                  <p><strong>CPF:</strong> {formatCpf(person.cpf)}</p>
                  <p><strong>RG/CIVIL:</strong> {person.civilRg}</p>
                  <p><strong>CNH:</strong> {person.cnh} <strong>Categoria:</strong> {person.cnhCategory} <strong>Validade:</strong> {person.cnhValidity}</p>
                  <p><strong>Cartão SUS:</strong> {person.susCard}</p>
                  <p><strong>Título de eleitor:</strong> {person.voterTitle} <strong>Zona:</strong> {person.voterZone} <strong>Seção:</strong> {person.voterSection}</p>
                  <p><strong>Data de nascimento:</strong> {person.birthDate}</p>
                  <p><strong>Naturalidade:</strong> {person.birthPlace}</p>
                  <p><strong>Nacionalidade:</strong> {person.nationality}</p>
                </div>

                <div className="gestor-profile-summary-column">
                  <p><strong>Estado civil:</strong> {person.civilStatus}</p>
                  <p><strong>Religião:</strong> {person.religion}</p>
                  <p><strong>Sexo:</strong> {person.sex}</p>
                  <p><strong>Cor/raça:</strong> {person.race}</p>
                  <p><strong>Escolaridade:</strong> {person.education}</p>
                  <p><strong>Habilidade Profissional:</strong> {person.professionalSkill}</p>
                  <p><strong>Habilidade esportiva:</strong> {person.sportSkill}</p>
                  <p><strong>Formação superior:</strong> {person.higherEducation}</p>
                  <p><strong>Plano de saúde:</strong> {person.healthPlan}</p>
                  <p><strong>Sub judice:</strong> {person.subJudice}</p>
                </div>
              </div>
            </section>

            <section className="gestor-profile-sections">
                <article className={`gestor-profile-section ${sectionsOpen.personal ? 'is-open' : ''}`}>
                  <button type="button" className="gestor-profile-section-header" onClick={() => toggleSection('personal')}>
                    <ChevronIcon open={sectionsOpen.personal} />
                    <span>I - INFORMAÇÕES PESSOAIS</span>
                  </button>

                {sectionsOpen.personal && (
                  <div className="gestor-profile-section-body gestor-profile-section-body-nested">
                    {personalSubsections.map((section) => (
                      <article key={section.key} className="gestor-profile-subsection is-mock">
                        <div className="gestor-profile-subsection-header is-mock">
                          <ChevronIcon open={false} />
                          <span>{section.title}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </article>

                <article className={`gestor-profile-section ${sectionsOpen.functional ? 'is-open' : ''}`}>
                  <button type="button" className="gestor-profile-section-header" onClick={() => toggleSection('functional')}>
                    <ChevronIcon open={sectionsOpen.functional} />
                    <span>INFORMAÇÕES FUNCIONAIS</span>
                  </button>

                  {sectionsOpen.functional && (
                  <div className="gestor-profile-section-body gestor-profile-section-body-nested">
                      {functionalSubsections.map((section) => {
                        if (section.key !== 'other' && section.key !== 'judicial') {
                          return (
                            <article key={section.key} className="gestor-profile-subsection is-mock">
                              <div className="gestor-profile-subsection-header is-mock">
                                <ChevronIcon open={false} />
                                <span>{section.title}</span>
                              </div>
                            </article>
                          );
                        }

                        if (section.key === 'other') {
                          const isOpen = functionalPanelsOpen.other;

                          return (
                            <article key={section.key} className={`gestor-profile-subsection gestor-profile-subsection-toggle ${isOpen ? 'is-open' : ''}`}>
                              <button
                                type="button"
                                className="gestor-profile-subsection-header gestor-profile-subsection-button"
                                onClick={() => toggleFunctionalPanel('other')}
                              >
                                <ChevronIcon open={isOpen} />
                                <span>{section.title}</span>
                              </button>

                              {isOpen && (
                                <div className="gestor-profile-subsection-body">
                                  <div className="gestor-bg-mini-crud">
                                    <div className="gestor-bg-toolbar">
                                      <div className="gestor-bg-search-shell">
                                        <InputText
                                          ref={bgSearchInputRef}
                                          value={bgSearch}
                                          onChange={(event) => setBgSearch(event.target.value)}
                                          className="gestor-bg-search-input"
                                          placeholder="Consulte por nome"
                                        />
                                        <button
                                          type="button"
                                          className="gestor-bg-search-button"
                                          onClick={() => bgSearchInputRef.current?.focus()}
                                          aria-label="Pesquisar publicação"
                                        >
                                          <SearchIcon />
                                        </button>
                                      </div>
                                      {canManageBg && (
                                        <Button
                                          type="button"
                                          label="Adicionar"
                                          icon={<AddIcon />}
                                          className="gestor-bg-add-button"
                                          onClick={openCreateBg}
                                        />
                                      )}
                                  </div>

                                  {filteredBgPublications.length > 0 ? (
                                    <div className="gestor-bg-list">
                                      {filteredBgPublications.map((item) => (
                                        <article key={item._id} className="gestor-bg-card">
                                          <div className="gestor-bg-card-copy">
                                            <div className="gestor-bg-card-top">
                                              <div className="gestor-bg-meta">
                                                <strong>DATA:</strong>
                                                <span>{item.date}</span>
                                              </div>
                                            </div>

                                            <div className="gestor-bg-card-publication">
                                              <strong>PUBLICAÇÃO:</strong>
                                              <p>{item.publication}</p>
                                            </div>
                                          </div>

                                          <div className="gestor-bg-card-actions">
                                            {canManageBg ? (
                                              <>
                                                <Button
                                                  type="button"
                                                  label="Editar"
                                                  icon={<EditIcon />}
                                                  className="gestor-bg-card-button gestor-bg-card-button-edit"
                                                  onClick={() => openEditBg(item)}
                                                />

                                                <Button
                                                  type="button"
                                                  label="Excluir"
                                                  icon={<DeleteIcon />}
                                                  className="gestor-bg-card-button gestor-bg-card-button-delete"
                                                  onClick={() => handleDeleteBg(item)}
                                                />
                                              </>
                                            ) : (
                                              <Button
                                                type="button"
                                                label="Visualizar"
                                                icon={<ViewIcon />}
                                                className="gestor-bg-card-button gestor-bg-card-button-view"
                                                onClick={() => openViewBg(item)}
                                              />
                                            )}
                                          </div>
                                        </article>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="gestor-bg-empty">
                                      {bgSearch.trim()
                                        ? 'Nenhuma publicação encontrada para a busca informada.'
                                        : 'Nenhuma publicação de BG cadastrada para este perfil.'}
                                    </div>
                                  )}
                                </div>
                                </div>
                              )}
                            </article>
                          );
                        }

                        const isOpen = functionalPanelsOpen.judicial;

                        return (
                          <article key={section.key} className={`gestor-profile-subsection gestor-profile-subsection-toggle ${isOpen ? 'is-open' : ''}`}>
                            <button
                              type="button"
                              className="gestor-profile-subsection-header gestor-profile-subsection-button"
                              onClick={() => toggleFunctionalPanel('judicial')}
                            >
                              <ChevronIcon open={isOpen} />
                              <span>{section.title}</span>
                            </button>

                            {isOpen && (
                              <div className="gestor-profile-subsection-body">
                                <div className="gestor-bg-mini-crud">
                                  <div className="gestor-bg-toolbar">
                                    <div className="gestor-bg-search-shell">
                                      <InputText
                                        ref={judicialSearchInputRef}
                                        value={judicialSearch}
                                        onChange={(event) => setJudicialSearch(event.target.value)}
                                        className="gestor-bg-search-input"
                                        placeholder="Consulte por pendência"
                                      />
                                      <button
                                        type="button"
                                        className="gestor-bg-search-button"
                                        onClick={() => judicialSearchInputRef.current?.focus()}
                                        aria-label="Pesquisar pendência judicial"
                                      >
                                        <SearchIcon />
                                      </button>
                                    </div>
                                    {canManageBg && (
                                      <Button
                                        type="button"
                                        label="Adicionar"
                                        icon={<AddIcon />}
                                        className="gestor-bg-add-button"
                                        onClick={openCreateJudicial}
                                      />
                                    )}
                                  </div>

                                  {filteredJudicialPendencies.length > 0 ? (
                                    <div className="gestor-bg-list">
                                      {filteredJudicialPendencies.map((item) => (
                                        <article key={item._id} className="gestor-bg-card">
                                          <div className="gestor-bg-card-copy">
                                            <div className="gestor-bg-card-top">
                                              <div className="gestor-bg-meta">
                                                <strong>DATA:</strong>
                                                <span>{item.date}</span>
                                              </div>
                                            </div>

                                            <div className="gestor-bg-card-publication">
                                              <strong>PENDÊNCIA JUDICIAL:</strong>
                                              <p>{item.description}</p>
                                            </div>
                                          </div>

                                          <div className="gestor-bg-card-actions">
                                            {canManageBg ? (
                                              <>
                                                <Button
                                                  type="button"
                                                  label="Editar"
                                                  icon={<EditIcon />}
                                                  className="gestor-bg-card-button gestor-bg-card-button-edit"
                                                  onClick={() => openEditJudicial(item)}
                                                />

                                                <Button
                                                  type="button"
                                                  label="Excluir"
                                                  icon={<DeleteIcon />}
                                                  className="gestor-bg-card-button gestor-bg-card-button-delete"
                                                  onClick={() => handleDeleteJudicial(item)}
                                                />
                                              </>
                                            ) : (
                                              <Button
                                                type="button"
                                                label="Visualizar"
                                                icon={<ViewIcon />}
                                                className="gestor-bg-card-button gestor-bg-card-button-view"
                                                onClick={() => openViewJudicial(item)}
                                              />
                                            )}
                                          </div>
                                        </article>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="gestor-bg-empty">
                                      {judicialSearch.trim()
                                        ? 'Nenhuma pendência encontrada para a busca informada.'
                                        : 'Nenhuma pendência judicial cadastrada para este perfil.'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </article>
            </section>

            <div className="gestor-profile-footnote">Gestor.Web v1.3.83 (c) PMPA - DITEL</div>
          </>
        )}
      </section>

      <Dialog
        visible={bgDialogOpen}
        onHide={closeBgDialog}
        header={bgDialogTitle}
        className="gestor-bg-dialog"
        draggable={false}
        resizable={false}
        modal
      >
        <div className="gestor-bg-dialog-body">
          <div>
            <label htmlFor="bg-date">Data</label>
            <Calendar
                id="bg-date"
                value={parseBrazilianDateToDate(bgForm.date)}
                onChange={(event) => setBgForm((current) => ({ ...current, date: formatDateToBrazilian(event.value) }))}
                disabled={isBgDialogReadOnly || bgSaving}
                dateFormat="dd/mm/yy"
                showIcon
                iconDisplay="input"
                showButtonBar={false}
                placeholder="Selecione a data"
                className="gestor-bg-date-calendar"
              />
            </div>

            <div>
              <label htmlFor="bg-publication">Publicação</label>
              <InputTextarea
              id="bg-publication"
              value={bgForm.publication}
              onChange={(event) => setBgForm((current) => ({ ...current, publication: event.target.value }))}
              disabled={isBgDialogReadOnly || bgSaving}
              rows={6}
              autoResize={false}
              placeholder="Descreva a publicação do BG"
            />
          </div>

          <div className="gestor-bg-dialog-actions">
            <Button
              type="button"
              label={isBgDialogReadOnly ? 'Fechar' : 'Cancelar'}
              className="p-button-text"
              onClick={closeBgDialog}
              disabled={bgSaving}
            />

            {!isBgDialogReadOnly && (
              <Button
                type="button"
                label={bgDialogMode === 'edit' ? 'Editar' : 'Adicionar'}
                onClick={handleSaveBg}
                loading={bgSaving}
              />
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={judicialDialogOpen}
        onHide={closeJudicialDialog}
        header={judicialDialogTitle}
        className="gestor-bg-dialog"
        draggable={false}
        resizable={false}
        modal
      >
        <div className="gestor-bg-dialog-body">
          <div>
            <label htmlFor="judicial-date">Data</label>
            <Calendar
              id="judicial-date"
              value={parseBrazilianDateToDate(judicialForm.date)}
              onChange={(event) => setJudicialForm((current) => ({ ...current, date: formatDateToBrazilian(event.value) }))}
              disabled={isJudicialDialogReadOnly || judicialSaving}
              dateFormat="dd/mm/yy"
              showIcon
              iconDisplay="input"
              showButtonBar={false}
              placeholder="Selecione a data"
              className="gestor-bg-date-calendar"
            />
          </div>

          <div>
            <label htmlFor="judicial-description">Pendência judicial</label>
            <InputTextarea
              id="judicial-description"
              value={judicialForm.description}
              onChange={(event) => setJudicialForm((current) => ({ ...current, description: event.target.value }))}
              disabled={isJudicialDialogReadOnly || judicialSaving}
              rows={6}
              autoResize={false}
              placeholder="Descreva a pendência judicial"
            />
          </div>

          <div className="gestor-bg-dialog-actions">
            <Button
              type="button"
              label={isJudicialDialogReadOnly ? 'Fechar' : 'Cancelar'}
              className="p-button-text"
              onClick={closeJudicialDialog}
              disabled={judicialSaving}
            />

            {!isJudicialDialogReadOnly && (
              <Button
                type="button"
                label={judicialDialogMode === 'edit' ? 'Editar' : 'Adicionar'}
                onClick={handleSaveJudicial}
                loading={judicialSaving}
              />
            )}
          </div>
        </div>
      </Dialog>
    </GestorPortalLayout>
  );
}

