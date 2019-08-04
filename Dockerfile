FROM node:8.10

RUN mkdir -p /user/src/app
WORKDIR /usr/src/app

RUN npm install

copy . /user/src/app

RUN npm run client-app && \
    cd ..

CMD ["npm","run","dev"]

