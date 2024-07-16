FROM node:alpine as build
WORKDIR /app
COPY package.json /app/
RUN npm install
RUN npm install @angular/cli -g
COPY . /app
RUN ng build --output-path=./dist/out 

FROM nginx
COPY --from=build /app/dist/out/browser /usr/share/nginx/html
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf