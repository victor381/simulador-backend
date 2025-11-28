# Dockerfile para Backend - Simulador de Reforma Tributária
# Otimizado para deploy no Render

FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    dumb-init

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY package-lock.json* ./

# Instalar dependências de produção
# Usa npm ci se package-lock.json existir, caso contrário usa npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi && \
    npm cache clean --force

# Copiar código da aplicação
COPY . .

# Criar usuário não-root para segurança
# Nota: No Alpine, o usuário node já existe, então usamos ele
RUN chown -R node:node /app
USER node

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init para gerenciar processos
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicialização
CMD ["node", "index.js"]
