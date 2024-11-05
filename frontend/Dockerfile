FROM nginx:latest
LABEL authors="muyunxi"

WORKDIR "/app"

COPY ./dist .

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

USER nobody
