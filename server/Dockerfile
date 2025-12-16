FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY src ./src
COPY .env.example ./

ENV NODE_ENV=production

CMD [ "node", "src/index.js" ]