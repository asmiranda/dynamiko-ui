FROM nginx

COPY . /usr/share/nginx/html
COPY ./js/docker-config.js /usr/share/nginx/html/js/config.js
COPY ./conf/docker-nginx.conf /etc/nginx/conf.d/nginx.conf
COPY ./certs/ /etc/nginx/certs/.

EXPOSE 7777