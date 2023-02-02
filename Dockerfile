FROM danlynn/ember-cli:3.28.5 as build

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml /myapp/

RUN pnpm fetch

COPY . /myapp/

RUN pnpm install --frozen-lockfile --offline

RUN pnpm run build --environment=production

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
