const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const SESSION_EXPIRED_MESSAGE = 'Sua sessão expirou. Faça login novamente.';

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
  let data;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const rawText = await response.text();
    const text = rawText.trim();

    if (response.status === 404) {
      data = { message: 'A rota solicitada nao foi encontrada no backend. Verifique se a API publicada foi atualizada.' };
    } else if (response.status >= 500) {
      data = { message: 'O backend retornou uma resposta invalida ao processar a solicitacao.' };
    } else if (text) {
      data = { message: text.slice(0, 220) };
    } else {
      data = { message: 'Resposta invalida do servidor.' };
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token && path !== '/auth/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth-expired-message', SESSION_EXPIRED_MESSAGE);
        window.dispatchEvent(new Event('auth:expired'));
      }

      throw new Error(SESSION_EXPIRED_MESSAGE);
    }

    throw new Error(data.message || 'Erro na requisicao');
  }

  return data;
}
