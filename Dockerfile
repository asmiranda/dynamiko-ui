FROM nginx

COPY . /usr/share/nginx/html
COPY ./js/docker-config.js /usr/share/nginx/html/js/config.js
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 8888