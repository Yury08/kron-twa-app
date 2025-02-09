FROM node:23.3.0-alpine AS builder

ENV APP_HOME=/client

WORKDIR $APP_HOME

COPY package.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

RUN npm install --production --frozen-lockfile

EXPOSE 3000

CMD ["npm", "run", "start"]