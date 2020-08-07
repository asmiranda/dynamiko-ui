FROM nginx

COPY . /usr/share/nginx/html
COPY ./js/docker-config.js /usr/share/nginx/html/js/config.js
COPY ./conf.d/docker-nginx.conf /etc/nginx/conf.d/default.conf
COPY ./certs/ /etc/nginx/certs/.
COPY ./self-certs/ /etc/nginx/self-certs/.

EXPOSE 7777