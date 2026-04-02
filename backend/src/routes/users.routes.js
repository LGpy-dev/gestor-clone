import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { auth, permit } from '../middleware/auth.js';
import { isValidCpfFormat, normalizeCpf } from '../utils/cpf.js';

const router = Router();
const emailRegex = /^[^\s@]+@([^\s@.]+\.)+[A-Za-z]{2,}$/;

function isValidEmail(value) {
  return emailRegex.test(String(value ?? '').trim());
}

router.get('/', auth, permit('super', 'adm', 'user'), async (req, res) => {
  const query = req.user.role === 'user'
    ? { _id: req.user.id, role: { $ne: 'super' } }
    : { role: { $ne: 'super' } };

  const users = await User.find(query)
    .select('-passwordHash')
    .sort({ createdAt: -1 });

  res.json(users);
});

router.post('/', auth, permit('super', 'adm'), async (req, res) => {
  try {
    const { name, cpf, email, password, role } = req.body;
    const normalizedCpf = normalizeCpf(cpf);
    const normalizedEmail = String(email ?? '').trim().toLowerCase();

    if (!isValidCpfFormat(normalizedCpf)) {
      return res.status(400).json({ message: 'Informe um CPF valido' });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Informe um e-mail valido' });
    }

    if (role === 'super') {
      return res.status(403).json({ message: 'Nao e permitido criar usuarios super pelo CRUD' });
    }

    const exists = await User.findOne({
      $or: [{ cpf: normalizedCpf }, { email: normalizedEmail }]
    });

    if (exists) {
      return res.status(400).json({ message: 'Ja existe um usuario com este CPF ou e-mail' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      cpf: normalizedCpf,
      email: normalizedEmail,
      passwordHash,
      role
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      role: user.role,
      active: user.active
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuario', error: error.message });
  }
});

router.put('/:id', auth, permit('super', 'adm'), async (req, res) => {
  try {
    const { name, cpf, email, role, active, password } = req.body;
    const normalizedCpf = normalizeCpf(cpf);
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'Usuario nao encontrado' });
    }

    if (targetUser.role === 'super') {
      return res.status(403).json({ message: 'Usuario super nao pode ser alterado pelo CRUD' });
    }

    if (role === 'super') {
      return res.status(403).json({ message: 'Nao e permitido promover usuarios para super pelo CRUD' });
    }

    if (!isValidCpfFormat(normalizedCpf)) {
      return res.status(400).json({ message: 'Informe um CPF valido' });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Informe um e-mail valido' });
    }

    const conflict = await User.findOne({
      _id: { $ne: req.params.id },
      $or: [{ cpf: normalizedCpf }, { email: normalizedEmail }]
    });

    if (conflict) {
      return res.status(400).json({ message: 'Ja existe um usuario com este CPF ou e-mail' });
    }

    const data = {
      name,
      cpf: normalizedCpf,
      email: normalizedEmail,
      role,
      active
    };

    if (password) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true })
      .select('-passwordHash');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuario', error: error.message });
  }
});

router.delete('/:id', auth, permit('super', 'adm'), async (req, res) => {
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) {
    return res.status(404).json({ message: 'Usuario nao encontrado' });
  }

  if (targetUser.role === 'super') {
    return res.status(403).json({ message: 'Usuario super nao pode ser removido pelo CRUD' });
  }

  if (targetUser.active !== false) {
    return res.status(400).json({ message: 'So e possivel excluir usuarios com o acesso desativado' });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Usuario removido' });
});

export default router;
