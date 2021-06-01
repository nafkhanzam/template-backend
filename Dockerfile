FROM node:14
WORKDIR /usr/app
COPY ./build ./build
COPY ./assets ./assets
COPY package.json .
COPY yarn.lock .
COPY .env .
COPY tsconfig.json .
COPY tsconfig-bootstrap-paths.js .
COPY ./prisma ./prisma
RUN yarn install --production
RUN yarn generate
CMD ["yarn", "start"]