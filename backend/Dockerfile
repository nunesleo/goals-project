FROM node:18-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g nodemon

COPY . .

CMD ["npm", "run", "dev"]