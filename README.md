# Gestor Web PMPA

Base mockada inspirada no Gestor Web da PMPA, com frontend em React + Vite + PrimeReact e backend em Node + Express + MongoDB.

## Perfis iniciais

- `super`: conta invisivel do dev
- `adm`: perfil administrativo
- `user`: tres perfis de visualizacao

## Rodando localmente

### Frontend

Na raiz do projeto:

```powershell
npm.cmd install
npm.cmd run dev
```

Se o frontend for rodar local com backend local, use `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

Na pasta `backend`:

```powershell
cd backend
npm.cmd install
npm.cmd run dev
```

Crie `backend/.env` a partir de `backend/.env.example`.

## Seed inicial

Para sincronizar o super user:

```powershell
cd backend
npm.cmd run seed:super
```

Para carregar os dados mockados do projeto:

```powershell
cd backend
npm.cmd run seed:mock
```

## Logins mockados

- `super`: `000.000.000-01` / `super123`
- `adm`: `123.456.789-01` / `adm123`
- `user`: `123.456.789-02` / `user123`
- `user`: `123.456.789-03` / `user123`
- `user`: `123.456.789-04` / `user123`

## Variaveis importantes do backend

- `MONGODB_URI`
- `JWT_SECRET`
- `SUPER_NAME`
- `SUPER_CPF`
- `SUPER_EMAIL`
- `SUPER_PASSWORD`
- `CORS_ORIGIN`

## Render

O backend ja esta preparado para o Render com o arquivo `render.yaml`.

Variaveis esperadas:

- `MONGODB_URI`
- `JWT_SECRET`
- `SUPER_PASSWORD`
- `CORS_ORIGIN`

Valores base:

```env
SUPER_NAME=Dev PMPA
SUPER_CPF=00000000001
SUPER_EMAIL=super@gestor-pmpa.local
```

Para testar frontend local com backend no Render:

```env
VITE_API_URL=https://seu-backend.onrender.com/api
```

E no Render:

```env
CORS_ORIGIN=http://localhost:5173,https://*.vercel.app,https://seu-projeto.vercel.app
```

## Vercel

O frontend ja esta preparado para a Vercel:

- `vite.config.js` usa `frontend` como raiz
- `vercel.json` define build e rewrite para o React Router

Ao criar o projeto na Vercel:

- Root Directory: raiz do projeto
- Build Command: `npm run build`
- Output Directory: `dist`

Variavel de ambiente do frontend:

```env
VITE_API_URL=https://seu-backend.onrender.com/api
```
