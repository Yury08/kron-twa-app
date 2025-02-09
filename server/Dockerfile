FROM node:23.3.0-alpine AS builder

ENV APP_HOME=/server

WORKDIR $APP_HOME

COPY package.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

RUN npm install --production --frozen-lockfile

# --- Этап 2: Запуск в легковесном образе ---

FROM node:23.3.0-alpine AS runner

WORKDIR /server

# Копируем собранное приложение из builder-стадии
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/node_modules ./node_modules
COPY --from=builder /server/package.json ./

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main"]
