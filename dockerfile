# develop stage
FROM node:latest as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g @quasar/cli
COPY . .

# build stage
FROM develop-stage as build-stage
RUN npm install
RUN quasar build

# production stage
FROM nginx:latest as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]