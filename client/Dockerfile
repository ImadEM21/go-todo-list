# stage1 - build react app first
FROM node:16.13.1-slim as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV VITE_GA_ID=G-HEBBBVZWZ5

RUN npm install -g pnpm

COPY package.json /app/
COPY pnpm-lock.yaml /app/

RUN pnpm install

COPY . /app

RUN pnpm run build

RUN pnpm run sitemap

COPY images /app/dist/

# stage2 - build the final image and copy the react build files
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
ENTRYPOINT ["nginx", "-g", "daemon off;"]
