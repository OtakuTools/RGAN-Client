FROM nginx
WORKDIR .
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist /etc/nginx/html/