FROM node:8-alpine
ARG DEP_VERSION=latest
RUN apk add --update git build-base python postgresql-client && \
    mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install && \
    apk del build-base  python && \
    rm -rf /tmp/* /root/.npm /root/.node-gyp
CMD ["npm", "start"]
