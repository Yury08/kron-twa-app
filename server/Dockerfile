FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./

RUN apt-get update && apt-get install -y openssl
RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run build

EXPOSE 5555
CMD ["npm", "run", "start:prod"]
