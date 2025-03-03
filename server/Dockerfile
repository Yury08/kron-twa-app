FROM node:18-alpine

RUN adduser --disabled-password --no-create-home kron

WORKDIR /usr/src/app
COPY package*.json ./

# Обновляем репозитории Alpine
RUN echo "https://dl-cdn.alpinelinux.org/alpine/latest-stable/main" > /etc/apk/repositories && \
    echo "https://dl-cdn.alpinelinux.org/alpine/latest-stable/community" >> /etc/apk/repositories

# Устанавливаем openssl с помощью apk
RUN apk update && apk add --no-cache openssl
RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run build

EXPOSE 5555
CMD ["npm", "run", "start:prod"]
