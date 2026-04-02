import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import { normalizeCpf } from '../utils/cpf.js';

dotenv.config();

async function seed() {
  await connectDB();

  const name = process.env.SUPER_NAME || 'Dev PMPA';
  const cpf = normalizeCpf(process.env.SUPER_CPF || '00000000001');
  const email = String(process.env.SUPER_EMAIL ?? 'super@gestor-pmpa.local').trim().toLowerCase();
  const passwordHash = await bcrypt.hash(process.env.SUPER_PASSWORD || 'super123', 10);

  const exists = await User.findOne({
    $or: [{ cpf }, { email }]
  });

  if (exists) {
    exists.name = name;
    exists.cpf = cpf;
    exists.email = email;
    exists.passwordHash = passwordHash;
    exists.role = 'super';
    exists.active = true;
    await exists.save();

    console.log('Super user synchronized');
    process.exit(0);
  }

  await User.create({
    name,
    cpf,
    email,
    passwordHash,
    role: 'super',
    active: true
  });

  console.log('Super user created');
  process.exit(0);
}

seed();
