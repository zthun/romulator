FROM node:lts as setup
WORKDIR /usr/dev
COPY . .
RUN yarn install

FROM setup as check
RUN yarn check

FROM setup as analyze
RUN yarn lint

FROM setup as test
RUN yarn test

FROM setup as build
RUN yarn build

FROM build as release
USER root
RUN git config --global credential.helper store && \
    git config --global user.name "Circle CI" && \
    git config --global user.email "circle-ci@zthunworks.com" && \
    git remote set-url origin https://github.com/zthun/romulator && \
    git remote -v && \
    git checkout latest
RUN --mount=type=secret,id=GIT_CREDENTIALS,dst=/root/.git-credentials npx lerna version --conventional-commits --create-release github --yes -m "chore: version [skip ci]"
RUN --mount=type=secret,id=NPM_CREDENTIALS,dst=/root/.npmrc npx lerna publish from-package --yes

FROM node:lts-alpine as romulator-web-install
RUN npm install -g @zthun/romulator-web

FROM nginx:stable-alpine as romulator-web
COPY --from=romulator-web-install /usr/local/lib/node_modules/@zthun/romulator-web/dist/. /usr/share/nginx/html/

FROM node:lts-slim as romulator-api
RUN npm install -g @zthun/romulator-api
EXPOSE 3000
CMD ["romulator-api"]
