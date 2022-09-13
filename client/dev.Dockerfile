FROM node:16.13.1-slim

WORKDIR /opt/client

RUN npm install -g pnpm

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

ENTRYPOINT pnpm run dev