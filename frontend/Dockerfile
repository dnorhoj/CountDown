FROM node:19-alpine

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 8000

CMD ["yarn", "dev"]