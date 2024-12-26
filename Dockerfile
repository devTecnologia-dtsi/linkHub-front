FROM node:current-alpine3.20 as build

RUN mkdir -p /usr/src/app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

RUN npm i -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:stable-perl

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/catalogos/browser /usr/share/nginx/html