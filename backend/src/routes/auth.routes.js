import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isValidCpfFormat, normalizeCpf } from '../utils/cpf.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { cpf, password } = req.body;
    const normalizedCpf = normalizeCpf(cpf);

    if (!isValidCpfFormat(normalizedCpf)) {
      return res.status(400).json({ message: 'Informe um CPF valido' });
    }

    const user = await User.findOne({ cpf: normalizedCpf });
    if (!user) {
      return res.status(401).json({ message: 'CPF ou senha invalidos' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'Seu acesso esta desativado. Fale com um administrador.' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'CPF ou senha invalidos' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no login', error: error.message });
  }
});

export default router;
