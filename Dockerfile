# Ref: https://gaplo.tech/sb02-docker-build-solution/
FROM node:12.19.0-alpine3.12 as FirstStage
WORKDIR /srv/service
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY src ./src
RUN yarn build \
  && yarn install --production --offline

FROM node:12.19.0-alpine3.12
WORKDIR /srv/service
COPY --from=FirstStage /srv/service /srv/service
CMD [ "yarn", "start" ]