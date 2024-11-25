# Fase de construção
FROM node:18 AS builder

WORKDIR /app

# Copiar arquivos de configuração e dependências
COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

# Compilar o TypeScript
RUN npm run build

# Fase de produção
FROM node:18

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --production

EXPOSE 8080

CMD ["node", "dist/app.js"] 
