const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...options
    });
  } catch (error) {
    throw new Error('Nao foi possivel conectar ao servidor. Verifique se o backend esta online e se o acesso do site foi liberado no CORS.');
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { message: 'Resposta invalida do servidor.' };

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisicao');
  }

  return data;
}
