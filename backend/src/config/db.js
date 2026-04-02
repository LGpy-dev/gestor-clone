import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI nao foi definida. Crie o arquivo backend/.env com sua conexao do MongoDB.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB conectado com sucesso');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  }
}
