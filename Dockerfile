FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY modules ./modules

RUN npm ci

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 8085

CMD [ "serve", "-s", "dist" ]
