FROM node:14
WORKDIR /usr/app
COPY . .
RUN yarn
RUN yarn generate
RUN yarn build
CMD ["yarn", "start"]