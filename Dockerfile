FROM nginx

COPY . /usr/share/nginx/html
COPY ./js/docker-config.js /usr/share/nginx/html/js/config.js
COPY ./conf.d/docker-nginx.conf /etc/nginx/conf.d/default.conf

# ADD https://raw.githubusercontent.com/asmiranda/dynamiko-ui/master/certs/fullchain.pem /etc/nginx/certs/.
# ADD https://raw.githubusercontent.com/asmiranda/dynamiko-ui/master/certs/privkey.pem /etc/nginx/certs/.
# ADD https://raw.githubusercontent.com/asmiranda/dynamiko-ui/master/certs/cert.pem /etc/nginx/certs/.
# ADD https://raw.githubusercontent.com/asmiranda/dynamiko-ui/master/certs/chain.pem /etc/nginx/certs/.
COPY ./certs/ /etc/nginx/certs/.
COPY ./self-certs/ /etc/nginx/self-certs/.

EXPOSE 443