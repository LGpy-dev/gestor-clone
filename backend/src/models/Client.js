import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, default:'', trim: true, lowercase: true },
        phone: { type: String, default:''},
        document: { type: String, default:''},
        active: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model('Client', clientSchema);