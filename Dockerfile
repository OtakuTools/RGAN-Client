FROM node
WORKDIR .
RUN npm install -g @vue/cli
RUN npm run build
RUN apt-get install build-essential libtool libpcre3 libpcre3-dev zlib1g-dev
RUN wget http://nginx.org/download/nginx-1.17.8.tar.gz
RUN tar -zxvf nginx-1.17.8.tar.gz
RUN ./nginx-1.17.8/configure --prefix=/etc/nginx
RUN ./nginx-1.17.8/make
RUN ./nginx-1.17.8/make isntall
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist /etc/nginx/html/