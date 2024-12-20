FROM nginx:mainline-alpine
LABEL authors="muyunxi"

WORKDIR "/app"

COPY ./dist .

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80
