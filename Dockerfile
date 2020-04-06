FROM alpine:latest

# Setup Work directory
WORKDIR /usr/src/bot
COPY package.json ./

# Install everything
RUN apk add --update \
    && apk add --no-cache nodejs-current nodejs-npm \
    && apk add --no-cache --virtual .build git curl build-base g++ \
    && npm install \
    && npm install pm2 -g \
    && apk del .build

# Copy project to WORKDIR
COPY . .

# Run the bot
CMD npm run start:pm2
