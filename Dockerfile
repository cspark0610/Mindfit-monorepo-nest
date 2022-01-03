FROM node:16.13.0

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 5000

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn global add rimraf
RUN yarn global add @nestjs/cli
RUN yarn install --ignore-scripts

COPY . .

RUN yarn build

CMD ["node", "dist/main"]