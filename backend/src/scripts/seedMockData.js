import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';
import { normalizeCpf } from '../utils/cpf.js';

dotenv.config();

const seededUsers = [
  {
    name: process.env.SUPER_NAME || 'Dev PMPA',
    cpf: process.env.SUPER_CPF || '00000000001',
    email: process.env.SUPER_EMAIL || 'super@gestor-pmpa.local',
    password: process.env.SUPER_PASSWORD || 'super123',
    role: 'super',
    active: true
  },
  {
    name: 'Capitao Responsavel',
    cpf: '12345678901',
    email: 'adm@gestor-pmpa.local',
    password: 'adm123',
    role: 'adm',
    active: true
  },
  {
    name: 'Operador Alfa',
    cpf: '12345678902',
    email: 'alfa@gestor-pmpa.local',
    password: 'user123',
    role: 'user',
    active: true
  },
  {
    name: 'Operador Bravo',
    cpf: '12345678903',
    email: 'bravo@gestor-pmpa.local',
    password: 'user123',
    role: 'user',
    active: true
  },
  {
    name: 'Operador Charlie',
    cpf: '12345678904',
    email: 'charlie@gestor-pmpa.local',
    password: 'user123',
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
