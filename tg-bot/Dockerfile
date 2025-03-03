FROM node:18-alpine

RUN adduser --disabled-password --no-create-home kron


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
CMD ["npm", "run", "start"]