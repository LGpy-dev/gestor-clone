import mongoose from 'mongoose';
import { normalizeCpf } from '../utils/cpf.js';

const bgPublicationSchema = new mongoose.Schema(
    {
        date: { type: String, trim: true, default: '' },
        bulletin: { type: String, trim: true, default: '' },
        publication: { type: String, trim: true, default: '' }
    },
    { _id: true }
);

const judicialPendencySchema = new mongoose.Schema(
    {
        date: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' }
    },
    { _id: true }
);

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
        displayName: { type: String, trim: true, default: '' },
        fullName: { type: String, trim: true, default: '' },
        warName: { type: String, trim: true, default: '' },
        registration: { type: String, trim: true, default: '' },
        rank: { type: String, trim: true, default: '' },
        unitPlacement: { type: String, trim: true, default: '' },
        activityUnit: { type: String, trim: true, default: '' },
        duty: { type: String, trim: true, default: '' },
        status: { type: String, trim: true, default: '' },
        phone: { type: String, trim: true, default: '' },
        civilRg: { type: String, trim: true, default: '' },
        cnh: { type: String, trim: true, default: '' },
        cnhCategory: { type: String, trim: true, default: '' },
        cnhValidity: { type: String, trim: true, default: '' },
        susCard: { type: String, trim: true, default: '' },
        voterTitle: { type: String, trim: true, default: '' },
        voterZone: { type: String, trim: true, default: '' },
        voterSection: { type: String, trim: true, default: '' },
        birthDate: { type: String, trim: true, default: '' },
        birthPlace: { type: String, trim: true, default: '' },
        nationality: { type: String, trim: true, default: '' },
        civilStatus: { type: String, trim: true, default: '' },
        religion: { type: String, trim: true, default: '' },
        sex: { type: String, trim: true, default: '' },
        race: { type: String, trim: true, default: '' },
        education: { type: String, trim: true, default: '' },
        professionalSkill: { type: String, trim: true, default: '' },
        sportSkill: { type: String, trim: true, default: '' },
        higherEducation: { type: String, trim: true, default: '' },
        healthPlan: { type: String, trim: true, default: '' },
        subJudice: { type: String, trim: true, default: '' },
        bgPublications: { type: [bgPublicationSchema], default: [] },
        judicialPendencies: { type: [judicialPendencySchema], default: [] },
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
