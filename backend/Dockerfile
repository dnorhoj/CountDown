FROM node:19-alpine

WORKDIR /app

RUN apk add --no-cache openssl libssl1.1

COPY . .

RUN yarn install

EXPOSE 8000

CMD ["yarn", "push:setup:start"]
