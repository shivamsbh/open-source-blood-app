FROM node:22-alpine3.18

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci

COPY . /app

ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm", "start"]
