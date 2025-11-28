# Simulador de Reforma Tributária - Backend

API backend para o Simulador de Reforma Tributária brasileira.

## 🚀 Tecnologias

- Node.js 18+
- Express
- Axios (para integração com BrasilAPI)

## 📋 Pré-requisitos

- Node.js 18+ ou Docker
- npm ou yarn

## 🛠️ Instalação

### Local (sem Docker)

```bash
npm install
```

### Docker

```bash
docker build -t simulador-backend .
docker run -p 3001:3001 simulador-backend
```

## 🏃 Executar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

## 📡 Endpoints

### Health Check
```
GET /health
```

### Buscar CNPJ
```
GET /api/cnpj/:cnpj
```

### Simular Cenário Fiscal
```
POST /api/simular
Body: {
  cnpj: string,
  dadosEmpresa: object,
  faturamentoAnual: number,
  despesasAnuais: number,
  regimeAtual: string,
  anoInicio: number,
  anoFim: number
}
```

## 🌐 Deploy

### Render (Recomendado)

1. Conecte este repositório no Render
2. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `NODE_ENV=production`

### Render com Docker

1. Conecte este repositório no Render
2. Configure:
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.`

### Variáveis de Ambiente

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=*
```

## 📦 Estrutura

```
server/
├── index.js              # Servidor Express
├── services/
│   ├── calculadora.js    # Lógica de cálculo fiscal
│   └── brasilapi.js      # Integração com BrasilAPI
├── package.json
└── Dockerfile
```

## 🔧 Desenvolvimento

O servidor roda na porta 3001 por padrão. Para desenvolvimento local, use:

```bash
npm run dev
```

## 📝 Licença

MIT

