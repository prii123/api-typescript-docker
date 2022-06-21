FROM node:16.2.0

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]