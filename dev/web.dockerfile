FROM node:16

WORKDIR /web
CMD [ "sh", "-c", "npm i && npm run r dev"]