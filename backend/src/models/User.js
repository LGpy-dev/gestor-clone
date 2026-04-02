import mongoose from 'mongoose';
import { normalizeCpf } from '../utils/cpf.js';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        cpf: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            set: (value) => normalizeCpf(value)
        },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true},
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ['super', 'adm', 'user'],
            required: true,
            default: 'user'
        },
        active: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema);
