# Configuração do Vercel

## Problema: Erro 404 nas rotas

O erro 404 ocorre porque o Vercel precisa saber que este é um projeto SPA (Single Page Application) e deve redirecionar todas as rotas para `index.html`.

## Solução

O arquivo `vercel.json` já está configurado corretamente. Verifique as seguintes configurações no painel do Vercel:

### 1. Root Directory

No painel do Vercel, vá em **Settings > General** e configure:
- **Root Directory**: `amil-milo`

Isso garante que o Vercel faça o build apenas do frontend, não do backend.

### 2. Build & Development Settings

Em **Settings > General**, verifique:
- **Framework Preset**: `Vite` (ou deixe em "Other")
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables

Em **Settings > Environment Variables**, adicione:
- `VITE_API_URL`: URL do seu backend (ex: `https://seu-backend.onrender.com`)

### 4. Deploy

Após configurar, faça um novo deploy. O `vercel.json` irá:
- Redirecionar todas as rotas para `/index.html`
- Permitir que o React Router gerencie o roteamento no cliente

## Verificação

Após o deploy, acesse:
- `https://amil-milo.vercel.app/login` - deve funcionar
- `https://amil-milo.vercel.app/cadastro` - deve funcionar
- `https://amil-milo.vercel.app/` - deve funcionar

Todas as rotas devem retornar o `index.html` e o React Router irá renderizar o componente correto.

