FROM node:8

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      nginx \
 && rm -rf /var/lib/apt/lists/* \
 && rm /var/www/html/index.nginx-debian.html \
 && ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN yarn \
 && yarn build -- --environment=production \
 && cp -r /usr/src/app/dist/* /var/www/html/ \
 && mv contrib/nginx.conf /etc/nginx/sites-enabled/default

WORKDIR /var/www/html

EXPOSE 80

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
