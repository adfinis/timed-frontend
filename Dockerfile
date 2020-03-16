FROM danlynn/ember-cli:latest as build

COPY package.json yarn.lock /myapp/

RUN yarn install

COPY . /myapp/

RUN yarn build --environment=production

FROM nginx:alpine

COPY --from=build /myapp/dist /var/www/html
COPY ./contrib/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

EXPOSE 80

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
