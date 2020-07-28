FROM danlynn/ember-cli:latest as build

COPY package.json yarn.lock /myapp/

RUN yarn install

COPY . /myapp/

RUN yarn build --environment=production

FROM nginx:alpine

COPY --from=build /myapp/dist /var/www/html
COPY ./contrib/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

COPY ./docker-entrypoint.sh /
ENV TIMED_SSO_CLIENT_HOST https://sso.example.com/auth/realms/example/protocol/openid-connect
ENV TIMED_SSO_CLIENT_ID timed

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
