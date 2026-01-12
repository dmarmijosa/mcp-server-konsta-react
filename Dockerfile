# ETAPA 1: BUILD (Compilación)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ETAPA 2: PRODUCCIÓN (Lo que corre en el servidor)
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# --- LÍNEA NUEVA Y CRUCIAL ---
# Copiamos la carpeta public desde el builder a la imagen final
COPY --from=builder /app/public ./public
# -----------------------------
EXPOSE 3000
CMD ["node", "dist/main"]