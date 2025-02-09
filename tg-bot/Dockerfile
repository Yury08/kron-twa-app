FROM node:23.3.0-alpine AS builder

ENV APP_HOME=/tg_bot

WORKDIR $APP_HOME

COPY package.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

RUN npm install --production --frozen-lockfile

CMD ["npm", "run", "start"]