import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';
import { normalizeCpf } from '../utils/cpf.js';

dotenv.config();

function buildMockBgPublications(cpf) {
  switch (normalizeCpf(cpf)) {
    case '12345678901':
      return [
        {
          date: '25/10/2001',
          bulletin: 'BG n 199/01',
          publication: 'APRESENTACAO para reforco operacional no municipio de Ferro/PA durante o segundo turno das eleicoes.'
        },
        {
          date: '19/03/2004',
          bulletin: 'BG n 044/04',
          publication: 'EXAME DE INSPECAO DE SAUDE com comparecimento na Formacao Sanitaria do 3 BPM, conforme escala publicada.'
        },
        {
          date: '06/02/2006',
          bulletin: 'BG n 026/06',
          publication: 'PORTARIA de sindicancia com designacao para acompanhamento administrativo e entrega de relatorio.'
        }
      ];
    case '12345678902':
      return [
        {
          date: '12/05/2008',
          bulletin: 'BG n 088/08',
          publication: 'ELOGIO INDIVIDUAL pela coordenacao de equipe tecnica na implantacao de enlace de dados entre unidades.'
        },
        {
          date: '03/11/2011',
          bulletin: 'BG n 201/11',
          publication: 'DESLOCAMENTO EM SERVICO para vistoria de infraestrutura de telecomunicacoes em unidades do interior.'
        }
      ];
    case '12345678903':
      return [
        {
          date: '18/08/2014',
          bulletin: 'BG n 151/14',
          publication: 'MOVIMENTACAO interna para chefia da Secao de Administracao Tecnologica da DITEL.'
        },
        {
          date: '27/02/2018',
          bulletin: 'BG n 041/18',
          publication: 'QUALIFICACAO concluida em gestao de redes, seguranca perimetral e resposta a incidentes.'
        }
      ];
    case '12345678904':
      return [
        {
          date: '09/09/2019',
          bulletin: 'BG n 173/19',
          publication: 'DESIGNACAO para coordenacao do Centro de Monitoramento da DITEL em escala extraordinaria.'
        },
        {
          date: '14/04/2022',
          bulletin: 'BG n 069/22',
          publication: 'ELOGIO pela atuacao em integracao de imagens e acompanhamento operacional em grande evento.'
        }
      ];
    default:
      return [];
  }
}

function buildMockJudicialPendencies(cpf) {
  switch (normalizeCpf(cpf)) {
    case '12345678901':
      return [
        {
          date: '14/02/2024',
          description: 'Manifestacao encaminhada a assessoria juridica sobre acompanhamento de processo administrativo disciplinar ja encerrado.'
        }
      ];
    case '12345678902':
      return [
        {
          date: '03/09/2023',
          description: 'Registro de comparecimento para prestacao de esclarecimentos em procedimento judicial sem pendencias ativas.'
        }
      ];
    case '12345678903':
      return [
        {
          date: '19/06/2022',
          description: 'Anotacao de acompanhamento de oficio judicial para apresentacao de documentos funcionais junto a unidade competente.'
        }
      ];
    case '12345678904':
      return [
        {
          date: '28/11/2021',
          description: 'Controle interno de resposta a requisicao judicial referente a relatorio tecnico de operacao concluida.'
        }
      ];
    default:
      return [];
  }
}

const seededUsers = [
  {
    name: process.env.SUPER_NAME || 'Dev PMPA',
    cpf: process.env.SUPER_CPF || '00000000001',
    email: process.env.SUPER_EMAIL || 'super@gestor-pmpa.local',
    password: process.env.SUPER_PASSWORD || 'super123',
    displayName: 'CEL QOPM RG 20001 ALVARO MENDES DO NASCIMENTO',
    fullName: 'ALVARO MENDES DO NASCIMENTO',
    warName: 'MENDES',
    registration: '20001',
    rank: 'CEL QOPM',
    unitPlacement: 'DITEL',
    activityUnit: 'DITEL',
    duty: 'COORDENADOR DO NUCLEO DE DESENVOLVIMENTO DA DITEL',
    status: 'PRONTO PARA EXERCICIO DAS ATRIBUICOES',
    phone: '(91) 98410-2001',
    civilRg: '5823001',
    cnh: '00192000001',
    cnhCategory: 'B',
    cnhValidity: '10/06/2031',
    susCard: '700 1000 2000 3001',
    voterTitle: '0369 1111 2001',
    voterZone: '001',
    voterSection: '0101',
    birthDate: '18/07/1974',
    birthPlace: 'BELEM-PA',
    nationality: 'BRASILEIRO',
    civilStatus: 'CASADO',
    religion: 'CATOLICO',
    sex: 'M',
    race: 'PARDA',
    education: 'ENSINO SUPERIOR COMPLETO',
    professionalSkill: 'GESTAO DE TECNOLOGIA',
    sportSkill: 'CORRIDA',
    higherEducation: 'SISTEMAS DE INFORMACAO',
    healthPlan: 'IASEP',
    subJudice: 'NAO',
    role: 'super',
    active: true
  },
  {
    name: 'Capitao Responsavel',
    cpf: '12345678901',
    email: 'adm@gestor-pmpa.local',
    password: 'adm123',
    displayName: 'CEL QOPM RG 27311 DANIEL PEREIRA MONTEIRO',
    fullName: 'DANIEL PEREIRA MONTEIRO',
    warName: 'MONTEIRO',
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
    subJudice: 'NAO',
    role: 'adm',
    active: true
  },
  {
    name: 'Operador Alfa',
    cpf: '12345678902',
    email: 'alfa@gestor-pmpa.local',
    password: 'user123',
    displayName: 'TEN CEL QOPM RG 33433 MARCOS VINICIUS BARBOSA LEAL',
    fullName: 'MARCOS VINICIUS BARBOSA LEAL',
    warName: 'BARBOSA',
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
    subJudice: 'NAO',
    role: 'user',
    active: true
  },
  {
    name: 'Operador Bravo',
    cpf: '12345678903',
    email: 'bravo@gestor-pmpa.local',
    password: 'user123',
    displayName: 'MAJ QOPM RG 35492 ROBERTO CESAR FARIAS COSTA',
    fullName: 'ROBERTO CESAR FARIAS COSTA',
    warName: 'FARIAS',
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
    subJudice: 'NAO',
    role: 'user',
    active: true
  },
  {
    name: 'Operador Charlie',
    cpf: '12345678904',
    email: 'charlie@gestor-pmpa.local',
    password: 'user123',
    displayName: 'CAP QOPM RG 38107 LEONARDO SOUSA FERNANDES',
    fullName: 'LEONARDO SOUSA FERNANDES',
    warName: 'FERNANDES',
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
    subJudice: 'NAO',
    role: 'user',
    active: true
  }
];

const seededClients = [
  {
    name: '1 BPM - Centro',
    email: '1bpm@pmpa.local',
    phone: '(91) 98888-1101',
    document: '000.000.000-01',
    active: true
  },
  {
    name: '2 BPM - Sacramenta',
    email: '2bpm@pmpa.local',
    phone: '(91) 98888-1102',
    document: '000.000.000-02',
    active: true
  },
  {
    name: '3 BPM - Icoaraci',
    email: '3bpm@pmpa.local',
    phone: '(91) 98888-1103',
    document: '000.000.000-03',
    active: false
  }
];

const seededProducts = [
  {
    name: 'Patrulha de rotina',
    id: 'REG-001',
    description: 'Registro operacional de rotina do turno da manha',
    price: 1,
    stock: 3,
    active: true
  },
  {
    name: 'Apoio tatico',
    id: 'REG-002',
    description: 'Atendimento a ocorrencia com deslocamento de apoio',
    price: 1,
    stock: 2,
    active: true
  },
  {
    name: 'Fiscalizacao especial',
    id: 'REG-003',
    description: 'Acao preventiva em area de grande circulacao',
    price: 1,
    stock: 1,
    active: true
  }
];

async function upsertUsers() {
  for (const item of seededUsers) {
    const passwordHash = await bcrypt.hash(item.password, 10);
    const cpf = normalizeCpf(item.cpf);
    const email = String(item.email).trim().toLowerCase();

    await User.findOneAndUpdate(
      {
        $or: [{ cpf }, { email }]
      },
      {
        name: item.name,
        cpf,
        email,
        passwordHash,
        displayName: item.displayName,
        fullName: item.fullName,
        warName: item.warName,
        registration: item.registration,
        rank: item.rank,
        unitPlacement: item.unitPlacement,
        activityUnit: item.activityUnit,
        duty: item.duty,
        status: item.status,
        phone: item.phone,
        civilRg: item.civilRg,
        cnh: item.cnh,
        cnhCategory: item.cnhCategory,
        cnhValidity: item.cnhValidity,
        susCard: item.susCard,
        voterTitle: item.voterTitle,
        voterZone: item.voterZone,
        voterSection: item.voterSection,
        birthDate: item.birthDate,
        birthPlace: item.birthPlace,
        nationality: item.nationality,
        civilStatus: item.civilStatus,
        religion: item.religion,
        sex: item.sex,
        race: item.race,
        education: item.education,
        professionalSkill: item.professionalSkill,
        sportSkill: item.sportSkill,
        higherEducation: item.higherEducation,
        healthPlan: item.healthPlan,
        subJudice: item.subJudice,
        bgPublications: buildMockBgPublications(cpf),
        judicialPendencies: buildMockJudicialPendencies(cpf),
        role: item.role,
        active: item.active
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  }
}

async function upsertClients() {
  for (const item of seededClients) {
    await Client.findOneAndUpdate(
      { email: item.email },
      item,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  }
}

async function upsertProducts() {
  for (const item of seededProducts) {
    await Product.findOneAndUpdate(
      { id: item.id },
      item,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  }
}

async function seed() {
  await connectDB();
  await upsertUsers();
  await upsertClients();
  await upsertProducts();

  console.log('Mock data synchronized');
  process.exit(0);
}

seed();
